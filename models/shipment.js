// // Sequelize (capital) references the standard library
module.exports = function (sequelize, Datatypes) {
  var Shipment = sequelize.define("shipment", {
    //  ! Here are the columns of the table
    begin: Datatypes.STRING,
    end: Datatypes.STRING,
    item: Datatypes.STRING,
    details: Datatypes.TEXT,
    price: Datatypes.DECIMAL,
    miles: Datatypes.INTEGER
  });
  return Shipment;
};

// module.exports = function (sequelize, DataTypes) {
//   var Example = sequelize.define("Example", {
//     text: DataTypes.STRING,
//     description: DataTypes.TEXT
//   });
//   return Example;
// };