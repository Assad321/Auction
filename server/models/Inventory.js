(function () {

    function F(config) {
        var db = config.db;
        var Sequelize = config.Sequelize;

        var Inventory = db.define('Inventory', {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        }, {
                timestamps: false
            });

        Inventory.decreaseQuantity = function (list, auction) {
            for (var i in list) {
                if (list[i].id === auction.item.id && i >= 0) {
                    list[i].UserInventory.quantity -= auction.quantity;
                    return list;
                }
            }
            return null;
        };


        Inventory.addItem = function (name) {
            console.log(name);
            Inventory.create({
                name:name
            })
            .then(function (inventory) {
                var allUsers = [];

                User.findAll({}).then(res => {
                    res.forEach(function (item){
                        allUsers.push(item.dataValues);
                    });
                });
                Inventory.findOne({ where: {name: name} }).then(project => {
                    allUsers.forEach(function (singleUser){
                        db.query('insert or ignore into UserInventories (quantity, UserId, InventoryId) values ("10", "'+ singleUser.id +'", "' + project.dataValues.id + '")');
                    });
                });
                console.log("added");
                return inventory;
            })
            .catch(err=>'Something went wrong'); 
        };
        
        return Inventory;
    }

    module.exports = F;

})();