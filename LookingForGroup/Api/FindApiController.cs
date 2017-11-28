using LookingForGroup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LookingForGroup.Api.AccountApiController;

namespace LookingForGroup.Api
{
    public class FindApiController : ApiController
    {
        UsersRepository usersRepository = new UsersRepository();
        const int MaxFindResults = 25;
        [Route("api/Find/Find")]
        [HttpPost]
        public PlayerDetails[] Find(FindPlayersQuery query)
        {
            var users = usersRepository.FindAll();
            if (User.Identity.IsAuthenticated)
            {
                var currentUser = usersRepository.FindByBattleTag(User.Identity.Name);
                var matchFinder = new MatchFinder();
                users = users.Where(u => u.Id != currentUser.Id);
                users = users.Where(u => u.Region == currentUser.Region);
                users = users.Where(u => u.MinRank <= currentUser.MaxRank && u.MaxRank >= currentUser.MinRank);
                users = users.Where(u => u.AvailabilityPeriods?.Length > 0);
                users = users.OrderByDescending(u => matchFinder.GetMatchScore(currentUser, u)).ThenByDescending(u => u.AvailabilityPeriods.GetTotalMinutes());
                users = (new User[] { currentUser }).Union(users);

            }

            var players = users.Take(MaxFindResults).Select(u => new PlayerDetails(u)).ToArray();
            return players;
        }
        public class PlayerDetails
        {
            public PlayerDetails()
            {

            }
            public PlayerDetails(User u)
            {
                UserId = u.Id;
                Nick = u.BattleTag.Split('#')[0];
                CountryCode = u.CountryCode;
                Tags = u.Tags;
                Periods = u.AvailabilityPeriods.Select(ap => new AccountApiController.AccountDetails.AvailabilityPeriod() { Day = ap.Day, StartTimeString = ap.StartTime.ToString(), EndTimeString = ap.EndTime.ToString() }).ToArray();
            }
            public int UserId { get; set; }
            public string Nick { get; set; }
            public string CountryCode { get; set; }
            public string[] Tags { get; set; }
            public AccountApiController.AccountDetails.AvailabilityPeriod[] Periods { get; set; }
        }

        public class FindPlayersQuery
        {
            public string Country { get; set; }
            public string[] Tags { get; set; }
        }
    }

}
