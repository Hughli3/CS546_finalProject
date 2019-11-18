const userRoutes = require('./users');
const dogRoutes = require('./dogs');

const constructorMethod = (app) => {
  app.use('/user', userRoutes);
  app.use('/dog', dogRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;