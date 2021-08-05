using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string Number { get; set; }
        [JsonIgnore]
        public Activity? Activity { get; set; }
        [JsonIgnore]
        public int? ActivityId { get; set; }
        [JsonIgnore]
        public List<User> User { get; set; }
        [JsonIgnore]
        public int? UserId { get; set; }
    }
}
