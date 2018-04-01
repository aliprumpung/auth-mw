angular.module('userServices',[])
.factory('User',($http)=>{
	UserFactory = {};
	UserFactory.create = function(regData){
		return $http.post('users/signup',regData);
	}
	return UserFactory;
})
.factory('API_GET', ($http)=>{
ApiFactory = {};
	ApiFactory.callAPI = function(name){
	return $http({
		url:'http://localhost:3000/'+name,
		data:"",
		method:'get'
	});
	
}
return ApiFactory;

})
.factory('API_POST', ($http)=>{
ApiFactory = {};
	ApiFactory.callAPI = function(name){
	return $http({
		url:'http://localhost:3000/'+name,
		data:"",
		method:'post'
	});
	
}

return ApiFactory;

});