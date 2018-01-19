/// <reference path="app.ts" />

class AccountController {
    static $inject = ['$scope', '$window', 'AccountApiService', 'toaster', '$timeout'];
    constructor($scope, $window: ng.IWindowService, accountApi: IAccountApiController, toaster: ngtoaster.IToasterService, $timeout: ng.ITimeoutService) {
        const snapMinutes = 15;
        const minTime = moment("2007-01-01").startOf('day');
        const maxTime = moment("2007-01-02").startOf('day');
        const items = new vis.DataSet<vis.DataItem>();

        const groups = new vis.DataSet<vis.DataGroup>();
        initializeGroupsWithWeekDays();
        
        $scope.data = {
            items: items,
            groups: groups
        }
        var viewMode = accountApi.updateAccount === null || accountApi.updateAccount === undefined;
        var editMode = !viewMode;
        $scope.viewMode = viewMode;
        $scope.editMode = editMode;

        accountApi.getAccountDetails().then(success => {
            $scope.AccountDetails = success.data;
            var periods = success.data.Periods.map(p => <vis.DataItem>{
                content: "",
                start: moment(minTime.format("YYYY-MM-DD") + "T" + p.StartTimeString),
                end: p.EndTimeString === "00:00:00" ? maxTime.clone() : moment(minTime.format("YYYY-MM-DD") + "T" + p.EndTimeString),
                group: p.Day
            });
            periods.forEach(p => p.content = getLabel(p));
            items.add(periods);
            items.on('*', (event) => {
                saveAccountDetails();



            });
        });

        $scope.options = <vis.TimelineOptions>{
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
            onMoving: (item: vis.DataItem, callback) => {
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
            onMove: (item: vis.DataItem, callback) => {
                mergeItems(item);
                callback(item);
            },
            snap: (date: any, scale, step) => {
                var hour = snapMinutes * 60 * 1000;
                return Math.round(date / hour) * hour;
            },
            groupOrder: (a: vis.DataGroup, b: vis.DataGroup) => {
                // days are numbered from 0 where 0 is sunday. Make sure it goes last
                if (a.id == 0) return true;
                if (b.id == 0) return false;
                return a.id > b.id;
            },
            format: {
                minorLabels: (date: moment.Moment) => {
                    return date.format('HH:mm');
                }
            }
        };


        var newItem: vis.DataItem = null;

        if (editMode) {
            $scope.events = {
                "mouseDown": (e: vis.TimelineEventPropertiesResult) => {
                    if (e.item || e.group === undefined || newItem) return;
                    newItem = {
                        content: "",
                        start: nearestMinutes(snapMinutes, moment(e.time)),
                        end: nearestMinutes(snapMinutes, moment(e.time)).add(1, 'minutes'),
                        group: e.group
                    };
                },
                "mouseMove": (e: vis.TimelineEventPropertiesResult) => {
                    if (!newItem) return;
                    newItem.end = nearestMinutes(snapMinutes, moment(e.time));
                    if (moment.range(newItem.start, newItem.end).diff('minutes') < snapMinutes) {
                        items.remove(newItem.id);
                        return;
                    }
                    newItem.content = getLabel(newItem);
                    items.update(newItem);
                },
                "mouseUp": (e: vis.TimelineEventPropertiesResult) => {
                    if (!newItem) return;
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
        }
        $scope.clearPeriods = () => {
            items.clear();
            saveAccountDetails();
        }
        $scope.deleteAccount = () => {
            accountApi.deleteAccount();
            $window.location.href = '/Logout';
        }
        $scope.copyBattleTagToClipboard = ($event: Event) => {
            var element = <Element>$event.currentTarget;
            var battleTagInput = element.parentElement.querySelector("input");
            battleTagInput.select();
            document.execCommand("Copy");
        }
        const allRanks = Object.keys(LookingForGroup.Models.Rank).map(k => LookingForGroup.Models.Rank[k]).filter(v => typeof v === "number") as number[];
        $scope.slider = {
            min: 0,
            max: 5,
            value: 3,
            options: <angular.RzSlider.RzOptions>{
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






        function mergeItems(item: vis.DataItem) {
            var otherItemsThisDay = items.get({
                filter: (i: vis.DataItem) => {
                    return i.group == item.group && i.id !== item.id;
                }
            });
            var thisRange = moment.range(<any>item.start, <any>item.end);
            otherItemsThisDay.forEach(otherItem => {
                var otherRange = moment.range(<any>otherItem.start, <any>otherItem.end);
                if (thisRange.overlaps(otherRange, { adjacent: true })) {
                    thisRange = thisRange.add(otherRange);
                    item.start = thisRange.start;
                    item.end = thisRange.end;
                    item.content = getLabel(item);
                    items.remove(otherItem.id);
                }
            });

        }
        function nearestMinutes(interval: number, someMoment: moment.Moment): moment.Moment {
            const roundedMinutes = Math.round(someMoment.clone().minute() / interval) * interval;
            return someMoment.clone().minute(roundedMinutes).second(0).millisecond(0);
        }
        function getLabel(item: vis.DataItem): string {


            if (isDataItem(item)) {
                var start: moment.Moment;
                var end: moment.Moment;
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

            function isDataItem(x): x is vis.DataItem {
                return x.start instanceof Date || moment.isMoment(x.start);
            }

        }



        var pendingUpdate: ng.IPromise<void>;
        function saveAccountDetails() {
            if (pendingUpdate) $timeout.cancel(pendingUpdate);
            pendingUpdate = $timeout(() => {
                pendingUpdate = null;
                var periods = items.get().map(di => <LookingForGroup.Api.AccountApiController.AccountDetails.AvailabilityPeriod>{
                    Day: di.group,
                    Tags: ["hots"],
                    StartTimeString: moment(di.start).format("HH:mm"),
                    EndTimeString: moment(di.end).format("HH:mm"),
                });
                var accountDetails = <LookingForGroup.Api.AccountApiController.AccountDetails>$scope.AccountDetails;
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
