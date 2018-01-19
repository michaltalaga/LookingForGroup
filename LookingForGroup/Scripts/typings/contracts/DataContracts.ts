


namespace LookingForGroup.Api.AccountApiController {
	export interface AccountDetails {
		BattleTag?: string;
		CountryCode?: string;
		Region?: string;
		MinRank?: LookingForGroup.Models.Rank;
		MaxRank?: LookingForGroup.Models.Rank;
		Message?: string;
		Tags?: string[];
		Periods?: LookingForGroup.Api.AccountApiController.AccountDetails.AvailabilityPeriod[];
	}
}
namespace LookingForGroup.Api.AccountApiController.AccountDetails {
	export interface AvailabilityPeriod {
		Day?: System.DayOfWeek;
		StartTimeString?: string;
		EndTimeString?: string;
	}
}

namespace LookingForGroup.Api.FindApiController {
	export interface FindPlayersQuery {
		Country?: string;
		Tags?: string[];
	}
}
namespace LookingForGroup.Api.FindApiController {
	export interface PlayerDetails {
		UserId?: number;
		Nick?: string;
		CountryCode?: string;
		Tags?: string[];
		Periods?: LookingForGroup.Api.AccountApiController.AccountDetails.AvailabilityPeriod[];
		MinRank?: LookingForGroup.Models.Rank;
		MaxRank?: LookingForGroup.Models.Rank;
	}
}

namespace LookingForGroup.Models {
    export enum Rank {
        Bronze5= 0,
        Bronze4= 1,
        Bronze3= 2,
        Bronze2= 3,
        Bronze1= 4,
        Silver5= 5,
        Silver4= 6,
        Silver3= 7,
        Silver2= 8,
        Silver1= 9,
        Gold5= 10,
        Gold4= 11,
        Gold3= 12,
        Gold2= 13,
        Gold1= 14,
        Platinum5= 15,
        Platinum4= 16,
        Platinum3= 17,
        Platinum2= 18,
        Platinum1= 19,
        Diamond5= 20,
        Diamond4= 21,
        Diamond3= 22,
        Diamond2= 23,
        Diamond1= 24,
        Master= 25,
        GrandMaster= 26
    }
}
namespace System {
    export enum DayOfWeek {
        Sunday= 0,
        Monday= 1,
        Tuesday= 2,
        Wednesday= 3,
        Thursday= 4,
        Friday= 5,
        Saturday= 6
    }
}