window['moment-range'].extendMoment(moment);

var app = angular.module("lookingForGroup", ['ui.router', 'ui.bootstrap', 'ngVis', 'toaster', 'rzModule']);

app.config(($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider) => {
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
        //.state('Device', {
        //    url: "/Device/{deviceId}",
        //    templateUrl: "/Template/Device",
        //    controller: DeviceEditController
        //})
        //.state('Account', {
        //    url: "/Account",
        //    templateUrl: "/Template/Account",
        //    controller: AccountController
        //})
        //.state('AccountList', {
        //    url: "/AccountList",
        //    templateUrl: "/Template/AccountList",
        //    controller: AccountListController
        //})
        ;
    $locationProvider.html5Mode(true);
});
app.factory('$', [
    '$window', $window => $window.jQuery
]);