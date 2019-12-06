const dogData = require("../data/dogs");
const usersData = require("../data/user");
const imgData = require("../data/img");
const commentData = require("../data/comments");
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

  app.get('/dog', async (req, res) => {
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

  function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  app.get('/dog/:id', async (req, res) => {
    let dogId = req.params.id;

    try{
        let dog = await dogData.getDog(dogId);
        
        let comments = [];
        for (let comment of dog.comments) {
          comments.push(await commentData.getComments(comment));
        }

        for (let comment of comments) {
          comment.author = await usersData.getUser(comment.author);
        }
        
        dog.currentWeight = dog.heightWeight[0].weight;
        dog.currentHeight = dog.heightWeight[0].height;
        dog.currentBMI = dog.currentWeight / dog.currentHeight;
        dog.age = calculateAge(dog.dateOfBirth);

        data = {
          title: "Single Dog", 
          dog: dog,
          username : req.session.username,
          comments : comments
        }

        res.render('dogs/single_dog', data);
    } catch (e) {
        res.json(e);
        return;
    }
  });

  app.delete('/dog/:id', async (req, res) => {
    let dogId = req.params.id;

    try{
        await dogData.deleteTheDog(dogId);
        res.redirect('/profile');
    } catch (e) {
        res.json(e);
        return;
    }
  });

  // ===== Account =====
  app.get('/profile', loginRequired, async (req, res) => {
    let user = await usersData.getUser(req.session.userid);
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
    let name = req.body.name;
    let gender = req.body.gender;
    let dataOfBirth = req.body.dataOfBirth;
    let height = req.body.height;
    let weight = req.body.weight;
    let dateOfHeightWeight = req.body.date;
    let type = req.body.type;
    let avatarId = null;

    let dog = await dogData.createADog(name, gender, dataOfBirth,[{
        height:height,
        weight:weight,
        date:dateOfHeightWeight
      }],type,avatarId
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
    
    // let photoId = await imgData.createGridFS(req.file);
    // This line no need, moved into user.js updateProfilePhoto method
    await usersData.updateProfilePhoto(req.session.userid, req.file);
    fs.unlinkSync(req.file.path);

    res.redirect('/profile');
  });
  
  app.use('*', function(req, res) {
    res.sendStatus(404);
    return;
  });
};


module.exports = constructorMethod;
