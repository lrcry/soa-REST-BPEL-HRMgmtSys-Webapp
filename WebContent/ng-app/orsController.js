var orsCtrler = angular.module('orsController', ['ngSanitize', 'ngResource']);

/**
 * Home page controller
 */
orsCtrler.controller('HomeController', ['$http', '$scope', function($http, $scope){
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobPostings'
	).success(function(data) {
		$scope.jobPostings = data;
		$scope.isHomePage = true;
		console.log($scope.isHomePage);
	});
}])

/**
 * Job details controller
 */
orsCtrler.controller('JobDetailController', ['$http', '$scope', '$routeParams', 
	function($http, $scope, $routeParams){
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobPostings/' + $routeParams._jobId
	).success(function(data) {
		$scope.jobPosting = data.jobPosting;
		console.log('_jobId=' + $routeParams._jobId + ', returnJobId=' 
			+ $scope.jobPosting._jobId + ', status=' + $scope.jobPosting.status);
	});
}])

/** 
 * Apply for a job controller
 */
orsCtrler.controller('JobApplyController', ['$http', '$scope', '$routeParams', 
	function($http, $scope, $routeParams) {
	$scope.jobId = $routeParams._jobId;
	$scope.jobApplyObject = {};
	$scope.processApply = function() {
		$http({
			method: 'POST',
			url: '//localhost:8080/HRMgmtSysREST/jobapplications',
			data: {
				"_jobId": $routeParams._jobId,
				"fullName": $scope.jobApply.fullName,
				"driverLicenseNumber": $scope.jobApply.driverLicenseNumber,
				"postCode": $scope.jobApply.postCode,
				"textCoverLetter": $scope.jobApply.textCoverLetter,
				"textBriefResume": $scope.jobApply.textBriefResume
			},
			headers: { 'Content-Type': 'application/json' }
		}).success(function(data) {
			console.log(data);
			$scope.success = true;
			$scope.message = "Apply successful. Please keep your application ID for further reference: ";
			$scope._applyIdNew = data.application._appId;
		}).error(function(err) {
			console.log(err);
			$scope.success = false;
			$scope.message = "Apply failed. Reason: " + err.errMessage;
			$scope.errCode = err.errCode;
		});
	};
}])

/**
 * View application controller
 */
orsCtrler.controller('ViewApplicationController', ['$http', '$scope', 
	function($http, $scope) {
	$scope.getApplication = function() {
		console.log("appid=" + $scope.viewApp._appId);
		var oldInputId = $scope.viewApp._appId;
		$http.get(
			'//localhost:8080/HRMgmtSysREST/jobapplications/' + $scope.viewApp._appId
		).success(function(data) {
			$scope.success = true;
			$scope.app = data;
			$scope.oldId = oldInputId;
			$scope.currentStatus = data.application.status;
			$http.get(
				'//localhost:8080/HRMgmtSysREST/jobPostings/' + data.application._jobId
			).success(function(jobData) {
				$scope.job = jobData;
			});
		}).error(function(err) {
			$scope.success = false;
			$scope.message = "Failed to view application. Reason: " + err.errMessage;
			$scope.errCode = err.errCode;
			$scope.oldId = oldInputId;
		});
	}
}])

/**
 * Update application controller
 */
orsCtrler.controller('UpdateApplicationController', ['$http', '$scope', 
	function($http, $scope, $routeParams) {

}])

/**
 * Cancel application controller
 */
orsCtrler.controller('CancelApplicationController', ['$http', '$scope', 
	function($http, $scope) {
	
}])

/**
 * Archive application controller
 */
orsCtrler.controller('ArchiveApplicationController', ['$http', '$scope', 
	function($http, $scope) {
	
}])
