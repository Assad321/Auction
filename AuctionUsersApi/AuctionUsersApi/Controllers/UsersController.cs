using Contract.IRepository;
using Data.Repository;
using Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AuctionUsersApi.Controllers
{
    [RoutePrefix("api/users")]

    public class UsersController : Controller
    {
        // GET: Users
        private readonly IUserRepository _user = new UsersRepository();
        // GET: User
        public ActionResult GetAll()
        {
            var result = _user.GetAll().ToList();
            return Json(result, JsonRequestBehavior.AllowGet);

        }
        public ActionResult Login(string email, string password)
        {
            var result = _user.GetAll().ToList().FirstOrDefault(p => p.Email.ToLower() == email.ToLower() && p.Password == password);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Save(string firstName, string lastName, string email, string password)
        {
            Users user = new Users { FirstName = firstName,
                                     LastName = lastName,
                                     Email = email,
                                     Password = password};
            var result = _user.Save(user);
            if (result)
                return Json(user, JsonRequestBehavior.AllowGet);
            else
                return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Delete(int id)
        {
            var result = _user.Delete(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}