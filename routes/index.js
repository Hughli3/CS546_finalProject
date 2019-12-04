const dogData = require("../data/dogs");
const usersData = require("../data/user");
const imgData = require("../data/img");
const multer  = require('multer');
const session = require('express-session')
const upload = multer({dest:'./public/images'});
const fs = require("fs");

const constructorMethod = (app) => {

  app.use(session({
    name: 'AuthCookie',
    secret: 'cs548dogdog',
    resave: false,
    saveUninitialized: true
  }));
  
  app.get('/', async (req, res) => {
    data = {
      title: "Home",
      username : req.session.username
    };
    res.render('home', data);
  });

  app.get('/dogs', async (req, res) => {
    try{
      let dogs = await dogData.getAllDogs();
      data = {
        title: "All Dogs",
        dogs : dogs,
        username : req.session.username
      };
      res.render('dogs/dogs', data);
    } catch (e) {
        res.json(e);
        return;
    }
  });

  app.get('/login', async (req, res) => {
    res.render('login', {title: "Login"});
  });

  app.post('/login', async (req, res) => {
    try {
      await login(req);
      return res.redirect('/profile');
    } catch (e) {
      res.status(401).render('login', {title: "Login", error: "Invalid username and/or password"});
    }
  });

  const loginRequired = (req, res, next) => {
    if (!req.session.userid) {
      res.redirect('/login');
      return;
    }
    next();
  }

  app.get('/logout', loginRequired, function(req, res) {
    req.session.destroy();
    return res.redirect('/');
  });

  async function login(req) {
    try {
      const compareResult = await usersData.comparepassword(req.body.username, req.body.password);
      req.session.userid = compareResult.userid;
      req.session.username = compareResult.username;
    } catch (e) {
      throw e;
    }
  }

  app.get('/signup', async (req, res) => {
    res.render('signup', {title: "Signup"});
  });

  app.post('/signup', async (req, res) => {
    await usersData.createANewUser(req.body.username, req.body.password, null, null);
    res.redirect('/login');
  });

  

  app.get('/profile', loginRequired, async (req, res) => {
    data = {
      title: "Profile",
      username : req.session.username
    }
    res.render('profile', data);
  });

  app.get('/dog/add', async (req, res) => {

    let allDogs = dogData.getAllDogs();

    res.render('dogs/add_dog', {title: "All dogs",dog:allDogs});
    // TODO


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

  app.post('/dog/add', async (req, res) => {
    let name= req.body.name;
    let gender = req.body.gender;
    let dataOfBirth = req.body.dataOfBirth;
    let height = req.body.height;
    let weight = req.body.weight;
    let dateOfHeightWeight = req.body.date;
    let type = req.body.type;;
    let avatarId =  null;

    let dog = await dogData.createADog(name, gender, dataOfBirth,{
      height:height,
      weight:weight,
      date:dateOfHeightWeight
    },type,avatarId
    )

    res.render('dogs/add_dog', {title: "Add a Dog",dog:dog});

  });

  // update Photo Example
  app.get('/update', async (req, res) => {    
    res.render('updatePhoto', {title: "update photo"});
  });

  // update Photo Example
  app.post("/update", upload.single('avatar'), async (req, res) => {
    if(!req.file) {
        console.log('no file input');
        res.redirect('/update');
    } else if(req.file.mimetype.split("/")[0] != "image") {
        fs.unlinkSync(req.file.path)
        console.log("type error, image only");
        res.redirect('/update');
    } else {
      let photoId = await imgData.createGridFS(req.file)
      let getPhoto = await imgData.getPhotoDataId(photoId)

      
      fs.unlinkSync(req.file.path)

      res.render('updatePhoto', {title: "update photo", img:getPhoto})
    }
  });
  
  app.use('*', function(req, res) {
    res.sendStatus(404);
    return;
  });
};


module.exports = constructorMethod;
