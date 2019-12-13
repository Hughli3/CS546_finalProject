const session = require("express-session")
const middleware = require("./middleware");
const dogRoutes = require("./dog");
const dogData = require("../data/dogs");
const userRoutes = require("./user");
const accountRoutes = require("./account");

const constructorMethod = (app) => {
  
  app.use(session(middleware.sessionConfig));
  
  app.use("/dog", dogRoutes);
  app.use("/user", userRoutes);
  app.use(accountRoutes);

  app.get('/', async (req, res) => {
    try {
      let popularDogs = await dogData.getPopularDogs();
      data = {
        title: "Home",
        username : req.session.username,
        popularDogs: popularDogs
      };
      res.render('home', data);
    } catch (e) {
      console.log(e);
    }
  });
  
  app.use('*', function(req, res) {
    res.status(404)
    res.render('404', {title: "Not Found", username : req.session.username});
  });
};

module.exports = constructorMethod;
