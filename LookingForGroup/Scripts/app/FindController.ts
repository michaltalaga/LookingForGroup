/// <reference path="app.ts" />

class FindController {
    static $inject = ['$scope', '$window', 'FindApiService', 'toaster', '$timeout', '$uibModal', 'AccountApiService'];
    constructor($scope, $window: ng.IWindowService, findApi: IFindApiController, toaster: ngtoaster.IToasterService, $timeout: ng.ITimeoutService, $modal: ng.ui.bootstrap.IModalService, accountApi: AccountApiController) {
        const minTime = moment("2007-01-01").startOf('day');
        const items = new vis.DataSet<vis.DataItem>();
        const groups = new vis.DataSet<PlayerDataGroup>();
        $scope.data = {
            items: items,
            groups: groups
        }
        groups.add({
            content: ".",
            id: -1
        });


        findApi.find({}).then(result => {
            var order = 0;
            groups.clear();
            var allItems: vis.DataItem[] = [];
            result.data.forEach(player => {
                order++;
                var group = <PlayerDataGroup>{
                    id: player.UserId,
                    content: player.Nick,
                    order: order,
                    player: player
                    //content: player.Nick + `<div class="flag flag-${player.CountryCode.toLowerCase()}"></div>`,
                };
                groups.add(group);

                var thisPlayerPeriods: vis.DataItem[] = [];
                player.Periods.sort((a, b) => {
                    var dayA = a.Day === 0 ? 7 : a.Day;
                    var dayB = b.Day === 0 ? 7 : b.Day;
                    return dayA - dayB || a.StartTimeString.localeCompare(b.StartTimeString);
                }).forEach(period => {
                    var dayOffset = period.Day === 0 ? 6 : period.Day - 1;
                    var start = moment(minTime.format("YYYY-MM-DD") + "T" + period.StartTimeString).add(dayOffset, 'days');

                    var end = moment(minTime.format("YYYY-MM-DD") + "T" + period.EndTimeString).add(dayOffset, 'days');
                    if (period.EndTimeString === "00:00:00") { // ending on midnight means 00:00:00 next day
                        end.add(1, 'days');
                    }
                    // merge pariods that start/end on midnight
                    if (thisPlayerPeriods.length > 0 && start.isSame(thisPlayerPeriods[thisPlayerPeriods.length - 1].end)) {
                        var previousItem = thisPlayerPeriods[thisPlayerPeriods.length - 1];
                        previousItem.end = end;
                        previousItem.title = (<moment.Moment>previousItem.start).format("HH:mm") + "-" + end.format("HH:mm");
                    }
                    else {
                        var newPeriod = <vis.DataItem>{
                            content: '',
                            title: start.format("HH:mm") + "-" + (end.format("HH:mm") === "00:00" ? "24:00" : end.format("HH:mm")),
                            start: start,
                            end: end,
                            group: player.UserId,
                        };
                        thisPlayerPeriods.push(newPeriod);
                    }

                });
                allItems = allItems.concat(thisPlayerPeriods);
            });
            items.clear();
            items.add(allItems);
            

        });


        $scope.events = {
            "click": (e: vis.TimelineEventPropertiesResult) => {
                if (e.what !== "group-label") return;
                var group = groups.get(e.group);
                showPlayerDetails(group.player);
            }
        }

        var options = <vis.TimelineOptions>{
            start: minTime.clone(),
            end: minTime.clone().add(7, 'days'),
            stack: false,
            moveable: false,
            showMajorLabels: false,
            editable: false,
            verticalScroll: true,
            format: {
                minorLabels: (date: moment.Moment) => {
                    return date.format('dddd');
                }
            },
            orientation: {
                axis: "both"
            },
            groupTemplate: function (group: PlayerDataGroup, element) {
                if (!group.player) return null;
                var minRankNumber = LookingForGroup.Models.Rank[group.player.MinRank].charAt(LookingForGroup.Models.Rank[group.player.MinRank].length - 1);
                var maxRankNumber = LookingForGroup.Models.Rank[group.player.MaxRank].charAt(LookingForGroup.Models.Rank[group.player.MaxRank].length - 1);;
                if (group.player.MinRank === LookingForGroup.Models.Rank.Master) {
                    minRankNumber = "M";
                }
                if (group.player.MinRank === LookingForGroup.Models.Rank.GrandMaster) {
                    minRankNumber = "GM";
                }
                if (group.player.MaxRank === LookingForGroup.Models.Rank.Master) {
                    maxRankNumber = "M";
                }
                if (group.player.MaxRank === LookingForGroup.Models.Rank.GrandMaster) {
                    maxRankNumber = "GM";
                }
                return `<div class="player">${group.player.Nick}</div><div class="flag flag-${group.player.CountryCode.toLowerCase()}"></div><div class='ranks'><div title="${LookingForGroup.Models.Rank[group.player.MinRank]}" class="${LookingForGroup.Models.Rank[group.player.MinRank]}">${minRankNumber}</div><div title="${LookingForGroup.Models.Rank[group.player.MaxRank]}" class="${LookingForGroup.Models.Rank[group.player.MaxRank]}">${maxRankNumber}</div></div><i class="info fa fa-info-circle"></i>`;
            }
        };

        $scope.options = options;
        function showPlayerDetails(player: LookingForGroup.Api.FindApiController.PlayerDetails) {
            //accountApi.updateAccount = null;
            //var getAccountDetails = () => accountApi.getAccountDetails(player.UserId);
            //accountApi.getAccountDetails = getAccountDetails;
            var api = <IAccountApiController>{
                getAccountDetails: () => accountApi.getAccountDetails(player.UserId),
            };
            var modal = $modal.open({
                templateUrl: '/Template/Account',
                controller: AccountController,
                size: 'lg',
                resolve: {
                    AccountApiService: () => api

                }
            });
            modal.result.then((x) => alert('aaa'), () => { });
        }

    }
}
interface PlayerDataGroup extends vis.DataGroup {
    player?: LookingForGroup.Api.FindApiController.PlayerDetails,
    order?: number
}