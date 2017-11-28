using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Web;

namespace LookingForGroup.Models
{
    [DebuggerDisplay("{BattleTag}")]
    public class User
    {
        public const int MaxMessageLength = 5000;

        public int Id { get; set; }
        //public string Email { get; set; }
        public string CountryCode { get; set; }
        public string BattleTag { get; set; }
        public string Region { get; set; }
        public Rank MinRank { get; set; }
        public Rank MaxRank { get; set; }
        public string Message { get; set; }
        public string[] Tags { get; set; } = new string[0];
        public AvailabilityPeriod[] AvailabilityPeriods { get; set; } = new AvailabilityPeriod[0];
    }
    public enum Rank
    {
        Bronze5,
        Bronze4,
        Bronze3,
        Bronze2,
        Bronze1,
        Silver5,
        Silver4,
        Silver3,
        Silver2,
        Silver1,
        Gold5,
        Gold4,
        Gold3,
        Gold2,
        Gold1,
        Platinum5,
        Platinum4,
        Platinum3,
        Platinum2,
        Platinum1,
        Diamond5,
        Diamond4,
        Diamond3,
        Diamond2,
        Diamond1,
        Master,
        GrandMaster
    }
    public static class UserHelper
    {
        static Random random = new Random();
        public static IEnumerable<User> GenerateRandom(int number)
        {
            var regions = new string[] { "Americas", "Asia", "Europe" };
            var countries = GetAllCountries();
            for (int i = 1; i <= number; i++)
            {
                var region = regions[random.Next(0, 3)];
                var minRank = (Rank)random.Next(0, 20);
                var user = new Models.User()
                {
                    //Email = "mt-" + i,
                    CountryCode = countries[random.Next(0, countries.Length)],
                    BattleTag = "mt-" + i + "_123",
                    Region = region,
                    MinRank = minRank,
                    MaxRank = minRank + random.Next(0, 6),
                };
                user.AvailabilityPeriods = GetRandomPeriods();
                yield return user;
            }
        }
        private static AvailabilityPeriod[] GetRandomPeriods()
        {

            var periods = new List<AvailabilityPeriod>();
            var numberOfPeriods = random.Next(3, 10);
            for (int i = 0; i < numberOfPeriods; i++)
            {
                var day = (DayOfWeek)random.Next(0, 6);
                var startTime = TimeSpan.FromHours(random.Next(0, 19));
                var endTime = TimeSpan.FromHours(startTime.TotalHours + 4);
                var period = new AvailabilityPeriod()
                {
                    Day = day,
                    StartTime = startTime,
                    EndTime = endTime
                };
                if (periods.Any(p => p.Day == day && p.Overlaps(period))) continue;
                periods.Add(period);
            }
            return periods.ToArray();
        }
        private static string[] GetAllCountries()
        {
            var objDict = new Dictionary<string, string>();
            foreach (var cultureInfo in CultureInfo.GetCultures(CultureTypes.SpecificCultures))
            {
                var regionInfo = new RegionInfo(cultureInfo.Name);
                if (!objDict.ContainsKey(regionInfo.EnglishName))
                {
                    objDict.Add(regionInfo.EnglishName, regionInfo.TwoLetterISORegionName.ToLower());
                }
            }
            var obj = objDict.OrderBy(p => p.Key).ToArray();
            return obj.Select(c => c.Value.ToUpper()).ToArray();

        }
    }
}