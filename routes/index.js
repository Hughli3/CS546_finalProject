const dogData = require("../data/dogs");

const constructorMethod = (app) => {
  app.get('', async (req, res) => {
    res.render('home', {title: "Home"});
  });

  app.get('/dogs', async (req, res) => {
    try{
      let dogs = await dogData.getAllDogs();
      res.render('dogs/dogs', {title: "All Dogs", dogs: dogs});
    } catch (e) {
        res.json(e);
        return;
    }
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

  app.get('/dog/add', async (req, res) => {
    res.render('dogs/add_dog', {title: "Add a Dog"});
  });
  
  app.get('/dog/:id', async (req, res) => {
    let dogId = req.params.id;

    try{
        let dog = await dogData.getDog(dogId);
        res.render('dogs/single_dog', {title: "Single Dog", dog: dog});
    } catch (e) {
        res.json(e);
        return;
    }

  });



  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};


module.exports = constructorMethod;