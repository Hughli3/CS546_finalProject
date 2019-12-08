//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
const ObjectId = require('mongodb').ObjectID;
const imgData = require("../data/img");
const dogData = require("../data/dogs");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const saltRounds = 5;
//========================================
// Check input
function validateId(id){
  if (!id) throw "id is undefinded";
  if (id.constructor !== String) throw "id is not a string";
  if (!ObjectId.isValid(id)) throw "id is invalid";
}

function validateUsername(username){
  if (!username) throw "username is undefinded";
  if (username.constructor !== String) throw "username is not of the proper type";
  if (username.length < 4 ) throw "username too short";
}

function validatePassword(password){
  if (!password) throw "password is undefinded";
  if (password.constructor !== String) throw "password is not of the proper type";
  if (password.length < 6 ) throw "usernapasswordme too short";
}

function validateImage(image) {
  if(!image) throw "image is undefinded";
  if(image.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(image.path);
    throw "file is not in proper type image";
  }  
}
//========================================
async function addUser(username, password){
  validateUsername(username);
  validatePassword(password);

  const usersCollection = await users();
  username = username.toLowerCase();
  const findUser = await usersCollection.findOne({ username: username });
  if (findUser) throw "username already exists";

  const bcryptjsPassword = await bcryptjs.hash(password, saltRounds);
  let user = {
      username: username.toLowerCase(),
      password: bcryptjsPassword,
      avatar: null,
      dogs: []}

  const insertInfo = await usersCollection.insertOne(user);
  if (insertInfo.insertedCount === 0) throw "Could not create a new user";
  
  return getUser(insertInfo.insertedId.toString());
}


async function getUser(id){
  validateId(id);

  const usersCollection = await users();
  const parsedId = ObjectId.createFromHexString(id);
  const userInfo = await usersCollection.findOne({ _id: parsedId });
  if (userInfo == null) throw "Could not find user successfully";

  let dogslist = [];
  for (let dog of userInfo.dogs) {
    dogslist.push(await dogData.getDog(dog));
  }
  userInfo.dogs = dogslist;

  if (userInfo.avatar) {
    let avatar = await imgData.getPhotoDataId(userInfo.avatar);
    userInfo.avatar = avatar;
  }
  
  return userInfo;
}

async function changePassword(id, newPassword){
  validateId(id);
  validatePassword(passnewPasswordword);
  
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

async function updateAvatar(id, file){
  validateId(id);
  validateImage(file);

  let photoId = await imgData.createGridFS(file);
  fs.unlinkSync(file.path);
   
  const usersCollection = await users();
  const parsedId = ObjectId.createFromHexString(id);
  const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: {avatar: photoId.toString()}});
  if (updateInfo.modifiedCount === 0) throw "Could not update user avatar successfully";

  return await getUser(id);
}

async function comparePassword(username, password) {
  validateUsername(username);
  validatePassword(password);

  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({username:username});
  if (!userInfo) throw 'invalid username/password';

  const isCorrect = await bcryptjs.compare(password, userInfo.password);
  if (!isCorrect) throw 'invalid username/password';

  return {userid: userInfo._id, username: userInfo.username};
}

// async function removeUser(id){
//     validateId(id);

//     const usersCollection = await users();
//     const parsedId = ObjectId.createFromHexString(id);
//     const removedData = await usersCollection.findOne({ _id: parsedId });
//     if (!removedData) throw "This user is not found.";

//     const deletionInfo = await usersCollection.removeOne({ _id: parsedId });
//     if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${id}`;
  
//     const dogsCollection = await dogs();
//     let dogDeletionInfo = await dogsCollection.remove({ owner: id});
//     if (dogDeletionInfo.deletedCount === 0) throw `Could not delete dog with owner id of ${id}`;

//     const commmentsCollection = await commments();
//     let commmentDeletionInfo = await commmentsCollection.remove({ author: id});
//     if (commmentDeletionInfo.deletedCount === 0) throw `Could not delete comment with author id of ${id}`;
    
//     //TODO delete user avatar, dog avatar, dog photo
//     return removedData;
// }

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
module.exports = {
    addUser,
    getUser,
    updateAvatar,
    changePassword,
    comparePassword,
    // removeUser,
    // updateTheUser,
    // getAllDogs
  }
  