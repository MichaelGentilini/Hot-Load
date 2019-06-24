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
      where: query,
      limit: 10

    }).then(function (db) {

      res.json(db);

    }).catch(function (err) {
      console.log(err);
    });
  });

  // @working  Search for shipments by city
  app.get("/api/shipments/:city", function (req, res) {
    var beginCity = req.params.city;
    db.shipment.findAll({
      where: {
        beginCity,
      },

      // limit: 2
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });

  // @ Search for shipments by city including item
  app.get("/api/shipments/:city/:item", function (req, res) {
    var beginCity = req.params.city;
    var item = req.params.item;

    db.shipment.findAll({
      limit: 10,
      where: {
        beginCity,
        item
      }
    }).then(function (db) {
      res.json(db);
    });
  });

  // @ Search for shipments by city including item
  app.get("/api/shipments/:city/:item/:distance", function (req, res) {
    var beginCity = req.params.city;
    var item = req.params.item;
    var miles = req.params.distance

    db.shipment.findAll({
      limit: 5,
      where: {
        beginCity,
        item,
        miles


      }
    }).then(function (dbShipment) {
      res.json(dbShipment);
    });
  });


  // @ Create a new shipment
  app.post("/api/shipments", function (req, res) {

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

  // @ this works in Postman ---  Delete a shipment by id
  app.delete("/api/shipments/:id", function (req, res) {
    db.shipment.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbShipment) {
      console.log('shipment deleted');
      res.json(dbShipment);
    });
  });

  // todo Modify an existing shipment - change to available = false
  app.put("/api/shipments:id", function (req, res) {
    console.log(req.body);
    db.shipment.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then(function (dbShipment) {
        if (dbShipment) {
          console.log(dbShipment)
        } else {
          console.log('no data')
        }
        res.json(dbShipment);
      });
  });
};