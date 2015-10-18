var orsCtrler = angular.module('orsController', ['ngSanitize', 'ngResource']);

/**
 * Home page controller
 */
orsCtrler.controller('HomeController', ['$http', '$scope', function($http, $scope){
	$http.get('//localhost:8080/HRMgmtSysREST/jobPostings').success(function(data) {
		$scope.jobPostings = data;
		$scope.isHomePage = true;
		console.log($scope.isHomePage);
	});
}])

orsCtrler.controller('JobDetailController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams){
	$http.get('//localhost:8080/HRMgmtSysREST/jobPostings/' + $routeParams._jobId).success(function(data) {
		$scope.jobPosting = data.jobPosting;
		console.log('_jobId=' + $routeParams._jobId + ', returnJobId=' + $scope.jobPosting._jobId + ', status=' + $scope.jobPosting.status);
	});
}])

orsCtrler.controller('JobApplyController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
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

orsCtrler.controller('ViewApplicationController', ['$http', '$scope', function($http, $scope) {
	alert("application!");
}])