angular.module('appRoutes',['ngRoute'])
.config(($routeProvider,$locationProvider)=>{

$routeProvider
	.when('/account',{
		templateUrl:'app/views/pages/home.hbs'
	})
	.when('/users/signup',{
		templateUrl:'app/views/pages/register.hbs',
		controller:'regCtrl',
		controllerAs:'register'
	})
	
	.when('/users/profile/:id',{
		templateUrl:'app/views/pages/profile.hbs',
		controller:'editUsrCtrl',
		controllerAs:'editusrprofile'
	})
	.when('/account/login',{
		templateUrl:'app/views/login.hbs',
		controller:'userLoginCtrl',
		controllerAs:'userlogin'
	})
	;


	//.otherwise({ redirectTo: '/'} );

	$locationProvider.html5Mode({
		enabled:true,requireBase:false
	});
});

