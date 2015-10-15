var orsApp = angular.module('Orz', [ 'ngAnimate', 'ngRoute', 'orsController' ]);

orsApp.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);

orsApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'pages/joblist.html',
		controller: 'HomeController',
		css: 'css/page.css'
	}).when('/job/:_jobId', {
		templateUrl: 'pages/jobdetail.html',
		controller: 'JobDetailController',
		css: 'css/page.css'
	}).when('/viewapp', {
		templateUrl: 'pages/viewapp.html',
		controller: 'ViewApplicationController',
		css: 'css/page.css'
	}).otherwise({
		redirectTo: '/'
	})

	$locationProvider.html5Mode(true).hashPrefix('!');
});

