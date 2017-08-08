;(function (angular) {
    'use strict';

    angular
        .module('controllers.Auth', [])
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$rootScope', '$location', 'eventHub', '$http', '$timeout'];

    function AuthCtrl ($rootScope, $location, eventHub, $http, $timeout) {
        var vm = this;
        vm.noLogin = false;
        vm.loading = false;
        vm.enter = function () {
            eventHub.socket.connect();
            eventHub.emit('auth: do login by name', {data: vm.user});
        };

        eventHub.on('auth: user is authenticated', function (res) {
            
            if(res.user.name.toLowerCase() != "admin")
            {
                vm.loading = true;
                    $http({
                    url: "http://auctionusersapi20170804022804.azurewebsites.net/users/login", 
                    method: "GET",
                    params: {email: vm.user.name,
                              password: vm.user.password  }
                    }).then(function (response) {
                        vm.loading = false;
                        if (response.data){
                            $location.path('dashboard');
                        }
                        else{
                            vm.noLogin = true;
                            $timeout(function () {
                                vm.noLogin = false;
                            }, 4000);
                        }
                    });
            }
            else
                $location.path('admin');

            $rootScope.$on('$routeChangeSuccess', function () {
                eventHub.scope.$emit('user:authenticated', res);
            });
        });

        eventHub.on('auth: access denied', function () {
            $location.path('403');
        });

    }

})(angular);
