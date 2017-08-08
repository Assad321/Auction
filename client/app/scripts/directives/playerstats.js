;(function (angular) {
    'use strict';

    var app = angular.module('directives.PlayerStats', []);

    app.directive('playerstats', PlayerStats);
    PlayerStats.$inject = ['$location', '$timeout', 'eventHub'];

    function PlayerStats ($location, $timeout, eventHub) {
        return {
            restrict: 'E',
            template: '\
                    <h2 class="ui header"> \
                    <img src="/assets/player.png"> \
                    <div class="content"> \
                        User Detail \
                    </div> \
                    </h2> \
                <div class="ui segment"> \
                    <div><b>Name:</b> {{ vm.data.user.name }}</div> \
                    <div><b>Coins:</b> {{ vm.data.user.coins }}</div> \
                    <div class="ui basic segment" style="padding-left:0"> \
                        <button ng-click="vm.logout()" class="ui red button">Logout</button> \
                    </div> \
                    <div ng-show="vm.showCongratulations" class="ui info message"> \
                        Congratulations! You win! \
                    </div> \
                </div> \
            </div>',
            scope: '=',
            link: function (scope, element, attrs) {
                var vm = scope.vm;

                vm.logout = function () {
                    eventHub.socket.disconnect();
                };

                eventHub.on('disconnect', function () {
                    $location.path('auth');
                });

                eventHub.on('user: update seller and winner data', function (res) {
                    eventHub.scope.$emit('user:authenticated', res);
                });

                eventHub.on('auction: finished and have a winner', function (res) {
                    var name = vm.data.user.name;
                    
                    if (name === res.winner) {
                        vm.showCongratulations = true;
                        $timeout(function () {
                            vm.showCongratulations = false;
                        }, 2000);
                    }
                    if (name === res.seller || name === res.winner) {
                        eventHub.emit('user: retrieve updated seller and winner data', name);
                    }
                });
            }
        };
    }

})(angular);
