const dogData = require("../data/dogs");
const usersData = require("../data/user");
const imgData = require("../data/img");
const fs = require("fs");

const constructorMethod = (app) => {
  app.get('/', async (req, res) => {
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

  app.post('/login', async (req, res) => {

    try {
      let username = req.body.username.toLowerCase();
      let password = req.body.password;

      let authentication = false;
      let ifIsUser = false;

      for (let i = 0; i < usersData.length; i++){
        if (usersData[i]["username"] == username){
          ifIsUser = true;
          index = i;
          break
        }
      }

      if(ifIsUser === false){

        req.session.ifFirst = false;
        res.status(401).render("layout/login", {
          title: "Login page",
          ifLoginFailed: true
          //TODO
          // This mean user login failed
        });
        // use return to stop the code
      }

      authentication = await bcrypt.compare(id,password);
      if (authentication === true){
        req.session.user = usersData._id;
        res.redirect("/");
      }else{

        req.session.ifFirst = false;
        res.redirect("/login");
      }
        // res.status(200)
    } catch (e) {
      res.status(404).json({error: e});
    }
  });

  app.get('/signup', async (req, res) => {
    res.render('signup', {title: "Signup"});
  });

  app.get('/profile', async (req, res) => {
    res.render('profile', {title: "Profile"});
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
  app.post("/update", check.single('avatar'), async (req, res) => {  
    console.log(req.file);
    
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
  
  app.use("*", (req, res) => {
    res.redirect("/");

  });
};


module.exports = constructorMethod;
