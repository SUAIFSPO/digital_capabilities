using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public List<Group> Listeners { get; set; }
        public string FIO { get; set; }
        public string Link { get; set; }

        [JsonIgnore]
        public DaySchedule Schedule { get; set; }

        [JsonIgnore] 
        public int ScheduleId { get; set; }
    }
}
  