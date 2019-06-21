var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.shipment.findAll({}).then(function (dbShipments) {
      res.render("index", {
        msg: "Welcome!",
        shipments: dbShipments
      });
    });
  });

  // Load Shipment page and pass in an Shipment by id
  app.get("/shipment/:id", function (req, res) {
    db.Shipment.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (
      dbShipment
    ) {
      res.render("shipment", {
        shipment: dbShipment
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};