module.exports = function(sequelize, DataTypes) {
//   var Example = sequelize.define("Example", {
//     text: DataTypes.STRING,
//     description: DataTypes.TEXT
//   });
//   return Example;
// };

// require our module
var Sequelize=require('sequelize');
//  create a new sequelize instance
//  connect to our database
var sequelize = new Sequelize('hot_loads_db', 'root', 'password', {
  host: '',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// Creation of the model "shipment"
var shipment = sequelize.define('shipment', {
    // Here are the columns of the table
    item: {Datatypes: Sequelize.STRING},
    pickup: {Datatypes: Sequelize.STRING},
    delivery: {Datatypes: Sequelize.STRING},
    tripMiles: {Datatypes: Sequelize.INTEGER},
    details: {Datatypes: Sequelize.STRING},
    pricePerMile: {Datatypes: Sequelize.DECIMAL}
  });

  shipment.sync().then(function () {
    // Table created
    return shipment;
    
  //   create({
  //     item: 'Truck',
  //     pickup: 'Dallas, TX',
  //     delivery: "Irving, TX",
  //     tripMiles: "",
  //     details: "4 whell drive pickup weighing 3500 lbs",
  //     pricePerMile: "1.00"
  //   });
  // });