angular.module('ngVis', [])
    .factory('VisDataSet', function () {
    'use strict';
    return function (data, options) {
        // Create the new dataSets
        return new vis.DataSet(data, options);
    };
})
    .directive('visTimeline', function () {
    'use strict';
    return {
        restrict: 'EA',
        transclude: false,
        scope: {
            data: '=',
            options: '=',
            events: '='
        },
        link: function (scope, element, attr) {
            //var timelineEvents = [
            //    'rangechange',
            //    'rangechanged',
            //    'timechange',
            //    'timechanged',
            //    'select',
            //    'doubleClick',
            //    'click',
            //    'contextmenu'
            //];
            // Declare the timeline
            var timeline = null;
            scope.$watch('data', function () {
                // Sanity check
                if (scope.data == null) {
                    return;
                }
                // If we've actually changed the data set, then recreate the graph
                // We can always update the data by adding more data to the existing data set
                if (timeline != null) {
                    timeline.destroy();
                }
                // Create the timeline object
                if (scope.data.groups && scope.data.groups.length > 0) {
                    timeline = new vis.Timeline(element[0], scope.data.items, scope.data.groups, scope.options || {});
                }
                else {
                    timeline = new vis.Timeline(element[0], scope.data.items, scope.options || {});
                }
                // Attach an event handler if defined
                angular.forEach(scope.events, function (callback, event) {
                    //if (timelineEvents.indexOf(String(event)) >= 0) {
                    timeline.on(event, callback);
                    //}
                });
                // onLoad callback
                if (scope.events != null && scope.events.onload != null &&
                    angular.isFunction(scope.events.onload)) {
                    scope.events.onload(timeline);
                }
            });
            scope.$watchCollection('options', function (options) {
                if (timeline == null) {
                    return;
                }
                timeline.setOptions(options || {});
            });
        }
    };
})
    .directive('visNetwork', function () {
    return {
        restrict: 'EA',
        transclude: false,
        scope: {
            data: '=',
            options: '=',
            events: '='
        },
        link: function (scope, element, attr) {
            var networkEvents = [
                'click',
                'doubleClick',
                'oncontext',
                'hold',
                'release',
                'selectNode',
                'selectEdge',
                'deselectNode',
                'deselectEdge',
                'dragStart',
                'dragging',
                'dragEnd',
                'hoverNode',
                'blurNode',
                'zoom',
                'showPopup',
                'hidePopup',
                'startStabilizing',
                'stabilizationProgress',
                'stabilizationIterationsDone',
                'stabilized',
                'resize',
                'initRedraw',
                'beforeDrawing',
                'afterDrawing',
                'animationFinished'
            ];
            var network = null;
            scope.$watch('data', function () {
                // Sanity check
                if (scope.data == null) {
                    return;
                }
                // If we've actually changed the data set, then recreate the graph
                // We can always update the data by adding more data to the existing data set
                if (network != null) {
                    network.destroy();
                }
                // Create the graph2d object
                network = new vis.Network(element[0], scope.data, scope.options);
                // Attach an event handler if defined
                angular.forEach(scope.events, function (callback, event) {
                    if (networkEvents.indexOf(String(event)) >= 0) {
                        network.on(event, callback);
                    }
                });
                // onLoad callback
                if (scope.events != null && scope.events.onload != null &&
                    angular.isFunction(scope.events.onload)) {
                    scope.events.onload(network);
                }
            });
            scope.$watchCollection('options', function (options) {
                if (network == null) {
                    return;
                }
                network.setOptions(options);
            });
        }
    };
})
    .directive('visGraph2d', function () {
    'use strict';
    return {
        restrict: 'EA',
        transclude: false,
        scope: {
            data: '=',
            options: '=',
            events: '='
        },
        link: function (scope, element, attr) {
            var graphEvents = [
                'rangechange',
                'rangechanged',
                'timechange',
                'timechanged',
                'finishedRedraw'
            ];
            // Create the chart
            var graph = null;
            scope.$watch('data', function () {
                // Sanity check
                if (scope.data == null) {
                    return;
                }
                // If we've actually changed the data set, then recreate the graph
                // We can always update the data by adding more data to the existing data set
                if (graph != null) {
                    graph.destroy();
                }
                // Create the graph2d object
                graph = new vis.Graph2d(element[0], scope.data.items, scope.data.groups, scope.options);
                // Attach an event handler if defined
                angular.forEach(scope.events, function (callback, event) {
                    if (graphEvents.indexOf(String(event)) >= 0) {
                        graph.on(event, callback);
                    }
                });
                // onLoad callback
                if (scope.events != null && scope.events.onload != null &&
                    angular.isFunction(scope.events.onload)) {
                    scope.events.onload(graph);
                }
            });
            scope.$watchCollection('options', function (options) {
                if (graph == null) {
                    return;
                }
                graph.setOptions(options);
            });
        }
    };
});
var LookingForGroup;
(function (LookingForGroup) {
    var Models;
    (function (Models) {
        let Rank;
        (function (Rank) {
            Rank[Rank["Bronze5"] = 0] = "Bronze5";
            Rank[Rank["Bronze4"] = 1] = "Bronze4";
            Rank[Rank["Bronze3"] = 2] = "Bronze3";
            Rank[Rank["Bronze2"] = 3] = "Bronze2";
            Rank[Rank["Bronze1"] = 4] = "Bronze1";
            Rank[Rank["Silver5"] = 5] = "Silver5";
            Rank[Rank["Silver4"] = 6] = "Silver4";
            Rank[Rank["Silver3"] = 7] = "Silver3";
            Rank[Rank["Silver2"] = 8] = "Silver2";
            Rank[Rank["Silver1"] = 9] = "Silver1";
            Rank[Rank["Gold5"] = 10] = "Gold5";
            Rank[Rank["Gold4"] = 11] = "Gold4";
            Rank[Rank["Gold3"] = 12] = "Gold3";
            Rank[Rank["Gold2"] = 13] = "Gold2";
            Rank[Rank["Gold1"] = 14] = "Gold1";
            Rank[Rank["Platinum5"] = 15] = "Platinum5";
            Rank[Rank["Platinum4"] = 16] = "Platinum4";
            Rank[Rank["Platinum3"] = 17] = "Platinum3";
            Rank[Rank["Platinum2"] = 18] = "Platinum2";
            Rank[Rank["Platinum1"] = 19] = "Platinum1";
            Rank[Rank["Diamond5"] = 20] = "Diamond5";
            Rank[Rank["Diamond4"] = 21] = "Diamond4";
            Rank[Rank["Diamond3"] = 22] = "Diamond3";
            Rank[Rank["Diamond2"] = 23] = "Diamond2";
            Rank[Rank["Diamond1"] = 24] = "Diamond1";
            Rank[Rank["Master"] = 25] = "Master";
            Rank[Rank["GrandMaster"] = 26] = "GrandMaster";
        })(Rank = Models.Rank || (Models.Rank = {}));
    })(Models = LookingForGroup.Models || (LookingForGroup.Models = {}));
})(LookingForGroup || (LookingForGroup = {}));
var System;
(function (System) {
    let DayOfWeek;
    (function (DayOfWeek) {
        DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
        DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
        DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
        DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
        DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
        DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
        DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
    })(DayOfWeek = System.DayOfWeek || (System.DayOfWeek = {}));
})(System || (System = {}));
window['moment-range'].extendMoment(moment);
var app = angular.module("lookingForGroup", ['ui.router', 'ui.bootstrap', 'ngVis', 'toaster', 'rzModule', 'bootstrapLightbox']);
app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $stateProvider
        .state('Account', {
        url: "/Account",
        templateUrl: "/Template/Account",
        controller: AccountController
    })
        .state('Find', {
        url: "/Find",
        templateUrl: "/Template/Find",
        controller: FindController
    })
        .state('About', {
        url: "/About",
        templateUrl: "/Template/About",
        controller: GenericPageController
    })
        .state('Contact', {
        url: "/Contact",
        templateUrl: "/Template/Contact",
        controller: GenericPageController
    });
    $locationProvider.html5Mode(true);
});
app.factory('$', [
    '$window', $window => $window.jQuery
]);
class LightboxDirective {
    constructor(Lightbox) {
        this.Lightbox = Lightbox;
        this.restrict = 'A';
        this.link = (scope, element, attrs, ctrl) => {
            if (element[0].tagName !== 'IMG')
                return;
            var src = element[0].getAttribute('src');
            var lightbox = this.Lightbox;
            element.on('click', (xxx) => {
                var images = [];
                images.push({
                    url: src
                });
                lightbox.openModal(images, 0);
            });
        };
    }
    static factory() {
        const directive = (Lightbox) => new LightboxDirective(Lightbox);
        directive.$inject = ['Lightbox'];
        return directive;
    }
}
app.directive('lightbox', LightboxDirective.factory());
class GenericPageController {
    constructor($scope) {
    }
}
GenericPageController.$inject = ['$scope'];
/// <reference path="../../app/app.ts" />
class AccountApiController {
    constructor($http) {
        this.$http = $http;
        this.getAccountDetails = (id) => {
            return this.$http({
                url: `/api/Account/GetAccountDetails?id=${id}`,
                method: "get",
                data: null
            });
        };
        this.updateAccount = (accountDetails) => {
            return this.$http({
                url: `/api/Account/UpdateAccout`,
                method: "post",
                data: accountDetails
            });
        };
        this.deleteAccount = () => {
            return this.$http({
                url: `/api/Account/DeleteAccount`,
                method: "post",
                data: null
            });
        };
    }
}
app.service("AccountApiService", ["$http", AccountApiController]);
/// <reference path="../../app/app.ts" />
class FindApiController {
    constructor($http) {
        this.$http = $http;
        this.find = (query) => {
            return this.$http({
                url: `/api/Find/Find`,
                method: "post",
                data: query
            });
        };
    }
}
app.service("FindApiService", ["$http", FindApiController]);
/// <reference path="app.ts" />
class AccountController {
    constructor($scope, $window, accountApi, toaster, $timeout) {
        const snapMinutes = 15;
        const minTime = moment("2007-01-01").startOf('day');
        const maxTime = moment("2007-01-02").startOf('day');
        const items = new vis.DataSet();
        const groups = new vis.DataSet();
        initializeGroupsWithWeekDays();
        $scope.data = {
            items: items,
            groups: groups
        };
        var viewMode = accountApi.updateAccount === null || accountApi.updateAccount === undefined;
        var editMode = !viewMode;
        $scope.viewMode = viewMode;
        $scope.editMode = editMode;
        accountApi.getAccountDetails().then(success => {
            $scope.AccountDetails = success.data;
            var periods = success.data.Periods.map(p => ({
                content: "",
                start: moment(minTime.format("YYYY-MM-DD") + "T" + p.StartTimeString),
                end: p.EndTimeString === "00:00:00" ? maxTime.clone() : moment(minTime.format("YYYY-MM-DD") + "T" + p.EndTimeString),
                group: p.Day
            }));
            periods.forEach(p => p.content = getLabel(p));
            items.add(periods);
            items.on('*', (event) => {
                saveAccountDetails();
            });
        });
        $scope.options = {
            start: minTime,
            end: maxTime,
            stack: false,
            moveable: false,
            showMajorLabels: false,
            itemsAlwaysDraggable: true,
            editable: {
                add: false,
                remove: editMode,
                updateGroup: false,
                updateTime: editMode,
            },
            onMoving: (item, callback) => {
                item.start = moment(item.start); // this is needed else angualr will some see it as string in the view 
                item.end = moment(item.end); // this is needed else angualr will some see it as string in the view
                if (item.end > maxTime) {
                    item.end = maxTime;
                    item.content = getLabel(item);
                    items.update(item);
                    callback(null);
                    return;
                }
                else if (item.start < minTime) {
                    item.start = minTime;
                    item.content = getLabel(item);
                    items.update(item);
                    callback(null);
                    return;
                }
                else if (moment.range(item.start, item.end).diff('minutes') < snapMinutes) {
                    items.remove(item.id);
                    callback(null);
                    return;
                }
                item.content = getLabel(item);
                callback(item);
            },
            onMove: (item, callback) => {
                mergeItems(item);
                callback(item);
            },
            snap: (date, scale, step) => {
                var hour = snapMinutes * 60 * 1000;
                return Math.round(date / hour) * hour;
            },
            groupOrder: (a, b) => {
                // days are numbered from 0 where 0 is sunday. Make sure it goes last
                if (a.id == 0)
                    return true;
                if (b.id == 0)
                    return false;
                return a.id > b.id;
            },
            format: {
                minorLabels: (date) => {
                    return date.format('HH:mm');
                }
            }
        };
        var newItem = null;
        if (editMode) {
            $scope.events = {
                "mouseDown": (e) => {
                    if (e.item || e.group === undefined || newItem)
                        return;
                    newItem = {
                        content: "",
                        start: nearestMinutes(snapMinutes, moment(e.time)),
                        end: nearestMinutes(snapMinutes, moment(e.time)).add(1, 'minutes'),
                        group: e.group
                    };
                },
                "mouseMove": (e) => {
                    if (!newItem)
                        return;
                    newItem.end = nearestMinutes(snapMinutes, moment(e.time));
                    if (moment.range(newItem.start, newItem.end).diff('minutes') < snapMinutes) {
                        items.remove(newItem.id);
                        return;
                    }
                    newItem.content = getLabel(newItem);
                    items.update(newItem);
                },
                "mouseUp": (e) => {
                    if (!newItem)
                        return;
                    if ((new Date(newItem.end).getTime() - new Date(newItem.start).getTime()) < 1000 * 60 * snapMinutes * 2) {
                        items.remove(newItem.id);
                        newItem = null;
                        return;
                    }
                    mergeItems(newItem);
                    items.update(newItem);
                    newItem = null;
                },
            };
        }
        $scope.changed = () => {
            saveAccountDetails();
        };
        $scope.clearPeriods = () => {
            items.clear();
            saveAccountDetails();
        };
        $scope.deleteAccount = () => {
            accountApi.deleteAccount();
            $window.location.href = '/Logout';
        };
        $scope.copyBattleTagToClipboard = ($event) => {
            var element = $event.currentTarget;
            var battleTagInput = element.parentElement.querySelector("input");
            battleTagInput.select();
            document.execCommand("Copy");
        };
        const allRanks = Object.keys(LookingForGroup.Models.Rank).map(k => LookingForGroup.Models.Rank[k]).filter(v => typeof v === "number");
        $scope.slider = {
            min: 0,
            max: 5,
            value: 3,
            options: {
                stepsArray: allRanks,
                showTicks: true,
                draggableRange: true,
                translate: val => LookingForGroup.Models.Rank[val],
                onEnd: function () {
                    saveAccountDetails();
                },
                readOnly: viewMode,
            },
        };
        function mergeItems(item) {
            var otherItemsThisDay = items.get({
                filter: (i) => {
                    return i.group == item.group && i.id !== item.id;
                }
            });
            var thisRange = moment.range(item.start, item.end);
            otherItemsThisDay.forEach(otherItem => {
                var otherRange = moment.range(otherItem.start, otherItem.end);
                if (thisRange.overlaps(otherRange, { adjacent: true })) {
                    thisRange = thisRange.add(otherRange);
                    item.start = thisRange.start;
                    item.end = thisRange.end;
                    item.content = getLabel(item);
                    items.remove(otherItem.id);
                }
            });
        }
        function nearestMinutes(interval, someMoment) {
            const roundedMinutes = Math.round(someMoment.clone().minute() / interval) * interval;
            return someMoment.clone().minute(roundedMinutes).second(0).millisecond(0);
        }
        function getLabel(item) {
            if (isDataItem(item)) {
                var start;
                var end;
                if (item.start instanceof Date) {
                    start = moment(item.start);
                    end = moment(item.end);
                }
                else if (moment.isMoment(item.start) && moment.isMoment(item.end)) {
                    start = item.start;
                    end = item.end;
                }
                else if (typeof item.start === "string" && typeof item.end === "string") {
                    start = moment(item.start);
                    end = moment(item.end);
                }
                var startString = start.format("HH:mm");
                var endString = maxTime.diff(end) === 0 ? "24:00" : end.format("HH:mm");
                return `${startString}-${endString}`;
            }
            return "???";
            function isDataItem(x) {
                return x.start instanceof Date || moment.isMoment(x.start);
            }
        }
        var pendingUpdate;
        function saveAccountDetails() {
            if (pendingUpdate)
                $timeout.cancel(pendingUpdate);
            pendingUpdate = $timeout(() => {
                pendingUpdate = null;
                var periods = items.get().map(di => ({
                    Day: di.group,
                    Tags: ["hots"],
                    StartTimeString: moment(di.start).format("HH:mm"),
                    EndTimeString: moment(di.end).format("HH:mm"),
                }));
                var accountDetails = $scope.AccountDetails;
                accountDetails.Periods = periods;
                accountApi.updateAccount(accountDetails).then(success => {
                    toaster.success("saved");
                });
            }, 1 * 1000);
        }
        function initializeGroupsWithWeekDays() {
            groups.add({ id: 1, content: new Date(2007, 0, 1, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 2, content: new Date(2007, 0, 2, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 3, content: new Date(2007, 0, 3, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 4, content: new Date(2007, 0, 4, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 5, content: new Date(2007, 0, 5, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 6, content: new Date(2007, 0, 6, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
            groups.add({ id: 0, content: new Date(2007, 0, 7, 0, 0).toLocaleString($window.navigator.language, { weekday: 'long' }) });
        }
    }
}
AccountController.$inject = ['$scope', '$window', 'AccountApiService', 'toaster', '$timeout'];
/// <reference path="app.ts" />
class FindController {
    constructor($scope, $window, findApi, toaster, $timeout, $modal, accountApi) {
        const minTime = moment("2007-01-01").startOf('day');
        const items = new vis.DataSet();
        const groups = new vis.DataSet();
        $scope.data = {
            items: items,
            groups: groups
        };
        groups.add({
            content: ".",
            id: -1
        });
        findApi.find({}).then(result => {
            var order = 0;
            groups.clear();
            var allItems = [];
            result.data.forEach(player => {
                order++;
                var group = {
                    id: player.UserId,
                    content: player.Nick,
                    order: order,
                    player: player
                    //content: player.Nick + `<div class="flag flag-${player.CountryCode.toLowerCase()}"></div>`,
                };
                groups.add(group);
                var thisPlayerPeriods = [];
                player.Periods.sort((a, b) => {
                    var dayA = a.Day === 0 ? 7 : a.Day;
                    var dayB = b.Day === 0 ? 7 : b.Day;
                    return dayA - dayB || a.StartTimeString.localeCompare(b.StartTimeString);
                }).forEach(period => {
                    var dayOffset = period.Day === 0 ? 6 : period.Day - 1;
                    var start = moment(minTime.format("YYYY-MM-DD") + "T" + period.StartTimeString).add(dayOffset, 'days');
                    var end = moment(minTime.format("YYYY-MM-DD") + "T" + period.EndTimeString).add(dayOffset, 'days');
                    if (period.EndTimeString === "00:00:00") {
                        end.add(1, 'days');
                    }
                    // merge pariods that start/end on midnight
                    if (thisPlayerPeriods.length > 0 && start.isSame(thisPlayerPeriods[thisPlayerPeriods.length - 1].end)) {
                        var previousItem = thisPlayerPeriods[thisPlayerPeriods.length - 1];
                        previousItem.end = end;
                        previousItem.title = previousItem.start.format("HH:mm") + "-" + end.format("HH:mm");
                    }
                    else {
                        var newPeriod = {
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
            "click": (e) => {
                if (e.what !== "group-label")
                    return;
                var group = groups.get(e.group);
                showPlayerDetails(group.player);
            }
        };
        var options = {
            start: minTime.clone(),
            end: minTime.clone().add(7, 'days'),
            stack: false,
            moveable: false,
            showMajorLabels: false,
            editable: false,
            verticalScroll: true,
            format: {
                minorLabels: (date) => {
                    return date.format('dddd');
                }
            },
            orientation: {
                axis: "both"
            },
            groupTemplate: function (group, element) {
                if (!group.player)
                    return null;
                var minRankNumber = LookingForGroup.Models.Rank[group.player.MinRank].charAt(LookingForGroup.Models.Rank[group.player.MinRank].length - 1);
                var maxRankNumber = LookingForGroup.Models.Rank[group.player.MaxRank].charAt(LookingForGroup.Models.Rank[group.player.MaxRank].length - 1);
                ;
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
        function showPlayerDetails(player) {
            //accountApi.updateAccount = null;
            //var getAccountDetails = () => accountApi.getAccountDetails(player.UserId);
            //accountApi.getAccountDetails = getAccountDetails;
            var api = {
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
FindController.$inject = ['$scope', '$window', 'FindApiService', 'toaster', '$timeout', '$uibModal', 'AccountApiService'];
//# sourceMappingURL=app.js.map