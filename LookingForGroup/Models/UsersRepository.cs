using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace LookingForGroup.Models
{
    public class UsersRepository 
    {
        static string dbPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/data.db");
        static LiteDB.LiteDatabase db = new LiteDB.LiteDatabase(dbPath);
        public User Find(int id)
        {
            return db.GetCollection<User>().FindById(id);
        }
        //public User FindByEmail(string email)
        //{
        //    return db.GetCollection<User>().FindOne(u => u.Email == email);
        //}
        public User FindByBattleTag(string battleTag)
        {
            return db.GetCollection<User>().FindOne(u => u.BattleTag == battleTag);
        }
        public IEnumerable<User> FindAll()
        {
            return db.GetCollection<User>().FindAll();
        }

        public IEnumerable<User> Query(Expression<Func<User, bool>> query)
        {
            return db.GetCollection<User>().Find(query);
        }

        public void Add(User user)
        {
            db.GetCollection<User>().Insert(user);
        }

        public void Update(User user)
        {
            db.GetCollection<User>().Update(user);
        }
        public void Remove(User user)
        {
            db.GetCollection<User>().Delete(user.Id);
        }
    }
}