var orsCtrler = angular.module('orsController', ['ngSanitize', 'ngResource']);

/*********************************************************************************
 * Job application controller methods
 *********************************************************************************/

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
orsCtrler.controller('UpdateApplicationController', ['$http', '$scope', '$routeParams',
	function($http, $scope, $routeParams) {
	$scope.operationName = 'Update';
	$scope._appIdForOperation = $routeParams._appId;
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId
	).success(function(data) {
		$scope.app = data;
	});

	$scope.updateApp = function() {
		$http({
			method: 'PUT',
			url: '//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId,
			data: {
				"_jobId": $scope.app.application._jobId,
				"fullName": $scope.app.application.fullName,
				"driverLicenseNumber": $scope.app.application.driverLicenseNumber,
				"postCode": $scope.app.application.postCode,
				"textCoverLetter": $scope.app.application.textCoverLetter,
				"textBriefResume": $scope.app.application.textBriefResume
			}
		}).success(function(data) {
			$scope.success = true;
			$scope.operatedApp = data;
		}).error(function(err) {
			$scope.success = false;
			$scope.errCode = err.errCode;
			$scope.errMessage = err.errMessage;
		});
	}
}])

/**
 * Cancel application controller
 */
orsCtrler.controller('CancelApplicationController', ['$http', '$scope', '$routeParams',
	function($http, $scope, $routeParams) {
	$scope.operationName = 'Cancel';
	$scope._appIdForOperation = $routeParams._appId;
	$http({
		method: 'PUT',
		url: '//localhost:8080/HRMgmtSysREST/jobapplications/status/' 
				+ $routeParams._appId 
				+ "?status=APP_CANCELLED"
	}).success(function(data) {
		$scope.success = true;
		$scope.operatedApp = data;
	}).error(function(err) {
		$scope.success = false;
		$scope.errCode = err.errCode;
		$scope.errMessage = err.errMessage;
	});
}])

/**
 * Archive application controller
 */
orsCtrler.controller('ArchiveApplicationController', ['$http', '$scope', '$routeParams',
	function($http, $scope, $routeParams) {
	$scope.operationName = "Archive";
	$scope._appIdForOperation = $routeParams._appId;
	$http({
		method: 'DELETE',
		url: '//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId
		// headers: {'X-HTTP-Method-Override': 'PATCH'}
	}).success(function(data) {
		$scope.success = true;
		$scope.operatedApp = data;
	}).error(function(err) {
		$scope.success = false;
		$scope.errCode = err.errCode;
		$scope.errMessage = err.errMessage;
	});
}])

/*********************************************************************************
 * Job posting controller methods
 *********************************************************************************/

/**
 * Search for job posting
 */
orsCtrler.controller('SearchJobController', ['$http', '$scope', '$routeParams', 
	function($http, $scope) {
	$scope.searchJob = function() {
		var searchTitle = $scope.searchModel.title;
		if (typeof searchTitle === 'undefined') {
			searchTitle = '';
		}

		var searchSalaryRate = $scope.searchModel.salaryRate;
		if (typeof searchSalaryRate === 'undefined') {
			searchSalaryRate = '';
		}

		var searchPositionType = $scope.searchModel.positionType;
		if (typeof searchPositionType === 'undefined') {
			searchPositionType = '';
		}

		var searchLocation = $scope.searchModel.location;
		if (typeof searchLocation === 'undefined') {
			searchLocation = '';
		}

		var searchUrl = '//localhost:8080/HRMgmtSysREST/jobPostings?title=' + searchTitle 
							+ '&salaryRate=' + searchSalaryRate
							+ '&positionType=' + searchPositionType
							+ '&location=' + searchLocation;
		console.log(searchUrl);

		$http.get(
			searchUrl
		).success(function(data) {
			$scope.success = true;
			$scope.jobPostings = data;
			console.log($scope.jobPostings);
		}).error(function(err) {
			$scope.success = false;
			console.log(err);
		});
	}
}])
