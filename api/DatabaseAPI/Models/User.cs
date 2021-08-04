﻿using System;
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
        public string Type { get; set; }
        [JsonIgnore]
        public string Token { get; set; }
        [JsonIgnore]
        public string RecoveryWord { get; set; }
        [JsonIgnore]
        public List<Activity> Activities { get; set; }
    }
}