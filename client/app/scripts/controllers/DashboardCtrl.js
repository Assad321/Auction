;(function (angular) {
    'use strict';

    angular
        .module('controllers.Dashboard', [])
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['eventHub', '$http'];

    function DashboardCtrl (eventHub, $http) {
    	var vm = this;
        vm.imageBlob = [];
    	eventHub.scope.$on('user:authenticated', function (evt, data) {
            vm.data = data;
            console.log(vm.data.items);

            angular.forEach(vm.data.items, function(value, key) {
                console.log(vm.data.items);
                $http({
                    method: 'POST',
                    url: 'http://localhost:3000/getfile',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    responseType: "blob",
                    transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                    },
                    data: {"name": value.name.toLowerCase()}
                    }).success(function (response) {
                        console.log(key);
                        var blob = new Blob([response], {type: "image/png"});
                        blob.name = value.name.toLowerCase();
                        blob.url = URL.createObjectURL(blob);

                        vm.imageBlob.push(blob);
                    });
                });
                console.log(vm.imageBlob);
        });
    }

})(angular);