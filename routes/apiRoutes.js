var db = require("../models");
var axios = require("axios");

module.exports = function (app) {
  // Get all examples
  app.get("/api/distance/:from/:to", function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var key = "AIzaSyB2W892gFksiHUVpB-RmF0vPmV0ExdiOJM";
    var url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&mode=driving&key=${key}`
    axios.get(url).then(response => {
      res.json(response.data.rows[0].elements[0]);
    });
  });

  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};