;(function (angular) {
    'use strict';

    var app = angular.module('directives.Auction', []);

    app.directive('auction', Auction);
    Auction.$inject = ['eventHub'];

    function Auction (eventHub) {
        return {
            restrict: 'E',
            template: '\
                <h2 class="ui header"> \
                    <img src="/assets/auction.png"> \
                    <div class="content"> \
                        Current Auctions \
                    </div> \
                    </h2> \
                <div class="ui segment" ng-hide="vm.currentAuction"> \
                    <div class="ui info message">No auctions in progress</div> \
                </div> \
                <div class="ui segment" ng-show="vm.currentAuction"> \
                    <div><b>Seller:</b> {{ vm.currentAuction.user.name }}</div> \
                    <div class="ui horizontal basic segments" style="border:0;box-shadow:none"> \
                        <div class="ui basic segment center aligned"> \
                        <div>{{ vm.currentAuction.item.name }}</div> \
                        </div> \
                        <div class="ui basic segment center aligned"> \
                            <div class="ui mini statistic" style="margin-top:15px"> \
                                <div class="label">Quantity</div> \
                                <div class="value">{{ vm.currentAuction.quantity }}</div> \
                            </div> \
                        </div> \
                    </div> \
                    <div ng-hide="vm.isReport"><b>Time left:</b> {{ vm.timeRemaining }}s</div> \
                    <div ng-show="vm.currentAuction.winner.name && vm.isReport"><b>Winner:</b> {{ vm.currentAuction.winner.name }}</div> \
                    <div ng-show="vm.currentAuction.winningBid <= vm.currentAuction.minimumBid"><b>Minimum bid:</b> {{ vm.currentAuction.minimumBid }}</div> \
                    <div ng-show="vm.currentAuction.winningBid > vm.currentAuction.minimumBid"><b>Winning bid:</b> {{ vm.currentAuction.winningBid }}</div> \
                    <div ng-hide="vm.currentAuction.user.name == vm.data.user.name" class="ui basic segment center aligned"> \
                        <div class="ui form"><div class="inline fields"> \
                            <div class="field"><label>Your bid:</label></div> \
                            <div class="field" style="width:70%"><input ng-model="vm.currentAuction.bid"></div> \
                        </div></div \
                        <div style="margin-top:20px"> \
                            <button ng-click="vm.placeBid()" class="ui primary button">Place bid</button> \
                        </div> \
                    </div> \
                </div> \
            </div>',
            scope: '&',
            link: function (scope, element, attrs) {
                var vm = scope.vm;
                vm.timeRemaining = 90;

                vm.placeBid = function () {
                    var user = vm.data.user;
                    var auction = vm.currentAuction;

                    if (isEnoughMoney(user, auction)) {
                        user.coins -= auction.bid;
                        var data = {
                            user: user,
                            auction: auction
                        };
                        eventHub.emit('auction: someone place bid', {data: data});
                    }
                };

                eventHub.on('auction: started', function (res) {
                    vm.currentAuction = res.data;
                    if (res.data) {
                        vm.currentAuction.bid = calculateBidValue(vm.currentAuction);
                    }
                });

                eventHub.on('auction: show the countdown', function (res) {
                    vm.timeRemaining = res;
                });

                eventHub.on('auction: show who is the winner', function (res) {
                    var data = res.data;
                    vm.timeRemaining = data.timeRemaining;
                    vm.isReport = true;
                    vm.currentAuction.winner = data.winner;
                    vm.currentAuction.winningBid = data.winningBid;
                });

                eventHub.emit('auction: is there any auction in progress?');

                function calculateBidValue (auction) {
                    if (auction) {
                        var winningBid = parseInt(auction.winningBid);
                        var minimumBid = parseInt(auction.minimumBid);
                        if (winningBid > minimumBid) {
                            return winningBid + 1;
                        }
                        return minimumBid + 1;
                    }
                    return 1;
                }

                function isEnoughMoney (user, auction) {
                    return user.coins - auction.bid > auction.minimumBid;
                }
            }
        };
    }

})(angular);
