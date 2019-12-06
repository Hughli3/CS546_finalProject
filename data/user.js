//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
const commments = mongoCollections.comments;
const { ObjectId } = require("mongodb");
const imgData = require("../data/img");
const dogData = require("../data/dogs");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const saltRounds = 5;
//========================================
// Check input
function isString (name){
  if (name.constructor == String){
      return true;
    }else return false;
}
//========================================
async function createANewUser(username, password ){
    if (!username) throw "Your input username is not exist.";
    if (!password) throw "Your input password is not exist.";
    // if (!name) throw "Your input name is not exist.";
   
    if (!isString(username)) throw `Your input username is not a string`;

    if (!isString(password)) throw `Your input password is not a string`;
    // isString(name);
   
    const usersCollection = await users();
    username = username.toLowerCase();
    const findUser = await usersCollection.findOne({ username: username });
    if (findUser) throw `this username already exist`;
    
    const bcryptjsPassword = await bcryptjs.hash(password, saltRounds);
    // TODO change it to bcryptjs
    let newUser = {
        username: username,
        // username should be lower case
        password: bcryptjsPassword,
  
        avatarId:null,
        dogs:[],
        commments:[]

    }

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not create a new user";
    else return getUser(insertInfo.insertedId.toString())
    // const newId = insertInfo.insertedId;

    // const theNewUser =  await this.get(ObjectId(newId).toString());
    // return theNewUser;
    
}

/*
// no name data field any more 
async function updateTheUser(id, newName){
    if (!id) throw "Your input id is not exist.";
    if (!newName) throw "Your input name is not exist.";
    isString(id);
    isString(newName);
    const parsedId = ObjectId.createFromHexString(id);

    const usersCollection = await users();

    const updateUser = {
        name: newName
      };
     
    const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUser});

    if (updateInfo.modifiedCount === 0) {
        throw "Could not update user successfully";
      }
  
    return await this.get(ObjectId(id).toString());
}
*/

async function deleteTheUser(id){
    if (!id) throw "Your input id is not exist.";
    if (!isString(id)) throw `Your input id is not a string`;

    const parsedId = ObjectId.createFromHexString(id);

    const usersCollection = await users();


    const removedData = await usersCollection.findOne({ _id: parsedId });
    if (!removedData) throw `This user is not found.`
    const deletionInfo = await usersCollection.removeOne({ _id: parsedId });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
      }
  
      const dogsCollection = await dogs();
      for (let j = 0; j < removedData.dogs.length; j++){
        dogsId = removedData.dogs[j]
        parsedDogId = ObjectId.createFromHexString(dogsId);
        let dogDeletionInfo = await dogsCollection.removeOne({ _id: postParsedId});
        if (dogDeletionInfo.deletedCount === 0) {
          throw `Could not delete dog with id of ${dogDeletionInfo.id}`;
        }
    }

    const commmentsCollection = await commments();
      for (let j = 0; j < removedData.commments.length; j++){
        commmentId = removedData.commments[j]
        commmentParsedId = ObjectId.createFromHexString(commmentId);
        let commmentDeletionInfo = await commmentsCollection.removeOne({ _id: commmentParsedId});
        if (commmentDeletionInfo.deletedCount === 0) {
          throw `Could not delete dog with id of ${commmentDeletionInfo.id}`;
        }
    }
    
    // TODO remove dogId and avatarId
    return await get(id);
    //// TODO this is wrong
}

async function changePassword(id, newPassword){
    if (!id) throw "Your input id is not exist.";
    if (!newPassword) throw "Your input password is not exist.";
    if (!isString(id)) throw `Your input id is not a string`;
    if (!isString(newPassword)) throw `Your input newPassword is not a string`;
    
    const parsedId = ObjectId.createFromHexString(id);
    const newbcryptjsPassword = await bcryptjs.hash(newPassword, saltRounds);
    const usersCollection = await users();

    const updateUserPassword = {
        password: newbcryptjsPassword
      };
    const originalData = await usersCollection.findOne({ _id: parsedId });
    if (originalData.password === newbcryptjsPassword){
      throw `You have to input a different password.`;
    }

    const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUserPassword});

    if (updateInfo.modifiedCount === 0) {
        throw "Could not update user password successfully";
      }
  
    return await getUser(id);
}

async function getUser(id){
  if (!id) throw "Your input id is not exist.";
  if (!isString(id)) throw `Your input id is not a string`;

  const parsedId = ObjectId.createFromHexString(id);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({ _id: parsedId });
  if (userInfo == null) {
      throw "Could not find user successfully";
  }
  let dogslist = [];
  for (let dog of userInfo.dogs) {
    dogslist.push(await dogData.getDog(dog));
  }
  userInfo.dogs = dogslist;

  if (userInfo.avatarId) {
    let getPhoto = await imgData.getPhotoDataId(userInfo.avatarId);
    userInfo.avatar = getPhoto;
  }
  
  return userInfo
}

async function updateProfilePhoto(id,  file){

  if (!id) throw "Your input id is not exist.";
 
   if (!isString(id)) throw `Your input id is not a string`;

  if(!file) {
    throw `no file input`;
  } else if(file.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(file.path);
    throw `type error, image only`;
  } 
  
  let photoId = await imgData.createGridFS(file);

  const parsedId = ObjectId.createFromHexString(id);

  const usersCollection = await users();

  const updateUserPhoto = {
    avatarId: photoId.toString()
  };
   
  const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUserPhoto});

  if (updateInfo.modifiedCount === 0) {
      throw "Could not update user avatar successfully";
  }

  return await getUser(id);
}

async function comparepassword(username, password) {
  if (!username) throw "Your input id is not exist.";
  if (!password) throw "Your input password is not exist.";

  if (!isString(username)) throw `Your input username is not a string`;
  if (!isString(password)) throw `Your input password is not a string`;

  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({username:username});
  if (!userInfo) throw 'invalid username/password';
  const isCorrect = await bcryptjs.compare(password, userInfo.password);
  if (!isCorrect) throw 'invalid username/password';
  return {isCorect: isCorrect, userid: userInfo._id, username: userInfo.username};
}

// async function getAllDogs(userId){
//   // return all dogs of this user 
//   if (!userId) throw "Your input id is not exist.";
//   isString(userId);
//   const parsedUserId = ObjectId.createFromHexString(userId);
//   const usersCollection = await users();
//   let userInfo = usersCollection.findOne({_id:parsedUserId});
//   if (userInfo == null ) throw "Could not find user successfully";

//   const dogsCollection = await dogs();

//   allDogs = [];
//   for (let i = 0; i < userInfo.dogs.length; i++){
//     let dogId = userInfo.dogs
//     let parsedDogId = ObjectId.createFromHexString(dogId);
//     let dogInfo = dogsCollection.findOne({_id:parsedDogId});
//     if (dogInfo == null ) throw "Could not find dog successfully";
//     allDogs.push(dogInfo);

//   }
//   return allDogs;
  
// }
module.exports = {
    createANewUser,
    // updateTheUser,
    deleteTheUser,
    changePassword,
    getUser,
    updateProfilePhoto,
    comparepassword,
    // getAllDogs
  }
  