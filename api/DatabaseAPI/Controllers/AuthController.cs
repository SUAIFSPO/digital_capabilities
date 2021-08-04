using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DatabaseAPI.Models;

namespace DatabaseAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : AbstractController
    {
        public AuthController(ApplicationContext db) : base(db)
        {
        }

        [HttpPost("login")]
        public IActionResult Auth([FromForm]string login, [FromForm]string password)
        {
            string errMsg = "";
            if (_db.Users.Any(u => u.Login == login))
            {
                var user = _db.Users.Where(u => u.Login == login).First();
                if (user.Password == password)
                {
                    using (MD5 md = MD5.Create())
                    {
                        byte[] hash = md.ComputeHash(Encoding.Default.GetBytes(user.Password + DateTime.UtcNow.ToLongTimeString()));
                        user.Token = string.Join("", hash.Select(b => b.ToString("X2")));
                        _db.SaveChanges();
                    }
                    return new OkObjectResult(new { success = true, token = user.Token, type = user.Type });
                }
                else
                    errMsg = "Пароль неверен";
            }
            else
                errMsg = "Указанный пользователь не найден";

            return new BadRequestObjectResult(new { success = false, error = errMsg });
        }

        [HttpPost("recovery")]
        public IActionResult Recovery([FromForm]string login, [FromForm]string fio)
        {
            if(_db.Users.Any(u => u.Login == login && u.Name == fio))
            {
                var user = _db.Users.Where(u => u.Login == login).First();
                string newPass = RandomString(10);

                user.Password = newPass;
                _db.SaveChanges();

                return new OkObjectResult(new { success = true, password = newPass });
            }
            return new BadRequestObjectResult(new { success = false });
        }

        private string RandomString(int length)
        {
            Random _random = new Random(Environment.TickCount);
            string chars = "0123456789abcdefghijklmnopqrstuvwxyz";
            StringBuilder builder = new StringBuilder(length);

            for (int i = 0; i < length; ++i)
                builder.Append(chars[_random.Next(chars.Length)]);

            return builder.ToString();
        }
    }
}
