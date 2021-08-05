using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using DatabaseAPI.Models;
using DlibDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatabaseAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : AbstractController
    {
        private const int diff = 20;
        public UsersController(ApplicationContext db) : base(db)
        {
        }

        [HttpPost("loadPhotos")]
        public IActionResult LoadPhotos([FromForm]IFormFileCollection photos)
        {
            string errMsg = "";
            int successed = 0;
            foreach(var file in photos)
            {
                using StreamReader reader = new StreamReader(file.OpenReadStream());
                string data = reader.ReadToEnd();

                string filename = file.FileName.Split(".")[0];
                if (filename.Contains("_"))
                {
                    string fio = filename.Split("_")[0];
                    string group = filename.Split("_")[1];

                    if (_db.Groups.Any(g => g.Number == group))
                    {
                        var dbGroup = _db.Groups.Where(g => g.Number == group).First();
                        if (_db.Users.Any(g => g.Name == fio))
                        {
                            var user = _db.Users
                                .Where(u => u.Name == fio)
                                .Include(g => g.Groups)
                                .First();
                            if(!user.Groups.Contains(dbGroup))
                            {
                                user.Groups.Add(dbGroup);
                            }
                            user.Photo = Encoding.Default.GetBytes(data);

                            long fs = GetFaceSize(file.OpenReadStream());
                            user.FaceSize = fs;

                            var lines = GetFaceLines(file.OpenReadStream(), fs);
                            user.Face = string.Join(";", lines);

                            successed++;
                        }
                        else
                            errMsg += "Пользователь не найден. Имя пользователя: " + fio + "\n";
                    }
                    else
                        errMsg += "Группа не найдена. Номер группы: " + group + "\n";
                }
                else
                    errMsg += "Неверный форман имени. Принимается ФИО_Номер-группы";
            }
            _db.SaveChanges();
            return new OkObjectResult(new { errors = errMsg, successed });
        }

        [HttpPost("setUserGroups")]
        public IActionResult SetUserGroups([FromForm]string login, [FromForm]string groups, [FromForm]string activity)
        {
            if(_db.Users.Any(u => u.Login == login))
            {
                var user = _db.Users.First(u => u.Login == login);
                if(activity != null)
                    user.Activity = _db.Activities.First(a => a.Name == activity);
                if (groups != null && groups.Length > 0)
                {
                    var groupsList = groups.Split("_");
                    user.Type = "curator";
                    user.Groups = new List<Group>();
                    foreach (var group in groupsList)
                    {
                        if (user.Groups.Any(g => g.Number == group))
                            continue;

                        user.Groups.Add(_db.Groups.First(g => g.Number == group));
                    }
                }
                else
                {
                    user.Type = "user";
                    if(user.Groups != null)
                        user.Groups.Clear();
                }
                
                _db.SaveChanges();

                return new OkObjectResult(new { success = true });
            }
            return new BadRequestObjectResult(new { success = false, error = "Пользователь с таким именем не найден" });
        }

        private List<double> GetFaceLines(Stream file, long size)
        {
            using var shapePredictor = ShapePredictor.Deserialize("shape_predictor_68_face_landmarks.dat");
            using var fd = Dlib.GetFrontalFaceDetector();
            string filename = $"face_{DateTime.Now.ToFileTime()}.jpg";

            List<double> result = new List<double>();

            var img = LoadImage(file);
            var faces = fd.Operator(img);
            foreach (var face in faces)
            {
                var shape = shapePredictor.Detect(img, face);
                for (uint i = 1; i < shape.Parts; i++)
                {
                    long del = 1;
                    if (size != 0)
                        del = face.Width * face.Height / size;

                    double len = Math.Sqrt(Math.Pow(shape.GetPart(i).X - shape.GetPart(i - 1).X, 2) + Math.Pow(shape.GetPart(i).Y - shape.GetPart(i - 1).Y, 2));
                    result.Add(len / del);
                }

            }

            return result;
        }

        private long GetFaceSize(Stream file)
        {
            using var fd = Dlib.GetFrontalFaceDetector();
            string filename = $"face_{DateTime.Now.ToFileTime()}.jpg";

            long result = 0;

            var img = LoadImage(file);
            var faces = fd.Operator(img);
            result = faces[0].Width * faces[0].Height;

            return result;
        }

        [HttpPost("identity")]
        public IActionResult Identity(IFormFile file)
        {
            var first = GetFaceLines(file.OpenReadStream(), 0);

            var curUser = GetUser();

            User result = null;
            int maxMatched = 0;
            if(curUser != null && curUser.Groups != null)
            {
                foreach (var group in curUser.Groups)
                {
                    foreach (var user in _db.Users.Where(u => u.Groups.Contains(group)))
                    {
                        int matched = 0;
                        if (user.Face == null)
                            continue;

                        List<double> userLines = user.Face.Split(";").Select(l => double.Parse(l)).ToList();
                        int points = Math.Min(userLines.Count, first.Count);
                        for (int i = 0; i < points; i++)
                        {
                            if (Math.Abs(first[i] - userLines[i]) <= diff)
                            {
                                matched++;
                            }
                        }
                        if (matched > points / 2 && matched > maxMatched)
                        {
                            maxMatched = matched;
                            result = user;
                        }
                    }
                }
            }
            

            if(result != null)
            {
                return new OkObjectResult(new { success = true, fio = result.Name });
            }
            return new BadRequestObjectResult(new { success = false, error = "Студент не входит в ваши учебные группы" });
        }

        [HttpGet("getAll")]
        public List<User> GetAllUsers()
        {
            return _db.Users
                .Include(u => u.Groups)
                .Include(u => u.Activity)
                .ToList();
        }

        private Array2D<RgbPixel> LoadImage(Stream image)
        {
            Bitmap bitmap = (Bitmap)Bitmap.FromStream(image);
            System.Drawing.Rectangle rect = new System.Drawing.Rectangle(0, 0, bitmap.Width, bitmap.Height);
            System.Drawing.Imaging.BitmapData data = bitmap.LockBits(rect, System.Drawing.Imaging.ImageLockMode.ReadWrite, bitmap.PixelFormat);

            var array = new byte[data.Stride * data.Height];
            Marshal.Copy(data.Scan0, array, 0, array.Length);

            return Dlib.LoadImageData<RgbPixel>(array, (uint)bitmap.Height, (uint)bitmap.Width, (uint)data.Stride);
        }
    }
}
