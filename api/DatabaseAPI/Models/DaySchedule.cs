using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class DaySchedule
    {
        public int Id { get; set; }
        public List<Activity> Activities { get; set; }
        public DateTime Date { get; set; }
    }
}
