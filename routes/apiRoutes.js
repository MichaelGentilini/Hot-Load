var db = require("../models");
var axios = require("axios");

// ! Get request for distances from Google
module.exports = function (app) {
  // Get all shipments
  app.get("/api/distance/:from/:to", function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var key = "AIzaSyB2W892gFksiHUVpB-RmF0vPmV0ExdiOJM";
    var url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&mode=driving&key=${key}`
    axios.get(url).then(response => {
      res.json(response.data.rows[0].elements[0]);
    });
  });

  // // todo Display all shipments
  // app.get("/api/shipments", function (req, res) {
  //   db.Shipment.findAll({}).then(function (dbShipment) {
  //     res.json(dbShipment);
  //   });
  // });

  // todo  Search a shipment by id
  app.get("/api/shipments/:id", function (req, res) {
    var id = req.params.id;
    db.Shipment.findOne({
      where: {
        id
      }
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });

  // ! Create a new shipment
  app.post("/api/shipments", function (req, res) {
    console.log(req.body);
    db.Shipment.create({
        begin: req.body.begin,
        end: req.body.end,
        item: req.body.item,
        details: req.body.details,
        price: req.body.price,
        miles: req.body.miles
      })
      .then(function (dbShipment) {
        console.log(dbShipment);
        res.json(dbShipment);
      });
  });

  // todo Delete an Shipment by id
  app.delete("/api/shipments/:id", function (req, res) {
    db.Shipment.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (
      dbShipment
    ) {
      res.json(dbShipment);
    });
  });

  // todo Modify an existing shipment
  app.put("/api/shipments", function (req, res) {
    db.Shipment.update(req.body, {
        where: {
          id: req.body.id
        }
      })
      .then(function (dbShipment) {
        res.json(dbShipment);
      });
  });
};