using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseAPI.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Group> Groups { get; set; }
        public ApplicationContext(DbContextOptions options) : base(options)
        {
            if (Database.EnsureCreated())
            {
                Init();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activity>()
                .HasMany(a => a.Listeners)
                .WithOne(g => g.Activity)
                .HasForeignKey(g => g.ActivityId);
        }

        private void Init()
        {
            List<Activity> activities = new List<Activity>();

            activities.Add(new Activity()
            {
                Name = "Оипд",
                FIO = "Константин Ильич",
                StartTime = DateTime.Now.AddDays(1),
                EndTime = DateTime.Now.AddDays(1).AddHours(1),
                Link = "https://google.com",
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = "22"
                    }
                }
            });

            Activities.AddRange(activities);

            Users.Add(new User()
            {
                Login = "admin",
                Name = "Константин Ильич",
                Password = "nimda",
                Type = "administrator",
            });

            Users.Add(new User()
            {
                Login = "user",
                Name = "Иван Сидоров",
                Password = "user1",
                Type = "user",
            });


            Users.Add(new User()
            {
                Login = "recovery",
                Name = "Recovery",
                Password = "rec",
                Type = "user",
            });


            SaveChanges();
        }
    }
}
