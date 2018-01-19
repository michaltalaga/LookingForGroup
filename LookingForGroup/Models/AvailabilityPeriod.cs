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
        /// <summary>
        /// !!! EndTime can be 00:00 which normally means it's an end of day rather than start.
        /// Always consider using <seealso cref="AvailabilityPeriod.EndTimeNormalized"/> for calculations!
        /// </summary>
        public TimeSpan EndTime { get; set; }
        internal TimeSpan EndTimeNormalized
        {
            get
            {
                return EndTime.TotalMinutes == 0 ? TimeSpan.FromHours(24) : EndTime;
            }
        }

        public int GetMinutes()
        {
            return (int)(EndTimeNormalized - StartTime).TotalMinutes;
        }
        public bool Overlaps(AvailabilityPeriod period)
        {
            return !(StartTime >= period.EndTimeNormalized || EndTimeNormalized <= period.StartTime);
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