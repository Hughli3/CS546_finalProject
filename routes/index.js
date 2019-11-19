const constructorMethod = (app) => {
  app.get('', async (req, res) => {
    res.render('home', {title: "Home"});
  });

  app.get('/dogs', async (req, res) => {
    res.render('dogs/dogs', {title: "All Dogs"});
  });

  app.get('/login', async (req, res) => {
    res.render('login', {title: "Login"});
  });

  app.get('/signup', async (req, res) => {
    res.render('signup', {title: "Signup"});
  });

  app.get('/profile', async (req, res) => {
    res.render('profile', {title: "Profile"});
  });

  app.get('/dog/:id', async (req, res) => {
    res.render('dogs/single_dog', {title: "Single Dog"});
  });

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};


module.exports = constructorMethod;