const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;



// ======================================================
function isValidHeightWeight (heightWeight) {
  // The heightWeight contains height, weight, date. The date is the scale date of height and weight.
  if (!heightWeight) throw "heightWeight is undefinded";

  for (let hw of heightWeight) {
    if (!hw.height) throw "height is undefinded";
    if (typeof hw.height != "number") throw "height is not of the proper type";
    if (hw.height < 0 ) throw "height is not a positive number";

    if (!hw.weight) throw "weight is undefinded";
    if (typeof hw.weight != "number") throw "weight is not of the proper type";
    if (hw.weight < 0 ) throw "weight is not a positive number";

    if (!hw.date) throw "date is undefinded";
    hw.date = Date.parse(hw.date);
    if (isNaN(hw.date)) throw "date is invalid";
    hw.date = new Date(hw.date);
  }
}

function isString (name){
  if (name.constructor !== String){
      throw `${name || "Provided string"} is not a string.`
    }
}

// ======================================================
async function createADog(name, gender, dateOfBirth, heightWeight, type, avatarId, owner){
  
  if (!name) throw "name is undefinded";
  if (typeof name != "string") throw "name is not a string";

  if (!gender) throw "gender is undefinded";
  if (typeof gender != "string") throw "gender is not a string";

  if (!dateOfBirth) throw "dateOfBirth is undefinded";  
  dateOfBirth = new Date(dateOfBirth).getTime()
  if (isNaN(dateOfBirth)) throw "dateOfBirth is invalid";
  dateOfBirth = new Date(dateOfBirth);
  console.log(dateOfBirth.toString());
  console.log(dateOfBirth);
  /*
Date.parse() 方法解析一个表示某个日期的字符串，并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数，
如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：2015-02-31），则返回值为NaN。
*/

  isValidHeightWeight(heightWeight);

  if (!type) throw "type is undefinded";
  if (typeof type != "string") throw "owner is not a string";

  if (!owner) throw "type is undefinded";
  if (typeof owner != "string") throw "owner is not a string";


  // if (!avatarId) throw "avatar is undefinded";
  // if (!ObjectId.isValid(avatarId)) throw "avatarId is invalid";
  // if (typeof avatarId != "string") avatarId = avatarId.toString();

  
  let dog = {
    dogName: name,
    gender: gender,
    dateOfBirth: dateOfBirth,
    heightWeight: heightWeight,
    type: type, 
    avatarId: avatarId,
    photos: [],
    comments: [],
    owner:owner

  }
  
  const usersCollection = await users();
  parsedOwner = ObjectId.createFromHexString(dog.owner);
  const user = await usersCollection.find({_id:parsedOwner});
  if (user == null) thorw `Could not find the user with the id of ${parsedOwner}`;

  // After check the user exist then create the dog
  const dogsCollection = await dogs();
  const insertInfo = await dogsCollection.insertOne(dog);
  if (insertInfo.insertedCount === 0) throw "Could not create a new use";
  const newId = insertInfo.insertedId;

  const updateInfo = await usersCollection.updateOne({ _id: parsedOwner }, {$addToSet: {dogs: ObjectId(newId).toString()}});
  if (updateInfo.modifiedCount === 0) throw "Could not add the dog to the user";

  return await getDog(newId);
}

async function getAllDogs(){
  const dogsCollection = await dogs();
  const allDogs = dogsCollection.find().toArray();
  if (!allDogs) throw 'no dog found';

  return allDogs;
}

async function getDog(id){
  // TODO Get the dog owner name
  if (!id) throw "id is undefinded";
  if (!ObjectId.isValid(id)) throw "id is invalid";
  if (typeof id != "string") id = id.toString();
  id = ObjectId.createFromHexString(id);

  const dogsCollection = await dogs();
  const dog = await dogsCollection.findOne({_id: id});
  if (!dog) throw 'dog not found';

  return dog
}

async function updateTheDog(id, newDogData){
  if (!id) throw "Your input id is not exist.";
  isString(id);

  const dogsCollection = await dogs();
  let updateDog = {}

  if (newDogData.dogName){
    updateDog.dogName = newDogData.dogName;
  }

  if (newDogData.gender){
    updateDog.gender = newDogData.gender;
  }

  if (newDogData.dateOfBirth){
    updateDog.height = newDogData.height;
  }

  // if (newDogData.heightWeight){
  //   updateDog.heightWeight = newDogData.heightWeight;
  // }
  // isValidHeightWeight(newDogData.heightWeight);
  if (newDogData.type){
    updateDog.type = newDogData.type;
  }

  parsedId = ObjectId.createFromHexString(id);

  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$set: updateDog});
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the dog successfully";
  }
  return await this.getDog(id);
}


async function deleteTheDog(id){
  if (!id) throw "Your input id is not exist.";
  isString(id);
  parsedId = ObjectId.createFromHexString(id);
  if (!id) throw "Your input id is not exist.";
  const dogsCollection = await dogs();
  const removedData = await dogsCollection.findOne({ _id: parsedId });

  const usersCollection = await users();
  const deleteDogInUserList = usersCollection.removeOne({_id:removedData.owner});
  if (deleteDogInUserList == null){
    throw `Could not delete the dog in the user dog ${id} list`;
  }

  const deletionInfo = await dogsCollection.removeOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete dog with id of ${id}`;
  }

  return removedData
}


async function updateProfilePhotoOfTheDog(){

}

async function addPhotos(){

}

async function updateHeightWeightOfDog(id, newHeightWeight){
  if (!id) throw "Your input id is not exist.";
  isString(id);
  // if (!newHeightWeight) throw "Your input is not exist.";
  const dogsCollection = await dogs();
  // if (!newHeightWeight.height) throw "height is undefinded";
  //   if (typeof newHeightWeight.height != "number") throw "height is not of the proper type";
  //   if (newHeightWeight.height < 0 ) throw "height is not a positive number";

  //   if (!newHeightWeight.weight) throw "weight is undefinded";
  //   if (typeof newHeightWeight.weight != "number") throw "weight is not of the proper type";
  //   if (newHeightWeight.weight < 0 ) throw "weight is not a positive number";

  //   if (!newHeightWeight.date) throw "date is undefinded";
  //   newHeightWeight.date = new Date(newHeightWeight.date).getTime()
  //   if (isNaN(newHeightWeight.date)) throw "date is invalid";
  //   newHeightWeight.date = new Date(newHeightWeight.date);

  parsedId = ObjectId.createFromHexString(id);

  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$addToSet: {heightWeight: newHeightWeight}});
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the dog successfully";
  }
  return await this.getDog(id);
}

module.exports = {
  createADog,
  updateTheDog,
  deleteTheDog,
  updateProfilePhotoOfTheDog,
  getAllDogs,
  getDog,
  addPhotos,
  updateHeightWeightOfDog
}

