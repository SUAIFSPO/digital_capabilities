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
                .WithMany(g => g.User)
                .UsingEntity(j => j.ToTable("UserGroups"));

            modelBuilder.Entity<User>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.User)
                .HasForeignKey(u => u.ActivityId);
        }

        private void Init()
        {
            List<Activity> activities = new List<Activity>();
            List<Group> groups = new List<Group>();

            for(int i = 10; i < 20; i++)
            {
                groups.Add(new Group()
                {
                    Number = i.ToString()
                });
            }

            activities.Add(new Activity()
            {
                Name = "Оипд",
                FIO = "Константин Ильч",
                StartTime = DateTime.Now.AddDays(1),
                EndTime = DateTime.Now.AddDays(1).AddHours(1),
                Link = "https://google.com",
                Listeners = new List<Group>()
                {
                    groups[0]
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
                    groups[1]
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
                    groups[2]
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
                    groups[3]
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
                    groups[4]
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
                    groups[5]
                }
            });

            Activities.AddRange(activities);


            Users.Add(new User()
            {
                Login = "admin",
                Name = "Константин Ильич",
                Password = "nimda",
                Type = "administrator",
                RecoveryWord = "recword1",
                Groups = new List<Group>()
                {
                    groups[0],
                }
            });

            Users.Add(new User()
            {
                Login = "user",
                Name = "Иван Сидоров",
                Password = "user1",
                Type = "user",
                RecoveryWord = "recword2",
                Groups = new List<Group>()
                {
                    groups[0],
                }
            });

            for(int j = 1; j < 4; j++)
            {
                int g1 = new Random(Environment.TickCount).Next(0, groups.Count - 1);

                for (int i = 0; i < 10; i++)
                {
                    Users.Add(new User()
                    {
                        Login = $"user{j}{i}",
                        Name = $"User {j}{i}",
                        Password = "user",
                        Type = "user",
                        RecoveryWord = "user",
                        Groups = new List<Group>()
                        {
                            groups[g1],
                        }
                    });
                }
            }
            

            Users.Add(new User()
            {
                Login = "recovery",
                Name = "Recovery",
                Password = "rec",
                Type = "user",
                RecoveryWord = "recword3",
                Groups = new List<Group>()
                { 
                    groups[5],
                    groups[6],
                }
            });

            Groups.AddRange(groups);


            SaveChanges();
        }
    }
}
