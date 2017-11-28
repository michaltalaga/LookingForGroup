using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace LookingForGroup.Models
{
    [DebuggerDisplay("{StartTime}-{EndTime}")]
    public class AvailabilityPeriod
    {
        public DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int GetMinutes()
        {
            return (int)(EndTime - StartTime).TotalMinutes;
        }
        public bool Overlaps(AvailabilityPeriod period)
        {
            return !(StartTime >= period.EndTime || EndTime <= period.StartTime);
        }
    }
    public static class AvailabilityPeriodExtensions
    {
        public static int GetTotalMinutes(this IEnumerable<AvailabilityPeriod> periods)
        {
            return periods.Sum(p => p.GetMinutes());
        }
    }

}