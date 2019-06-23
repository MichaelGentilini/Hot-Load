var db = require("../models");
var axios = require("axios");

// !Working Get request for distances from Google - Done
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

  // todo  show all shipments
  app.get("/api/shipments", function (req, res) {
    var query = {};
    db.shipment.findAll({
      where: query
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });

  // todo  Search for shipments by city
  app.get("/api/shipments/:city", function (req, res) {
    var beginCity = req.params.city;
    db.shipment.findAll({
      where: {
        beginCity
      }
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });

  // todo  Search a shipment by id
  app.get("/api/shipments/id/:id", function (req, res) {
    var id = req.params.id;
    db.shipment.findOne({
      where: {
        id
      }
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });

  // !Working Create a new shipment
  app.post("/api/shipments", function (req, res) {
    // console.log("being sent:", req.body);
    db.shipment.create({
        begin: req.body.begin,
        end: req.body.end,
        beginCity: req.body.beginCity,
        item: req.body.item,
        details: req.body.details,
        price: req.body.price,
        miles: req.body.miles,
        available: true
      })
      .then(function (dbShipment) {
        console.log('Shipment added to database');
        console.log(dbShipment.dataValues);
        res.json(dbShipment);
      });
  });

  // todo Delete an Shipment by id
  app.delete("/api/shipments/:id", function (req, res) {
    db.shipment.destroy({
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
    db.shipment.update(req.body, {
        where: {
          id: req.body.id
        }
      })
      .then(function (dbShipment) {
        res.json(dbShipment);
      });
  });
};