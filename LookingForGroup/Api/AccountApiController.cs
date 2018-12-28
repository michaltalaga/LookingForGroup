using LookingForGroup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Http;

namespace LookingForGroup.Api
{
    public class AccountApiController : ApiController
    {
        UsersRepository usersRepository = new UsersRepository();
        [Route("api/Account/GetAccountDetails")]
        public AccountDetails GetAccountDetails(int? id)
        {
            if (id == null)
            {
                CheckIsAuthenticated();
                var user = usersRepository.FindByBattleTag(User.Identity.Name);
                return new AccountDetails(user);
            }
            else
            {
                var user = usersRepository.Find(id.Value);
                var accountDetails = new AccountDetails(user);
                //accountDetails.Email = null;
                return accountDetails;
            }
        }

        [HttpPost]
        [Route("api/Account/UpdateAccout")]
        public void UpdateAccount(AccountDetails accountDetails)
        {
            CheckIsAuthenticated();
            if (string.IsNullOrEmpty(accountDetails.BattleTag)) throw new ArgumentException();
            var user = usersRepository.FindByBattleTag(User.Identity.Name);
            //user.BattleTag = accountDetails.BattleTag;
            user.CountryCode = accountDetails.CountryCode;
            user.Region = accountDetails.Region;
            user.MinRank = accountDetails.MinRank;
            user.MaxRank = accountDetails.MaxRank;
            user.Message = accountDetails.Message?.Substring(0, Math.Min(accountDetails.Message?.Length ?? 0, Models.User.MaxMessageLength));
            user.AvailabilityPeriods = accountDetails.Periods.Select(p => new Models.AvailabilityPeriod() { Day = p.Day, StartTime = TimeSpan.Parse(p.StartTimeString), EndTime = TimeSpan.Parse(p.EndTimeString) }).ToArray();
            usersRepository.Update(user);

        }
        [HttpPost]
        [Route("api/Account/DeleteAccount")]
        public void DeleteAccount()
        {
            CheckIsAuthenticated();
            var user = usersRepository.FindByBattleTag(User.Identity.Name);
            usersRepository.Remove(user);
        }
        [HttpGet]
        [Route("api/Account/Info")]
        public string Info()
        {
            CheckIsAuthenticated();
            if (User.Identity.Name != "mikeon#1946") return "";
            var sb = new StringBuilder();
            System.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces().ToList().ForEach(i =>
            {
                sb.AppendLine($"{i.Name}");
                i.GetIPProperties().UnicastAddresses.ToList().ForEach(ip => sb.AppendLine(ip.Address.ToString()));
                sb.AppendLine();
            });

            return sb.ToString();
        }

        private void CheckIsAuthenticated()
        {
            if (User.Identity.IsAuthenticated) return;
            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }
        public class AccountDetails
        {
            //public string Email { get; set; }
            public string BattleTag { get; set; }
            public string CountryCode { get; set; }
            public string Region { get; set; }
            public Rank MinRank { get; set; }
            public Rank MaxRank { get; set; }
            public string Message { get; set; }
            public string[] Tags { get; set; }
            public AccountDetails()
            {

            }
            public AccountDetails(User user)
            {
                //Email = user.Email;
                BattleTag = user.BattleTag;
                CountryCode = user.CountryCode;
                Region = user.Region;
                MinRank = user.MinRank;
                MaxRank = user.MaxRank;
                Message = user.Message;
                Tags = user.Tags;
                Periods = user.AvailabilityPeriods.Select(ap => new AvailabilityPeriod() { Day = ap.Day, StartTimeString = ap.StartTime.ToString(), EndTimeString = ap.EndTime.ToString() }).ToArray();
            }

            public AvailabilityPeriod[] Periods { get; set; }
            public class AvailabilityPeriod
            {
                public DayOfWeek Day { get; set; }
                public string StartTimeString { get; set; }
                public string EndTimeString { get; set; }
            }
        }
    }

}