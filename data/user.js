//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
const commments = mongoCollections.comments;
const { ObjectId } = require("mongodb");
const bcryptjs = require("bcryptjs");
const saltRounds = 5;
//========================================
// Check input
function isString (name){
    if (name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}
//========================================
async function createANewUser(username, password, name, avatarId){
    if (!username) throw "Your input username is not exist.";
    if (!password) throw "Your input password is not exist.";
    // if (!name) throw "Your input name is not exist.";
    isString(username);
    isString(password);
    // isString(name);
   
    
    const usersCollection = await users();
    const bcryptjsPassword = await bcryptjs.hash(password, saltRounds);
    // TODO change it to bcryptjs
    let newUser = {
        username: username.toLowerCase(),
        // username should be lower case
        password: bcryptjsPassword,
        name:name,
        avatarId:avatarId,
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
  
    return await this.get(ObjectId(newId).toString());
}

async function deleteTheUser(id){
    if (!id) throw "Your input id is not exist.";
    isString(id);
    const parsedId = ObjectId.createFromHexString(id);

    const usersCollection = await users();


    const removedData = await usersCollection.findOne({ _id: parsedId });
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
    isString(id);
    isString(newPassword);
    const parsedId = ObjectId.createFromHexString(id);
    const newbcryptjsPassword = await bcryptjs.hash(newPassword, saltRounds);
    const usersCollection = await users();

    const updateUserPassword = {
        password: newbcryptjsPassword
      };
     
    const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUserPassword});

    if (updateInfo.modifiedCount === 0) {
        throw "Could not update user password successfully";
      }
  
    return await getUser(id);
}

async function getUser(id){
  if (!id) throw "Your input id is not exist.";
  isString(id);
  const parsedId = ObjectId.createFromHexString(id);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({ _id: parsedId });
  if (userInfo == null) {
        throw "Could not find user successfully";
  }
  return userInfo
}

async function updateProfilephoto(id, avatarId){
  if (!id) throw "Your input id is not exist.";
  if (!avatarId) throw "Your input photo is not exist.";
  isString(id);
  isString(avatarId);
  const parsedId = ObjectId.createFromHexString(id);

  const usersCollection = await users();

  const updateUserPhoto = {
    avatarId: avatarId
    };
   
  const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUserPhoto});

  if (updateInfo.modifiedCount === 0) {
      throw "Could not update user password successfully";
    }

  return await getUser(id);
}

async function comparepassword(username, password) {
  if (!username) throw "Your input id is not exist.";
  if (!password) throw "Your input password is not exist.";

  // const parsedId = ObjectId.createFromHexString(id);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({username:username});
  if (!userInfo) throw 'invalid username/password';
  const isCorrect = await bcryptjs.compare(password, userInfo.password);
  if (!isCorrect) throw 'invalid username/password';
  return {isCorect: isCorrect, userid: userInfo._id, username: userInfo.username};
}

async function getAllDogs(userId){
  // return all dogs of this user 
  if (!userId) throw "Your input id is not exist.";
  isString(userId);
  const parsedUserId = ObjectId.createFromHexString(userId);
  const usersCollection = await users();
  let userInfo = usersCollection.findOne({_id:parsedUserId});
  if (userInfo == null ) throw "Could not find user successfully";

  const dogsCollection = await dogs();

  allDogs = [];
  for (let i = 0; i < userInfo.dogs.length; i++){
    let dogId = userInfo.dogs
    let parsedDogId = ObjectId.createFromHexString(dogId);
    let dogInfo = dogsCollection.findOne({_id:parsedDogId});
    if (dogInfo == null ) throw "Could not find dog successfully";
    allDogs.push(dogInfo);

  }
  return allDogs;
  
}
module.exports = {
    createANewUser,
    updateTheUser,
    deleteTheUser,
    changePassword,
    getUser,
    updateProfilephoto,
    comparepassword,
    getAllDogs
  }
  