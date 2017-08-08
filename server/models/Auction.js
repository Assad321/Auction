(function () {

    function Auction () {
        
        this.create = function (req) {
            var auction = req.data.newAuction;
            auction.user = req.data.user;
            auction.bid = 0;
            auction.winningBid = 0;
            auction.winner = {};
            return auction;
        };

        return this;
       
    }

    module.exports = Auction();

})();