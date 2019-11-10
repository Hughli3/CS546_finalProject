//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

//========================================
// Check input
function checkaString (name){
    if (!name || name === undefined || name === '' || name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}
//========================================
async function createANewUser(username, password, name, avatarId){
    if (!username) throw "Your input username is not exist.";
    if (!password) throw "Your input password is not exist.";
    if (!name) throw "Your input name is not exist.";
    checkaString(username);
    checkaString(password);
    checkaString(name);

    const usersCollection = await users();
    const Md5password =  md5(password);
    let newUser = {
        username: username,
        password: Md5password,
        name:name,
        avatarId:avatarId,
        dogs:[]
    }

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not create a new user";
    else return get(id)
    // const newId = insertInfo.insertedId;

    // const theNewUser =  await this.get(ObjectId(newId).toString());
    // return theNewUser;
    
}

async function updateTheUser(id, newName){
    if (!id) throw "Your input id is not exist.";
    if (!newName) throw "Your input name is not exist.";
    checkaString(id);
    checkaString(newName);
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
    checkaString(id);
    const parsedId = ObjectId.createFromHexString(id);

    const usersCollection = await users();


     
    const deletionInfo = await usersCollection.removeOne({ _id: parsedId });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
      }
  

    // TODO remove dogId and avatarId
    return await get(id);
}

async function changePassword(id, newPassword){
    if (!id) throw "Your input id is not exist.";
    if (!newPassword) throw "Your input password is not exist.";
    checkaString(id);
    checkaString(newPassword);
    const parsedId = ObjectId.createFromHexString(id);

    const usersCollection = await users();

    const updateUserPassword = {
        password: newPassword
      };
     
    const updateInfo = await usersCollection.updateOne({ _id: parsedId }, { $set: updateUserPassword});

    if (updateInfo.modifiedCount === 0) {
        throw "Could not update user password successfully";
      }
  
    return await getUser(id);
}

async function getUser(id){
  if (!id) throw "Your input id is not exist.";
  checkaString(id);
  const parsedId = ObjectId.createFromHexString(id);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({ _id: parsedId });
  if (userInfo == null) {+1
        throw "Could not find user successfully";
  }
  return userInfo
}

async function updateProfilephoto(id, avatarId){
  if (!id) throw "Your input id is not exist.";
  if (!avatarId) throw "Your input photo is not exist.";
  checkaString(id);
  checkaString(avatarId);
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

module.exports = {
    createANewUser,
    updateTheUser,
    deleteTheUser,
    changePassword,
    getUser,
    updateProfilephoto
  }
  