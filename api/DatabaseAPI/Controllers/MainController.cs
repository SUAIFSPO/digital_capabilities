using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DatabaseAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : AbstractController
    {
        public MainController(ApplicationContext db) : base(db)
        {
        }
    }
}