angular.module('userControllers',['userServices'])

.controller('regCtrl',function($http,$location,$timeout,User,$scope,API_GET,API_POST){//

	API_POST.callAPI('account/register').then(res=>{
		 // console.log(res);
		// $scope.title = res.data.message;
	},err=>{
		//console.log(err);
	});

	var app = this;

	app.regUser=(regData)=>{
		
		this.loading = true;
		this.errorMsg = false;
		User.create(this.regData).then(data=>{
			
			if(data.data.success){
				this.loading = false;
				this.successMsg = data.data.message + '....Redirecting';
				$timeout(function(){
					// $location.path('/users/profile/'+data.data.u_id);
				},2000);

			}else{
				
				this.loading = false;
				this.errorMsg = data.data.message;
				this.t = data.data.message;
				console.log(this.t);
			
			}


		});
	};
})

.controller('userLoginCtrl',function($http,$location,$timeout,User,$scope,API_GET,API_POST){//

	/*API_POST.callAPI('account/register').then(res=>{
		console.log(res);
		$scope.title = res.data.message;
	},err=>{
		console.log(err);
	});*/

	var app = this;

	app.regUser=(regData)=>{
		app.loading = true;
		app.errorMsg = false;
		User.create(app.regData).then(data=>{

			if(data.data.success){
				app.loading = false;
				app.successMsg = data.data.message + '....Redirecting';

				$timeout(function(){
					$location.path('/users/profile/1');
				},2000);

			}else{
				app.loading = false;
				app.errorMsg = data.data.message;
			}


		});
	};
})

.controller('editUsrCtrl',function($scope,$location,$timeout,$http,API_GET,API_POST,$route){


	var app = this;
	$scope.account = {};
	var url = window.location.pathname;
	var lastPart = url.split('/').pop();

	loaduserProfile();

	function loaduserProfile(){

		API_POST.callAPI('users/profile/'+lastPart).then(res=>{
			var data = res.data.data[0];
			$scope.account = data;
			$scope.account.old_photo_url = $scope.account.photo_url;

			if(data.photo_url === '' || data.photo_url === null ){
				$scope.account.photo_url = 'http://localhost:3000/users/images/none.png';
				$('#imgpreview').attr('src', $scope.account.photo_url);
			}else{

				$scope.account.photo_url = 'http://localhost:3000/users/images/'+ data.photo_url;
				$('#imgpreview').attr('src', $scope.account.photo_url);

			}
		},err=>{
			console.log(err);
		});

	}

	function readURL(input) {

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				$('#imgpreview').attr('src', e.target.result);

			}

			reader.readAsDataURL(input.files[0]);

		}
	}

	$("#file1").change(function(e) {
		readURL(this);
		$scope.account.photo_url = e.target.files[0].name;
	});
	$('#imgpreview').click(function(){
		$('#file1').trigger('click');
		});

	$scope.submit = (data)=>{

		var formData = new FormData;
		for(key in data){
			formData.append(key, data[key]);
		}

		var file = $('#file1')[0].files[0];
		formData.append('image',file);

		if (file == undefined){
			console.log('photo won\'t be replaced anyway..');
			formData.append('state',false);
		}else{
			console.log('photo will be replace anyway..');
			formData.append('state',true);
		}

		$http.post('users/profile/:id/update', formData ,{
			transformRequest: angular.identity,
			headers:{
				'content-Type': undefined
			}
		}).then(data=>{

			loaduserProfile();
		});



	};
})
;
