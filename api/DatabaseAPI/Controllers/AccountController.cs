using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatabaseAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : AbstractController
    {
        public AccountController(ApplicationContext db) : base(db)
        {
        }

        [HttpPost("newPassword")]
        public IActionResult SetNewPassword([FromForm]string oldPassword, [FromForm]string newPassword)
        {
            var user = GetUser();
            if (user != null)
            {
                if(user.Password == oldPassword)
                {
                    user.Password = newPassword;
                    _db.SaveChanges();

                    return new OkObjectResult(new { success = true });
                }
            }
            return new BadRequestObjectResult(new { success = false });
        }
    }
}
