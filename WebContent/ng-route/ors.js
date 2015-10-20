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

orsApp.config(function($routeProvider, $locationProvider, $httpProvider) {
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
	}).when('/apply/:_jobId', {
		templateUrl: 'pages/jobapply.html',
		controller: 'JobApplyController',
		css: 'css/page.css'
	}).when('/updateapp/:_appId', {
		templateUrl: 'pages/updateapp.html',
		controller: 'UpdateApplicationController',
		css: 'css/page.css'
	}).when('/cancelapp/:_appId', {
		templateUrl: 'pages/appoperation.html',
		controller: 'CancelApplicationController',
		css: 'css/page.css'
	}).when('/dointerview/:_appId/:action', {
		templateUrl: 'pages/appoperation.html',
		controller: 'DoInterviewController',
		css: 'css/page.css'
	}).when('/archiveapp/:_appId', {
		templateUrl: 'pages/appoperation.html',
		controller: 'ArchiveApplicationController',
		css: 'css/page.css'
	})
	/**
	 * User login and logout
	 */
	.when('/login', {
		templateUrl: 'pages/user/usersign.html',
		controller: 'LoginController',
		css: 'css/page.css'
	}).when('/logout/:_uId', {
		templateUrl: 'pages/user/usersign.html',
		controller: 'LogoutController',
		css: 'css/page.css'
	}).when('/dashboard-reviewer', {
		templateUrl: 'pages/user/dashboard-reviewer.html',
		controller: 'ReviewerDashboardController',
		css: 'css/page.css'
	}).when('/dashboard-manager', {
		templateUrl: 'pages/user/dashboard-manager.html',
		controller: 'ManagerDashboardController',
		css: 'css/page.css'
	}).when('/manage-jobs', {
		templateUrl: 'pages/manage-jobs.html',
		controller: 'ManageJobsController',
		css: 'css/page.css'
	}).when('/manage-apps/:_jobId', {
		templateUrl: 'pages/manage-apps.html',
		controller: 'ManageAppController',
		css: 'css/page.css'
	}).when('/manage-viewapp/:_appId', {
		templateUrl: 'pages/manage-viewapp.html',
		controller: 'ManageAppDetailController',
		css: 'css/page.css'
	}).when('/app-autocheck/:_appId', {
		templateUrl: 'pages/app-autocheck.html',
		controller: 'AutoCheckController',
		css: 'css/page.css'
	}).when('/app-shortlist/:_appId/:action', {
		templateUrl: 'pages/app-shortlist.html',
		controller: 'ShortlistController',
		css: 'css/page.css'
	}).when('/app-assignreview/:_appId', {
		templateUrl: 'pages/assignteamreview.html',
		controller: 'AssignReviewController',
		css: 'css/page.css'
	})
	/**
	 * Job postings route
	 */
	.when('/searchjob', {
		templateUrl: 'pages/searchjob.html',
		controller: 'SearchJobController',
		css: 'css/page.css'
	})
	.otherwise({
		redirectTo: '/'
	})

	$locationProvider.html5Mode(true).hashPrefix('!');

	// $httpProvider.interceptors.push(function() {
 //        return {
 //            request: function(config) {
 //                if (~['POST', 'PUT', 'DELETE'].indexOf(config.method)) {
 //                    config.headers['X-CSRFToken'] = getCookie("csrftoken");
 //                }
 //            }
 //        };
 //    });
});

