using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseAPI.Models;

namespace DatabaseAPI.Controllers
{
    public abstract class AbstractController : ControllerBase
    {
        protected ApplicationContext _db;
        protected AbstractController(ApplicationContext db)
        {
            _db = db;
        }

        protected User GetUser()
        {
            string token = ControllerContext.HttpContext.Request.Headers["Token"];
            if(!string.IsNullOrEmpty(token))
            {
                if(_db.Users.Any(u => u.Token == token))
                {
                    return _db.Users.Where(u => u.Token == token).First();
                }
            }
            return null;
        }
    }
}
