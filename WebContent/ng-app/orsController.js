var orsCtrler = angular.module('orsController', ['ngSanitize', 'ngResource']);

/**
 * Home page controller
 */
orsCtrler.controller('HomeController', ['$http', '$scope', function($http, $scope){
	$http.get('//192.168.1.11:8080/HRMgmtSysREST/jobPostings').success(function(data) {
		$scope.jobPostings = data;
		$scope.isHomePage = true;
		console.log($scope.isHomePage);
	});
}])

orsCtrler.controller('JobDetailController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams){
	$http.get('//192.168.1.11:8080/HRMgmtSysREST/jobPostings/' + $routeParams._jobId).success(function(data) {
		$scope.jobPosting = data.jobPosting;
		console.log('_jobId=' + $routeParams._jobId + ', returnJobId=' + $scope.jobPosting._jobId + ', status=' + $scope.jobPosting.status);
	});
}])

orsCtrler.controller('ViewApplicationController')