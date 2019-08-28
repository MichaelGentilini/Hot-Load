var db = require("../models");
var axios = require("axios");
var {
  Op
} = require("sequelize");

// @ Get - request for distances from Google
module.exports = function (app) {
  app.get("/api/distance/:from/:to", function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var key = process.env.GOOGLE_KEY;
    var url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&mode=driving&key=${key}`;
    axios.get(url).then(response => {
      res.json(response.data.rows[0].elements[0]);
    });
  });

  // @ Get - show all shipments
  app.get("/api/shipments", function (req, res) {
    var query = {};
    db.shipment
      .findAll({
        where: query,
        limit: 25,
      })
      .then(function (db) {
        res.json(db);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  // @Get - Search for shipments by city
  app.get("/api/shipments/:city", function (req, res) {
    var beginCity = req.params.city;
    db.shipment
      .findAll({
        where: {
          beginCity,
        },
      })
      .then(function (dbShipment) {
        res.json(dbShipment);
      });
  });

  // @ Get - Search for shipments by city including item
  app.get("/api/shipments/:city/:item", function (req, res) {
    var beginCity = req.params.city;
    var item = req.params.item;

    db.shipment
      .findAll({
        limit: 10,
        where: {
          beginCity,
          item,
        },
      })
      .then(function (db) {
        res.json(db);
      });
  });

  // @ Get - Search for shipments by city including item and distance
  app.get("/api/shipments/:city/:item/:distance", function (req, res) {
    var beginCity = req.params.city;
    var item = req.params.item;
    var miles = req.params.distance;

    db.shipment
      .findAll({
        where: {
          beginCity,
          item,
          miles: {
            [Op.gte]: miles
          },
        },
        order: [
          ["miles", "DESC"]
        ],
      })
      .then(function (dbShipment) {
        res.json(dbShipment);
      });
  });

  // @ Post - Create a new shipment
  app.post("/api/shipments", function (req, res) {
    db.shipment
      .create({
        begin: req.body.begin,
        end: req.body.end,
        beginCity: req.body.beginCity,
        item: req.body.item,
        details: req.body.details,
        price: req.body.price,
        miles: req.body.miles,
        available: true,
      })
      .then(function (dbShipment) {
        console.log("\nShipment added to database\n");
        res.json(dbShipment);
      });
  });

  // @ Delete a shipment by id
  app.delete("/api/shipments/:id", function (req, res) {
    db.shipment
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then(function (dbShipment) {
        console.log("\nShipment deleted\n");
        res.json(dbShipment);
      });
  });

  // todo for later dev --- Modify an existing shipment 
  app.put("/api/shipments:id", function (req, res) {
    db.shipment
      .update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      .then(function (dbShipment) {
        if (dbShipment) {
          console.log(dbShipment);
        } else {
          console.log("no data");
        }
        res.json(dbShipment);
      });
  });
};