const mainRoutes = require("./main");

const constructorMethod = app => {
  app.use("/", mainRoutes);
};

module.exports = constructorMethod;