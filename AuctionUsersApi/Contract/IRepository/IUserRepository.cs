using Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Contract.IRepository
{
    public interface IUserRepository
    {
        IQueryable<Users> GetAll();
        bool Save(Users item);
        bool Delete(int id);
    }
}