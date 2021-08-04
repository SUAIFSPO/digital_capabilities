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
        public DbSet<DaySchedule> DaySchedules { get; set; }
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
            modelBuilder.Entity<DaySchedule>()
                .HasMany(d => d.Activities)
                .WithOne(a => a.Schedule)
                .HasForeignKey(p => p.ScheduleId);

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
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = 22
                    }
                }
            });

            DaySchedules.Add(new DaySchedule()
            {
                Activities = activities,
                Date = DateTime.Now.AddDays(1),
            });

            Users.Add(new User()
            {
                Login = "admin",
                Name = "Константин Ильич",
                Password = "nimda",
                Type = "administrator",
            });



            SaveChanges();
        }
    }
}
