using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public string Login { get; set; }
        public string Name { get; set; }
        public byte[] Photo { get; set; }
        public List<Group> Groups { get; set; }
        public string Face { get; set; }
        public string Type { get; set; }
        [JsonIgnore]
        public string Token { get; set; }
        [JsonIgnore]
        public string RecoveryWord { get; set; }
        public Activity? Activity { get; set; }
        [JsonIgnore]
        public int? ActivityId { get; set; }
    }
}
