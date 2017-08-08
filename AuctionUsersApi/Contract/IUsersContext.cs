using Models.Classes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace Contract
{
    public interface IUsersContext
    {
        DbSet<Users> Users { get; set; }
        int SaveChanges();
        DbEntityEntry Entry(object o);
        void Dispose();
    }
}