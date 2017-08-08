using Contract;
using Models.Classes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Data
{
    public class UsersContext : DbContext, IUsersContext
    {
        public UsersContext()
        {
            Database.Connection.ConnectionString = @"Server=tcp:auctiondb321.database.windows.net;Database=myDataBase;
                                                     User ID=khateeb321@auctiondb321;Password=abc@54321;Trusted_Connection=False;
                                                     Encrypt=True;";
        }
        public DbSet<Users> Users { get; set; }
    }
}