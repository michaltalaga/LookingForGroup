using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LookingForGroup.Models
{
    public class MatchFinder
    {
        public int GetMatchScore(User user1, User user2)
        {
            var total = 0;
            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var user1AvailabilityPeriodsOnDay = user1.AvailabilityPeriods.Where(ap => ap.Day == day);
                var user2AvailabilityPeriodsOnDay = user2.AvailabilityPeriods.Where(ap => ap.Day == day);
                total += GetOverlappingMinutes(user1AvailabilityPeriodsOnDay, user2AvailabilityPeriodsOnDay);
            }
            return total;
        }

        private int GetOverlappingMinutes(IEnumerable<AvailabilityPeriod> user1AvailabilityPeriodsOnDay, IEnumerable<AvailabilityPeriod> user2AvailabilityPeriodsOnDay)
        {
            var total = 0;
            foreach (var user1Period in user1AvailabilityPeriodsOnDay)
            {
                foreach (var user2Period in user2AvailabilityPeriodsOnDay)
                {
                    if (!user1Period.Overlaps(user2Period)) continue;
                    var commonPeriod = new AvailabilityPeriod()
                    {
                        StartTime = new TimeSpan(Math.Max(user1Period.StartTime.Ticks, user2Period.StartTime.Ticks)),
                        EndTime = new TimeSpan(Math.Min(user1Period.EndTime.Ticks, user2Period.EndTime.Ticks)),
                    };
                    total += commonPeriod.GetMinutes();
                }
            }
            return total;
        }

       
    }
}