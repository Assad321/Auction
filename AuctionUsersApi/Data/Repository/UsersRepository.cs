using Contract.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Models.Classes;
using Contract;
using System.Data.Entity;

namespace Data.Repository
{
    public class UsersRepository : IUserRepository
    {
        private readonly IUsersContext _db;

        public UsersRepository()
        {
            _db = new UsersContext();
        }
        public UsersRepository(UsersContext db)
        {
            _db = db;
        }

        public IQueryable<Users> GetAll()
        {
            return _db.Users.Where(p => p.IsDeleted == false);
        }

        public bool Save(Users item)
        {
            bool result = true;
            try
            {
                var dbItem = new Users();
                var isNew = false;
                var check = _db.Users.Where(p => p.Id == item.Id && p.IsDeleted == false).ToList();
                if (check.Count > 0)
                {
                    dbItem = check.First();
                    _db.Entry(dbItem).State = EntityState.Modified;
                    dbItem.ModifiedBy = "admin";
                    dbItem.DateModified = DateTime.UtcNow;
                }
                else
                {
                    dbItem.DateAdded = DateTime.UtcNow;
                    dbItem.AddedBy = "admin";
                    isNew = true;
                }
                dbItem.FirstName = item.FirstName;
                dbItem.LastName = item.LastName;
                dbItem.Email = item.Email;
                dbItem.Password = item.Password;

                dbItem.IsDeleted = false;
                if (isNew)
                {
                    _db.Entry(dbItem).State = EntityState.Added;
                    _db.Users.Add(dbItem);
                }
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public bool Delete(int id)
        {
            try
            {
                var user = _db.Users.Where(m => m.Id == id).SingleOrDefault();

                _db.Users.Attach(user);
                _db.Users.Remove(user);
                _db.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}