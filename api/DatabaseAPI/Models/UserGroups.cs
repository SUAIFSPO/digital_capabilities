using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class UserGroups
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Group Group { get; set; }
    }
}
