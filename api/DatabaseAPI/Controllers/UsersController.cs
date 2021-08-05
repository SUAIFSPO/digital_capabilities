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
        private const int diff = 30;
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

                            var lines = GetFaceLines(file.OpenReadStream());
                            user.Face = string.Join(",", lines);

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
        public IActionResult SetUserGroups([FromForm]string login, [FromForm]string groups)
        {
            if(_db.Users.Any(u => u.Login == login))
            {
                var user = _db.Users.First(u => u.Login == login);
                if(groups != null && groups.Length > 0)
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
                    user.Groups.Clear();
                }
                
                _db.SaveChanges();

                return new OkObjectResult(new { success = true });
            }
            return new BadRequestObjectResult(new { success = false, error = "Пользователь с таким именем не найден" });
        }

        private List<double> GetFaceLines(Stream file)
        {
            using var shapePredictor = ShapePredictor.Deserialize("shape_predictor_68_face_landmarks.dat");
            using var fd = Dlib.GetFrontalFaceDetector();
            var faceDetector = Dlib.GetFrontalFaceDetector();
            string filename = $"face_{DateTime.Now.ToFileTime()}.jpg";

            List<double> result = new List<double>();

            var img = LoadImage(file);
            var faces = fd.Operator(img);
            foreach (var face in faces)
            {
                var shape = shapePredictor.Detect(img, face);
                for (uint i = 1; i < shape.Parts; i++)
                {
                    double len = Math.Sqrt(Math.Pow(shape.GetPart(i).X - shape.GetPart(i - 1).X, 2) + Math.Pow(shape.GetPart(i).Y - shape.GetPart(i - 1).Y, 2));
                    result.Add(len);
                }

            }

            return result;
        }

        [HttpPost("identity")]
        public IActionResult Identity(IFormFile file)
        {
            var first = GetFaceLines(file.OpenReadStream());

            User result = null;
            int maxMatched = 0;
            foreach (var user in _db.Users)
            {
                int matched = 0;
                if (user.Face == null)
                    continue;
                List<double> userLines = user.Face.Split(",").Select(l => double.Parse(l)).ToList();
                for (int i = 0; i < first.Count; i++)
                {
                    if(Math.Abs(first[i] - userLines[i]) <= diff)
                    {
                        matched++;
                    }
                }
                if (matched > 20 && matched > maxMatched)
                {
                    maxMatched = matched;
                    result = user;
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
