using Models.Classes;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace Data.Migrations
{
    internal sealed class Configration : DbMigrationsConfiguration<UsersContext>
    {
        public Configration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;

        }

        protected override void Seed(UsersContext context)
        {
            context.Users.AddOrUpdate(
                p => p.Email,
                new Users
                {
                    FirstName = "Ahmed",
                    LastName = "Khateeb",
                    Email = "khateeb321@gmail.com",
                    Password = "abc123"
                },
                new Users
                {
                    FirstName = "Alan",
                    LastName = "Walker",
                    Email = "alan@hotmail.com",
                    Password = "abc123"
                },
                new Users
                {
                    FirstName = "Bill",
                    LastName = "Brain",
                    Email = "bill@yahoo.com",
                    Password = "abc123"
                },
                new Users
                {
                    FirstName = "Maria",
                    LastName = "Cerney",
                    Email = "maria@gmail.com",
                    Password = "abc123"
                },
                new Users
                {
                    FirstName = "Laura",
                    LastName = "Alice",
                    Email = "laura@outlook.com",
                    Password = "abc123"
                }
                );
        }
    }
}