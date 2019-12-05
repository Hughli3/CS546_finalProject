const dogData = require("../data/dogs");
const usersData = require("../data/user");
const imgData = require("../data/img");
const multer  = require('multer');
const session = require('express-session')
const upload = multer({dest:'./public/img/upload'});
const fs = require("fs");

const constructorMethod = (app) => {

  // ===== Middleware =====
  app.use(session({
    name: 'AuthCookie',
    secret: 'cs548dogdog',
    resave: false,
    saveUninitialized: true
  }));

  const loginRequired = (req, res, next) => {
    if (!req.session.userid) {
      res.redirect('/login');
      return;
    }
    next();
  }

  const notLoginRequired = (req, res, next) => {
    if (req.session.userid) {
      res.redirect('/profile');
      return;
    }
    next();
  }

  // ===== Helper =====
  function pagination(data, pageNum, showPerPage) {
    const pageCount = Math.ceil(data.length / showPerPage);
    let page = parseInt(pageNum);
    if (!page || page <= 0) { page = 1;}
    if (page > pageCount) {
      page = pageCount;
    }
    data = {
      data : data.slice(page * showPerPage - showPerPage, page * showPerPage),
      totalPage: pageCount,
      currentPage: page,
      showPerPage: showPerPage
    }
    return data;
  }

  async function login(req) {
    try {
      const compareResult = await usersData.comparepassword(req.body.username, req.body.password);
      req.session.userid = compareResult.userid;
      req.session.username = compareResult.username;
    } catch (e) {
      throw e;
    }
  }
  
  // ===== public pages =====
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
      let pageData = pagination(dogs, req.query.page, 12);

      data = {
        title: "All Dogs",
        dogs : pageData.data,
        totalPage: pageData.totalPage,
        currentPage: pageData.currentPage,
        username : req.session.username
      };
      res.render('dogs/dogs', data);
    } catch (e) {
        res.json(e);
        return;
    }
  });

  app.get('/dog/:id', async (req, res) => {
    let dogId = req.params.id;

    try{
        let dog = await dogData.getDog(dogId);
        data = {
          title: "Single Dog", 
          dog: dog,
          username : req.session.username
        }

        res.render('dogs/single_dog', data);
    } catch (e) {
        res.json(e);
        return;
    }
  });

  // ===== Account =====
  app.get('/profile', loginRequired, async (req, res) => {
    let user = await usersData.getUser(req.session.userid);
    if (user.avatarId) {
      let getPhoto = await imgData.getPhotoDataId(user.avatarId);
      user.avatar = getPhoto;
    }
    data = {
      title: "Profile",
      username : req.session.username,
      user
    }
    res.render('profile', data);
  });

  app.get('/signup', notLoginRequired, async (req, res) => {
    res.render('signup', {title: "Signup"});
  });

  app.post('/signup', async (req, res) => {
    await usersData.createANewUser(req.body.username, req.body.password, null, null);
    res.redirect('/login');
  });

  app.get('/logout', loginRequired, function(req, res) {
    req.session.destroy();
    return res.redirect('/');
  });

  app.get('/login', notLoginRequired, async (req, res) => {
    res.render('login', {title: "Login"});
  });

  app.post('/login', notLoginRequired, async (req, res) => {
    try {
      await login(req);
      return res.redirect('/profile');
    } catch (e) {
      res.status(401).render('login', {title: "Login", error: "Invalid username and/or password"});
    }
  });

  // ===== Dog modification =====
  app.get('/dog/add', async (req, res) => {
    let allDogs = dogData.getAllDogs();
    res.render('dogs/add_dog', {title: "All dogs",dog:allDogs});
  });

  app.post('/dog/add', async (req, res) => {
    let name= req.body.name;
    let gender = req.body.gender;
    let dataOfBirth = req.body.dataOfBirth;
    let height = req.body.height;
    let weight = req.body.weight;
    let dateOfHeightWeight = req.body.date;
    let type = req.body.type;
    let avatarId = null;

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
  app.post("/updateUserAvatar", loginRequired, upload.single('avatar'), async (req, res) => {
    if(!req.file) {
      res.render('updatePhoto', {error: "no file input"});
    } else if(req.file.mimetype.split("/")[0] != "image") {
      fs.unlinkSync(req.file.path);
      res.render('updatePhoto', {error: "type error, image only"});
    } 
    
    let photoId = await imgData.createGridFS(req.file);
    await usersData.updateProfilephoto(req.session.userid, photoId.toString());
    fs.unlinkSync(req.file.path);

    res.redirect('/profile');
  });
  
  app.use('*', function(req, res) {
    res.sendStatus(404);
    return;
  });
};


module.exports = constructorMethod;
