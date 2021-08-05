using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseAPI.Models;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatabaseAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ActivitiesController : AbstractController
    {
        public ActivitiesController(ApplicationContext db) : base(db)
        {
        }

        [HttpPost("getSchedule/{from}/{to}")]
        public IActionResult GetSchedule(long from, long to, [FromForm] string group, [FromForm] string name, [FromForm] string fio)
        {
            var user = GetUser();
            if (user == null)
            {
                DateTime start = DateTimeOffset.FromUnixTimeSeconds(from).Date;
                DateTime end = DateTimeOffset.FromUnixTimeSeconds(to).Date;

                IQueryable<Activity> res = _db.Activities
                    .Where(d => d.StartTime.Date > start && d.EndTime.Date <= end)
                    .Include(a => a.Listeners)
                    .AsSplitQuery();


                if (!string.IsNullOrEmpty(group))
                {
                    res = res.Where(a => a.Listeners.Any(l => l.Number == group));
                }
                if (!string.IsNullOrEmpty(name))
                {
                    res = res.Where(a => a.Name.Contains(name));
                }
                if (!string.IsNullOrEmpty(fio))
                {
                    res = res.Where(a => a.FIO.Contains(fio));
                }

                return new OkObjectResult(new { success = true, schedule = res });
            }
            return new BadRequestObjectResult(new { success = false });
        }

        [HttpPost("getFio")]
        public IActionResult GetFio([FromForm] string name)
        {
            List<TeacherSurname> ts = new List<TeacherSurname>();
            IQueryable<Activity> res = _db.Activities
                    .Include(a => a.Listeners)
                    .AsSplitQuery();

            foreach (var person in res.Where(a => name != null ? a.FIO.Contains(name) : true))
            {
                ts.Add(new TeacherSurname()
                {
                    FIO = person.FIO,
                    Activity = person.Name,
                });
            }

            return new OkObjectResult(new { success = true, surnames = ts });
        }


        [HttpPost("getGroups")]
        public IActionResult GetGroups([FromForm] string group)
        {
            return new OkObjectResult(new { success = true,
                groups = _db.Groups.Where(g => group != null ? g.Number.Contains(group) : true).Select(g => g.Number)
            });
        }

        [HttpPost("getNames")]
        public IActionResult GetNames([FromForm] string name)
        {
            return new OkObjectResult(new
            {
                success = true,
                names = _db.Activities.Where(a => name != null ? a.Name.Contains(name) : true).Select(a => a.Name)
            });
        }


        [HttpGet("search/{text}")]
        public IActionResult Search(string text)
        {
            var user = GetUser();
            var result = new List<Activity>();
            // if ...
            if (_db.Activities.Any(a => a.Name.Contains(text)))
            {
                result = _db.Activities.Where(a => a.Name.Contains(text)).ToList();
            }

            return new OkObjectResult(new { success = true, activities = result });
        }

        [HttpGet("getAll")]
        public IActionResult GetAllActivities()
        {
            // if...
            var user = GetUser();
            return new OkObjectResult(
                new { success = true, activities = _db.Activities
                    .Include(a => a.Listeners)
                    .ToList()
                });
            // return BadRequest();
        }

        [HttpPost("create")]
        public IActionResult CreateNewActivity([FromForm] Activity activity, [FromForm]string listeners)
        {
            var user = GetUser();
            if(user != null && user.Type == "administrator" && !string.IsNullOrEmpty(listeners) && !string.IsNullOrEmpty(activity.Name))
            {
                _db.Activities.Add(activity);
                activity.Listeners = listeners.Split(";").Select(s => _db.Groups.Where(g => g.Number == s).First()).ToList();
                _db.SaveChanges();

                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("change")]
        public IActionResult ChangeActivity([FromForm]Activity activity)
        {
            if(_db.Activities.Any(a => a.Id == activity.Id))
            {
                _db.Activities.Update(activity);
                _db.SaveChanges();

                return Ok();
            }
            return BadRequest();
        }

        [HttpGet("export")]
        public IActionResult ExportFile()
        {
            Calendar calendar = new Calendar();

            foreach(var activity in _db.Activities.Include(a => a.Listeners))
            {
                string descr = string.Join(", ", activity.Listeners.Select(l => l.Number));
                
                CalendarEvent e = new CalendarEvent()
                {
                    Url = new Uri(activity.Link),
                    Contacts = { activity.FIO },
                    Summary = activity.Name,
                    Description = descr,
                    Start = new CalDateTime(activity.StartTime),
                    End = new CalDateTime(activity.EndTime)
                };

                calendar.Events.Add(e);
            }

            var serializer = new CalendarSerializer();
            var serializedCalendar = serializer.SerializeToString(calendar);

            return File(Encoding.Default.GetBytes(serializedCalendar), "text/calendar", "Schedule.ical");
        }

        [HttpPost("import")]
        public IActionResult ImportFile(IFormFile file)
        {
            using(StreamReader reader = new StreamReader(file.OpenReadStream()))
            {
                string data = reader.ReadToEnd();
                Calendar calendar = Calendar.Load(data);

                foreach (var e in calendar.Events)
                {
                    var list = e.Description.Split(", ").Select(g => new Group() { Number = g }).ToList();
                    _db.Activities.Add(new Activity()
                    {
                        Link = e.Url.ToString(),
                        FIO = e.Contacts.First(),
                        Name = e.Summary,
                        StartTime = e.Start.AsDateTimeOffset.DateTime,
                        EndTime = e.End.AsDateTimeOffset.DateTime,
                        Listeners = list
                    });
                }

                _db.SaveChanges();
            }
            return Ok();
        }

        [HttpPost("setLink")]
        public IActionResult SetLink([FromForm]int id, [FromForm]string newLink)
        {
            if(_db.Activities.Any(a => a.Id == id))
            {
                var activity = _db.Activities.First(a => a.Id == id);
                activity.Link = newLink;
                activity.IsRecorded = true;

                _db.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }
    }
}
