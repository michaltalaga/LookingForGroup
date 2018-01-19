window['moment-range'].extendMoment(moment);

var app = angular.module("lookingForGroup", ['ui.router', 'ui.bootstrap', 'ngVis', 'toaster', 'rzModule', 'bootstrapLightbox']);

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
        .state('About', {
            url: "/About",
            templateUrl: "/Template/About",
            controller: GenericPageController
        })
        .state('Contact', {
            url: "/Contact",
            templateUrl: "/Template/Contact",
            controller: GenericPageController
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
class LightboxDirective implements ng.IDirective {
    restrict = 'A';
    constructor(private Lightbox: angular.bootstrap.lightbox.ILightbox) {
    }
    link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) => {
        if (element[0].tagName !== 'IMG') return;
        var src = element[0].getAttribute('src');
        var lightbox = this.Lightbox;
        element.on('click', (xxx) => {
            var images: angular.bootstrap.lightbox.ILightboxImageInfo[] = [];
            images.push({
                url: src
            });
            lightbox.openModal(images, 0);
        })
       
    }
    static factory(): ng.IDirectiveFactory {
        const directive = (Lightbox) => new LightboxDirective(Lightbox);
        directive.$inject = ['Lightbox'];
        return directive;
    }
}
app.directive('lightbox', LightboxDirective.factory());
class GenericPageController {
    static $inject = ['$scope'];
    constructor($scope) {
    }
}