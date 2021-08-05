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

            modelBuilder.Entity<User>()
                .HasMany(u => u.Groups)
                .WithOne(g => g.User)
                .HasForeignKey(g => g.UserId);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.User)
                .HasForeignKey(u => u.ActivityId);
        }

        private void Init()
        {
            List<Activity> activities = new List<Activity>();

            activities.Add(new Activity()
            {
                Name = "Оипд",
                FIO = "Константин Ильч",
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

            activities.Add(new Activity()
            {
                Name = "Информатика",
                FIO = "Илья константинович",
                StartTime = DateTime.Now,
                EndTime = DateTime.Now.AddHours(1),
                Link = "https://yandex.ru",
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = "21"
                    }
                }
            });

            activities.Add(new Activity()
            {
                Name = "История",
                FIO = "Александр Сергеевич",
                StartTime = DateTime.Now.AddDays(2),
                EndTime = DateTime.Now.AddDays(2).AddHours(1),
                Link = "https://yandex.ru",
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = "81"
                    }
                }
            });

            activities.Add(new Activity()
            {
                Name = "Русский язык",
                FIO = "Елена Вячеславовна",
                StartTime = DateTime.Now.AddDays(3),
                EndTime = DateTime.Now.AddDays(3).AddHours(1),
                Link = "https://yandex.ru",
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = "18"
                    }
                }
            });

            activities.Add(new Activity()
            {
                Name = "Рисование",
                FIO = "Вероника Степановна",
                StartTime = DateTime.Now.AddDays(4),
                EndTime = DateTime.Now.AddDays(4).AddHours(1),
                Link = "https://yandex.ru",
                Listeners = new List<Group>()
                {
                    new Group()
                    {
                        Number = "68"
                    }
                }
            });

            activities.Add(new Activity()
            {
                Name = "Обществознание",
                FIO = "Вероника Степановна",
                StartTime = DateTime.Now.AddDays(6),
                EndTime = DateTime.Now.AddDays(6).AddHours(1),
                Link = "https://yandex.ru",
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
                RecoveryWord = "recword1"
            });

            Users.Add(new User()
            {
                Login = "user",
                Name = "Иван Сидоров",
                Password = "user1",
                Type = "user",
                RecoveryWord = "recword2"
            });


            Users.Add(new User()
            {
                Login = "recovery",
                Name = "Recovery",
                Password = "rec",
                Type = "user",
                RecoveryWord = "recword3",
            });


            SaveChanges();
        }
    }
}
