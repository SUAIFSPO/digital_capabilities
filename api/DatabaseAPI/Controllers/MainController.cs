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


        [HttpGet("getSchedule/{from}/{to}")]
        public IActionResult GetSchedule(long from, long to)
        {
            var user = GetUser();
            if (user == null)
            {
                DateTime start = DateTimeOffset.FromUnixTimeSeconds(from).DateTime;
                DateTime end = DateTimeOffset.FromUnixTimeSeconds(to).DateTime;

                var res = _db.DaySchedules.Where(d => d.Date > start && d.Date < end);
                return new OkObjectResult(new { success = true, schedule = res });
            }
            return new BadRequestObjectResult(new { success = false });
        }

        [HttpGet("search/{text}")]
        public IActionResult Search(string text)
        {
            var user = GetUser();
            var result = new List<Activity>();
            // if ...
            if(_db.Activities.Any(a => a.Name.Contains(text)))
            {
                result = _db.Activities.Where(a => a.Name.Contains(text)).ToList();
            }

            return new OkObjectResult(new { success = true, activities = result });

        }
    }
}