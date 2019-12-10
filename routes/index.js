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
    let isLastPage = false;
    if (pageCount == page) isLastPage = true;

    data = {
      data : data.slice(page * showPerPage - showPerPage, page * showPerPage),
      totalPage: pageCount,
      currentPage: page,
      showPerPage: showPerPage,
      isLastPage: isLastPage
    }

    return data;
  }

  async function getCertainPageOfPhotos(photos, pageNum, showPerPage) {
    let pagedData = pagination(photos, pageNum, showPerPage);
    photos = [];
    for(let photoId of pagedData.data){
      photos.push({id: photoId,
                  photo: await imgData.getPhotoDataId(photoId)});
    }
    return {photos: photos, isLastPage: pagedData.isLastPage};
  }
  
  async function getFirstPageOfPhotos(photos) {
    let pagedData = pagination(photos, 1, 4);
    photos = [];
    for (let photoId of pagedData.data) {
      photos.push({ id : photoId,
                  photo : await imgData.getPhotoDataId(photoId)});
    }
    return {photos: photos, 
            isLastPage: pagedData.isLastPage}; 
  }

  async function login(req) {
    try {
      const compareResult = await usersData.comparePassword(req.body.username, req.body.password);
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

  app.post('/dog', loginRequired, async (req, res) => {
    try{
      let gender = req.body.gender;
      let type = req.body.type;
      let dob = req.body.dob;
      let name = req.body.name;
      let owner = req.session.userid;

      let dog = await dogData.addDog(name, gender, dob, type, owner);
      res.json({ status: "success", dog: dog });
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.get('/dog/:id', async (req, res) => {
    let dogId = req.params.id;

    try{
        let dog = await dogData.getDog(dogId);
        let photoPagedData = await getFirstPageOfPhotos(dog.photos);

        let comments = await commentData.getCommentsByDog(dogId);
        let commentPagedData = pagination(comments, 1, 3);

        data = {
          title: "Single Dog", 
          dog: dog,          
          photos: photoPagedData.photos,
          isPhotoLastPage: photoPagedData.isLastPage,
          comments : commentPagedData.data,
          isCommentLastPage: commentPagedData.isLastPage,
          username : req.session.username,
        }

        res.render('dogs/single_dog', data);
    } catch (e) {
        res.json({error: e});
    }
  });

  app.delete('/dog/:id', async (req, res) => {
    try{
      let dogId = req.params.id;
      await dogData.removeDog(dogId);
      res.json({ status: "success" });
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.put('/dog/:id', async (req, res) => {
    let dogId = req.params.id;
    let dog = req.body.dog;    
    try{
      dog = await dogData.updateDog(dogId, dog);
      res.json({ status: "success", dog: dog });
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.post('/dog/:id/avatar', upload.single('avatar'), async (req, res) => {
    let dogId = req.params.id;
    try {
      let dog = await dogData.updateAvatar(dogId, req.file);
      res.json({status: "success", avatar: dog.avatar});
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.post('/dog/:id/heightWeight', async (req, res) => {
    let dogId = req.params.id;
    let heightWeight = req.body.heightWeight;
    try {
      let dog = await dogData.addHeightWeight(dogId, heightWeight);
      res.json({status: "success", dog: dog});
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.get('/dog/:id/photos', async (req, res) => {
    try{
        let dogId = req.params.id;
        let dog = await dogData.getDog(dogId);
        let pagedData = await getCertainPageOfPhotos(dog.photos, req.query.page, 4);

        res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.json({status: "error", errorMessage: e});
    }
  });

  app.post("/dog/:id/photos", upload.single('photo'), async (req, res) => {
    try{
      let dogId = req.params.id;
      let dog = await dogData.addPhotos(dogId, req.file);
      let pagedData = await getFirstPageOfPhotos(dog.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch(e) {
      res.json({status: "error", errorMessage: e});
    }
  });

  app.get('/dog/:id/comments', async (req, res) => {
    try{
        let dogId = req.params.id;
        let page = req.query.page;
        let comments = await commentData.getCommentsByDog(dogId);
        let pagedData = pagination(comments, page, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.json({status: "error", errorMessage: e});
    }
  });

  app.post('/dog/:id/comments', loginRequired, async (req, res) => {
    try{
        let dogId = req.params.id;
        let content = req.body.content;
        let comments = await commentData.addComment(content, req.session.userid, dogId);
        let pagedData = pagination(comments, 1, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.json({status: "error", errorMessage: e});
    }
  });

  // ===== Image =====
  app.delete('/dog/:dogid/photo/:photoid', async (req, res) => {
    try{
      let dogId = req.params.dogid;
      let photoId = req.params.photoid;
      let dog = await dogData.removePhoto(dogId, photoId);
      let pagedData = await getFirstPageOfPhotos(dog.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });
  // ===== Account =====
  app.get('/profile', loginRequired, async (req, res) => {
    try {
      let user = await usersData.getUser(req.session.userid);
      data = {
        title: "Profile",
        username : req.session.username,
        user
      }
      res.render('profile', data);
    } catch (e) {
      res.render('profile', {error: e});
    }
  });

  app.get('/signup', notLoginRequired, async (req, res) => {
    res.render('signup', {title: "Signup"});
  });

  app.post('/signup', async (req, res) => {
    await usersData.addUser(req.body.username, req.body.password);
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

  // update Photo Example
  app.get('/update', async (req, res) => {    
    res.render('updatePhoto', {title: "update photo"});
  });

  app.post('/user/:id/avatar', upload.single('avatar'), async (req, res) => {
    let userId = req.params.id;
    try {
      let user = await usersData.updateAvatar(userId, req.file);
      res.json({status: "success", avatar: user.avatar});
    } catch (e) {
      res.json({status: "error", errorMessage: e});
    }
  });
  
  app.use('*', function(req, res) {
    res.sendStatus(404);
    return;
  });
};


module.exports = constructorMethod;
