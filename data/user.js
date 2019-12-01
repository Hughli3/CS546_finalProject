//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
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
    if (!name) throw "Your input name is not exist.";
    isString(username);
    isString(password);
    isString(name);
   
    
    const usersCollection = await users();
    const bcryptjsPassword = await bcryptjs.hash(password, saltRounds);
    // TODO change it to bcryptjs
    let newUser = {
        username: username.toLowerCase(),
        // username should be lower case
        password: bcryptjsPassword,
        name:name,
        avatarId:avatarId,
        dogs:[]
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
        let dogdeletionInfo = await dogsCollection.removeOne({ _id: postParsedId});
        if (dogdeletionInfo.deletedCount === 0) {
          throw `Could not delete dog with id of ${dogdeletionInfo.id}`;
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

async function comparepassword(id, password){
  if (!id) throw "Your input id is not exist.";
  if (!password) throw "Your input password is not exist.";

  const parsedId = ObjectId.createFromHexString(id);
  const usersCollection = await users();

  let userInfo = usersCollection.findOne({_id:parsedId});
 
  comparePassword = await bcrypt.compare(password, userInfo.password);

  return comparepassword
}

module.exports = {
    createANewUser,
    updateTheUser,
    deleteTheUser,
    changePassword,
    getUser,
    updateProfilephoto,
    comparepassword
  }
  