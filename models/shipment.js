// // Sequelize (capital) references the standard library
module.exports = function (sequelize, Datatypes) {
  var Shipment = sequelize.define("shipment", {
    //  ! Here are the columns of the table
    begin: Datatypes.STRING,
    end: Datatypes.STRING,
    item: Datatypes.STRING,
    details: Datatypes.TEXT,
    price: Datatypes.DECIMAL(2),
    miles: Datatypes.INTEGER,
    available: Datatypes.BOOLEAN
  });
  return Shipment;
};