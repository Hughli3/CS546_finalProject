const session = require("express-session")
const middleware = require("./middleware");
const dogRoutes = require("./dog");
const userRoutes = require("./user");
const accountRoutes = require("./account");

const constructorMethod = (app) => {
  
  app.use(session(middleware.sessionConfig));
  
  app.use("/dog", dogRoutes);
  app.use("/user", userRoutes);
  app.use(accountRoutes);

  app.get('/', async (req, res) => {
    data = {
      title: "Home",
      username : req.session.username
    };
    res.render('home', data);
  });
  
  app.use('*', function(req, res) {
    res.sendStatus(404);
    return;
  });
};

module.exports = constructorMethod;
