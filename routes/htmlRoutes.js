module.exports = function(app) {
  // Load index page

  app.get("/", function(req, res, next) {
    res.render("index");
  });

  app.get("/login", function(req, res, next) {
    res.render("login");
  });

  app.get("/register", function(req, res, next) {
    res.render("register");
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
