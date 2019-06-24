// // Sequelize (capital) references the standard library
module.exports = function (sequelize, Datatypes) {
  var Shipment = sequelize.define("shipment", {
    //  ! Here are the columns of the table
    begin: Datatypes.STRING,
    beginCity: Datatypes.STRING,
    end: Datatypes.STRING,
    item: Datatypes.STRING,
    details: {
      type: Datatypes.TEXT,
      defaultValue: "none provided",
      comment: "nothing was entered here"
    },
    price: {
      type: Datatypes.FLOAT,
      // defaultValue: 0
    },
    miles: {
      type: Datatypes.INTEGER,
      // defaultValue: 0
    },
    available: Datatypes.BOOLEAN
  });
  return Shipment;
};