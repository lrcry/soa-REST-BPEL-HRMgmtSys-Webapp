var orsCtrler = angular.module('orsController', ['ngSanitize', 'ngResource', 'ui', 'ui.filters']);

/*********************************************************************************
 * Job application controller methods
 *********************************************************************************/

/**
 * Home page controller
 */
orsCtrler.controller('HomeController', ['$http', '$scope', '$window', '$document', '$rootScope',
	function($http, $scope, $window, $document, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}
	console.log($rootScope.globalLoggedUser);
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
 * Accept / reject application interview controller
 */
orsCtrler.controller('DoInterviewController', ['$http', '$scope', '$routeParams', 
	function($http, $scope, $routeParams) {
	var invitationAction = $routeParams.action;
	var inviteAppId = $routeParams._appId;
	var operationUrl = '//localhost:8080/HRMgmtSysREST/jobapplications/status/' 
							+ inviteAppId + '?status=';
	if (invitationAction === 'accept') {
		$scope.operationName = "Accept invitation";
		operationUrl += 'APP_ACCEPTED_BY_CANDIDATE';
	} else if (invitationAction === 'reject') {
		$scope.operationName = "Reject invitation";
		operationUrl += 'APP_REJECTED_BY_CANDIDATE';
	}

	console.log(operationUrl);
	$http({
		method: 'PUT',
		url: operationUrl
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
 * Manager manage application controller
 */
orsCtrler.controller('ManageAppController', ['$http', '$scope', '$window', '$routeParams', '$rootScope',
	function($http, $scope, $window, $routeParams, $rootScope){
	// authorised user behaviour
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}
	
	var appUrl = '//localhost:8080/HRMgmtSysREST/jobapplications';
	if ($routeParams._jobId != 'all') { // if a job id is not 'all', get apps for this job id
		appUrl += '?_jobId=' + $routeParams._jobId;
	} else { // otherwise get all applications
		;
	}

	$http.get(appUrl).success(function(data) {
		$scope.apps = data;
	});
	
}])

/**
 * Manager view app details
 */
orsCtrler.controller('ManageAppDetailController', ['$http', '$scope', '$window', '$routeParams', '$rootScope', 
	function($http, $scope, $window, $routeParams, $rootScope){
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId
	).success(function(data) {
		$scope.success = true;
		$scope.app = data;
		$http.get(
			'//localhost:8080/HRMgmtSysREST/jobPostings/' + data.application._jobId
		).success(function(jobData) {
			$scope.job = jobData;
		});
	}).error(function(err) {
		$scope.success = false;
		$scope.message = "Failed to view application. Reason: " + err.errMessage;
		$scope.errCode = err.errCode;
	});	
	
}])

/**
 * Application auto check controller
 */
orsCtrler.controller('AutoCheckController', ['$http', '$scope', '$window', '$routeParams', '$rootScope',
	function($http, $scope, $window, $routeParams, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	$scope.checkedAppId = $routeParams._appId;
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobapplications/' + $scope.checkedAppId
	).success(function(data) {
		var autoCheckData = {
			"driverLicenseNumber": data.application.driverLicenseNumber,
			"fullName": data.application.fullName,
			"postCode": data.application.postCode
		};
		console.log(autoCheckData);
		console.log('accessing url for bpel check: //localhost:8080/HRMgmtSysREST/autocheck');
		$http({
			method: 'POST',
			url: '//localhost:8080/HRMgmtSysREST/autocheck',
			data: autoCheckData
		}).success(function(checkResult){
			$scope.checkResult = checkResult;
			$scope.success = true;
			$scope.checkData = autoCheckData;
			console.log('check result: ' + $scope.checkResult.pdvResult + ' ' + $scope.checkResult.crvResult);
		}).error(function(err) {
			$scope.errCode = err.errCode;
			$scope.errMessage = err.errMessage;
			$scope.success = false;
		});
	});
}])

/**
 * Application assign review controller
 */
orsCtrler.controller('AssignReviewController', ['$http', '$scope', '$window', '$routeParams', '$rootScope',
	function($http, $scope, $window, $routeParams, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	// get hiring teams
	$scope.appIdReview = $routeParams._appId;
	$http.get(
		'//localhost:8080/HRMgmtSysREST/users'
	).success(function(data) {
		var teams = [];
		for (var i = 0; i < data.length; ++i) {
			var user = data[i];
			console.log(user);
			var team = user.user.department;
			console.log(team);
			if (teams.indexOf(team) < 0 && team != 'HR') {
				console.log(teams.indexOf(team));
				teams.push(team);
				console.log('now teams: ' + teams);
			}
		}
		$scope.teams = teams;
	});

	// assign review
	$scope.assignTeam = function() {
		$http({
			method: 'POST',
			url: '//localhost:8080/HRMgmtSysWeb/assign',
			data: {
				_appId: $scope.appIdReview,
				team: $scope.assignModel.teamSelect
			}
		}).success(function(data) {
			// set app to APP_REVIEWING
			$http({
				method: 'PUT',
				url: '//localhost:8080/HRMgmtSysREST/jobapplications/status/' 
						+ $scope.appIdReview + '?status=APP_REVIEWING',
			}).success(function(app) {
				$scope.success = true;
			}).error(function(err) {
				$scope.success = false;
				$scope.errCode = err.errCode;
				$scope.errMessage = err.errMessage;
			});
		});
	}
}])

/**
 * Application shortlist controller
 */
orsCtrler.controller('ShortlistController', ['$http', '$scope', '$window', '$routeParams', '$rootScope',
	function($http, $scope, $window, $routeParams, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	var shortListUrl = '//localhost:8080/HRMgmtSysREST/jobapplications/status/' 
						+ $routeParams._appId + '?status=';
	$scope.shortListAction = '';
	if ($routeParams.action == 'list') {
		shortListUrl += 'APP_SHORTLISTED';
		$scope.shortListAction = 'shortlist';
	} else if ($routeParams.action == 'unlist') {
		shortListUrl += 'APP_NOT_SHORTLISTED';
		$scope.shortListAction = 'unshortlist';
	}

	$http({
		method: 'PUT',
		url: shortListUrl,
	}).success(function(data) {
		$scope.success = true;
		$scope._appId = data.application._appId;
	}).error(function(err) {
		$scope.success = false;
		$scope.errCode = err.errCode;
		$scope.errMessage = err.errMessage;
	});	
}])

/*********************************************************************************
 * User sign in/out controller methods
 *********************************************************************************/

/**
 * User login
 */
orsCtrler.controller('LoginController', ['$http', '$scope', '$window', '$document', '$timeout',
	function($http, $scope, $window, $document, $timeout){

	$scope.login = function() {
		$http.get(
			'//localhost:8080/HRMgmtSysREST/users/' + $scope.loginModel._uId
		).success(function(data) {
			console.log(data);
			var userId = $scope.loginModel._uId;
			if ($scope.loginModel._pwd === data.user._pwd) { // _uId _pwd match, success
				$scope.success = true;
				var loginResultJson = {
					login: true,
					loggedUser: data.user
				}
				$window.sessionStorage.setItem('loginstatus', JSON.stringify(loginResultJson));
				$scope.loggedUser = data.user;
				$timeout(function() {
					$window.location.href = 'index.html';
				}, 1000);
			} else {
				
				$scope.success = false;
				$scope.errCode = "WRONG_PASSWORD";
				$scope.errMessage = "You tried to login with user whose ID=" 
									+ userId + " with a wrong password.";
			}
		}).error(function(err) {
			$scope.success = false;
			$scope.errCode = err.errCode;
			$scope.errMessage = err.errMessage;
		});
	}
}])

/**
 * User logout
 */
orsCtrler.controller('LogoutController', ['$http', '$scope', '$routeParams', '$rootScope', '$window', '$timeout',
	function($http, $scope, $routeParams, $rootScope, $window, $timeout) {
	$rootScope.login = false;
	$rootScope.globalUid = '';
	$scope.loggedout = true;
	var logoutResultJson = {
		login: false,
		_uId: ''
	}

	$window.sessionStorage.setItem('loginstatus', JSON.stringify(logoutResultJson));
	$timeout(function() {
		$window.location.href = 'index.html';
	}, 1000);
}])

/**
 * Reviewer dashboard controller
 */
orsCtrler.controller('ReviewerDashboardController', ['$http', '$scope', '$window', '$routeParams', '$rootScope',
	function($http, $scope, $window, $routeParams, $rootScope){
	// authorised user behaviour
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	var reviewer = $rootScope.globalLoggedUser;
	$scope.appForReviewArray = [];
	$http.get(
		'//localhost:8080/HRMgmtSysWeb/teamassign/' + reviewer.department
	).success(function(data) {
		var reviews = data; // {_appId, team}
		if (reviews.length <= 0) {
			$scope.haveReview = false; // have nothing to review at present
		} else {
			$scope.haveReview = true; // have something to review at present

			for (var i = 0; i < reviews.length; ++i) {
				var review = reviews[i];
				$http.get(
					'//localhost:8080/HRMgmtSysREST/jobapplications/' + review._appId
				).success(function(app) {
					var appForReview = app.application;
					$http.get(
						'//localhost:8080/HRMgmtSysREST/reviews?_appId=' 
							+ appForReview._appId + '&_uId=' + reviewer._uid
					).success(function(rev) {
						// if user's review found in database, can see review but not create or update,
						// can close review
						if (rev.length > 0) {
							appForReview.reviewed = rev[0].review._reviewId;
						} else {
							// otherwise user can create review only, 
							// cannot see review, cannot close review
							appForReview.reviewed = "NOT_REVIEWED_YET";
						}
						$scope.appForReviewArray.push(appForReview);
					});

				});
			}
		}
	});
}])

/**
 * Manager dashboard controller
 */
orsCtrler.controller('ManagerDashboardController', ['$http', '$scope', '$window', '$rootScope',
	function($http, $scope, $window, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
		return;
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}
	console.log($rootScope.globalLoggedUser);
}])

/*********************************************************************************
 * Job posting controller methods
 *********************************************************************************/

/**
 * Search for job posting
 */
orsCtrler.controller('SearchJobController', ['$http', '$scope',
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

/**
 * Manage jobs controller
 */
orsCtrler.controller('ManageJobsController', ['$http', '$scope', '$window', '$rootScope', 
	function($http, $scope, $window, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}
	console.log($rootScope.globalLoggedUser);
	console.log("managing jobs");
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobPostings?_uId=' + $rootScope.globalLoggedUser._uid
	).success(function(data) {
		$scope.jobPostings = data;
		$scope.isHomePage = false;
		console.log($scope.isHomePage);
	});
}])

/*********************************************************************************
 * Hiring team controller methods
 *********************************************************************************/

/**
 * View review controller
 */
orsCtrler.controller('ViewReviewController', ['$http', '$scope', '$window', '$routeParams', '$rootScope', 
	function($http, $scope, $window, $routeParams, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	$scope.action = 'View';
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId
	).success(function(app) {
		$scope.app = app.application;
		
		$http.get(
			'//localhost:8080/HRMgmtSysREST/reviews?_appId=' 
				+ app.application._appId 
				+ '&_uId=' + $rootScope.globalLoggedUser._uid
		).success(function(rev) {
			$scope.review = rev[0].review;
		});
	});


}])

/**
 * Create new review controller
 */
orsCtrler.controller('CreateReviewController', ['$http', '$scope', '$window', '$routeParams', '$rootScope', 
	function($http, $scope, $window, $routeParams, $rootScope){

	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	var _appIdReview = ''; // got app id

	$scope.action = 'Create';
	$http.get(
		'//localhost:8080/HRMgmtSysREST/jobapplications/' + $routeParams._appId
	).success(function(app) {
		$scope.app = app.application;
		// _appIdReview = app.application._appId;
	});

	
	var _uIdReview = $rootScope.globalLoggedUser._uid; // got user id
	// alert('[' + _appIdReview + '] [' + _uIdReview + ']');

	$scope.submitReview = function() {
		$http({
			method: 'POST',
			url: '//localhost:8080/HRMgmtSysREST/reviews',
			data: {
				_appId: $routeParams._appId,
				_uId: _uIdReview,
				comments: $scope.addReview.comments,
				decision: $scope.addReview.decision
			}
		}).success(function(data) {
			$scope.success = true;
		}).error(function(err) {
			$scope.success = false;
			$scope.errCode = err.errCode;
			$scope.errMessage = err.errMessage;
		});
	}
}])

/**
 * Close review controller
 */
orsCtrler.controller('CloseReviewController', ['$http', '$scope', '$window', '$routeParams', '$rootScope', 
	function($http, $scope, $window, $routeParams, $rootScope){
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	$scope.action = 'Close';
	$scope._appId = $routeParams._appId;

	// set app status to reviewed
	$http({
		method: 'PUT',
		url: '//localhost:8080/HRMgmtSysREST/jobapplications/status/' 
			+ $routeParams._appId + '?status=APP_REVIEWED'
	}).success(function(app) {
		// close in webapp
		$http({
			method: 'POST',
			url: '//localhost:8080/HRMgmtSysWeb/closeassign/' + $routeParams._appId
		}).success(function(assign) {
			$scope.success = true;
		}).error(function(closeErr) {
			$scope.success = false;
			$scope.errCode = err.errCode;
			$scope.errMessage = err.errMessage;
		});
	}).error(function(err) {
		$scope.success = false;
		$scope.errCode = err.errCode;
		$scope.errMessage = err.errMessage;
	});
}])

/**
 * Review result controller
 */
orsCtrler.controller('ReviewResultController', ['$http', '$scope', '$window', '$routeParams', '$rootScope', 
	function($http, $scope, $window, $routeParams, $rootScope){
	alert('review result!');
	if (!angular.isDefined($window.sessionStorage.loginstatus)) {
		$rootScope.login = false;
		$rootScope.globalLoggedUser = {};
		$window.href.location = 'login.html'; // if not loggedin, go to login page
	} else {
		var loginstatus = JSON.parse($window.sessionStorage.loginstatus);
		$rootScope.login = loginstatus["login"];
		$rootScope.globalLoggedUser = loginstatus["loggedUser"];
	}

	$http.get(
		'//localhost:8080/HRMgmtSysREST/reviews?_appId=' + $routeParams._appId
	).success(function(data) {
		$scope.success = true;
		$scope.reviews = data;
		alert($scope.reviews);
	}).error(function(err) {
		$scope.success = false;
		$scope.errCode = err.errCode;
		$scope.errMessage = err.errMessage;
	});
}])
