; (function (angular) {
	'use strict';

	angular
		.module('controllers.Admin', [])
		.controller('AdminCtrl', AdminCtrl);

	AdminCtrl.$inject = ['eventHub', '$scope', '$http'];

	function AdminCtrl(eventHub, $scope, $http) {
		var vm = this;
		vm.file = {};
		vm.file.src = "";
		vm.fileChosen = false;
		vm.users = {};
		vm.loading = false;
		vm.showAddUser = false;
		vm.newUser = {};
		vm.fileName = "";
		vm.uploaded = false;
		$scope.file_changed = function (element) {

			vm.fileChosen = !vm.fileChosen;
			$scope.$apply(function (scope) {
				var photofile = element.files[0];
				vm.file = photofile;
				//  var reader = new FileReader();
				//  reader.onload = function(e) {
				//  };
				//  reader.readAsDataURL(photofile);
			});
		};

		vm.loading = true;
				$http({
                    url: "http://auctionusersapi20170804022804.azurewebsites.net/users/getall", 
                    method: "GET",
                    }).then(function (response) {
						vm.users = response.data;
						console.log(vm.users);
						vm.loading = false;
					});	
					
		vm.deleteUser = function (user){
			console.log(user);
			vm.loading = true;
			$http({
                    url: "http://auctionusersapi20170804022804.azurewebsites.net/users/delete", 
                    method: "GET",
                    params: {id: user.Id}
                    }).then(function (response) {
						var index = vm.users.indexOf(user);
						  vm.users.splice(index, 1); 
						  vm.loading = false;
                    });
		};

		vm.addUserView = function(){
			vm.showAddUser = true;
		};
		vm.addUserSave = function (){
			vm.loading = true;
			$http({
                    url: "http://auctionusersapi20170804022804.azurewebsites.net/users/save", 
                    method: "GET",
                    params: {
						firstName: vm.newUser.FirstName,
						lastName: vm.newUser.LastName,
						email: vm.newUser.Email,
						password: vm.newUser.Password}
                    }).then(function (response) {
						vm.loading = false;
						vm.showAddUser = false
						  console.log(response);
							vm.users.push(response.data);
                    });  
		}
		vm.addUserCancel = function (){
			vm.showAddUser = false;
		}
		vm.upload = function (file) {
			vm.loading = true;
			var formData = new FormData();

			// angular.forEach(files, function (file) {
				formData.append('files', file);
				formData.append('name', vm.fileName);
				// console.log("Files :: ",file);
			// });

			$http.post('http://localhost:3000/files', formData, {
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			})
				.success(function (res) {
					vm.uploaded = true;
					vm.loading = false
					vm.fileChosen = false;
					vm.photo = {};
				})
				.error(function () {
					alert('Fail');
				});
		};
	}



})(angular);