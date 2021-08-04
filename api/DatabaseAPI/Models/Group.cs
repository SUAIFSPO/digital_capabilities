﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class Group
    {
        public int Id { get; set; }
        public int Number { get; set; }
        [JsonIgnore]
        public Activity Activity { get; set; }
        [JsonIgnore]
        public int ActivityId { get; set; }
    }
}
