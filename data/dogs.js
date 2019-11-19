const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const ObjectId = require('mongodb').ObjectID;

async function createADog(name, gender, dateOfBirth, heightWeight, type, avatarId){
  if (!name) throw "name is undefinded";
  if (typeof name != "string") throw "name is not a string";

  if (!gender) throw "gender is undefinded";
  if (typeof gender != "string") throw "gender is not a string";

  if (!dateOfBirth) throw "dateOfBirth is undefinded";  
  dateOfBirth = Date.parse(dateOfBirth);
  if (isNaN(dateOfBirth)) throw "dateOfBirth is invalid";
  dateOfBirth = new Date(dateOfBirth);

  isValidHeightWeight(heightWeight);

  if (!type) throw "type is undefinded";
  if (typeof type != "string") throw "type is not a string";

  // if (!avatarId) throw "avatar is undefinded";
  // if (!ObjectId.isValid(avatarId)) throw "avatarId is invalid";
  // if (typeof avatarId != "string") avatarId = avatarId.toString();

  const dogsCollection = await dogs();
  let dog = {
    dogName: name,
    gender: gender,
    dateOfBirth: dateOfBirth,
    heightWeight: heightWeight,
    type: type, 
    avatarId: avatarId,
    photos: [],
    comments: []
  }

  const insertInfo = await dogsCollection.insertOne(dog);
  if (insertInfo.insertedCount === 0) throw "Could not create a new user";
  const newId = insertInfo.insertedId;
  return await getDog(newId);
}

async function getAllDogs(){
  const dogsCollection = await dogs();
  const allDogs = dogsCollection.find().toArray();
  if (!allDogs) throw 'no dog found';

  return allDogs;
}

async function getDog(id){
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
  isValidString(id);

  const dogsCollection = await dogs();
  let updateDog = {}

  if (!dogName){
    updateDog.dogName = newDogData.dogName;
  }

  if (!gender){
    updateDog.gender = newDogData.gender;
  }

  if (!dataOfBirth){
    updateDog.height = newDogData.height;
  }

  if (!weight){
    updateDog.weight = newDogData.weight;
  }

  if (!type){
    updateDog.type = newDogData.type;
  }

  parsedId = ObjectId.createFromHexString(id);

  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$set: updateDog});
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the dog successfully";
  }
  return await this.getDog(ObjectId(id).toString());
}


async function deleteTheDog(){
  if (!id) throw "Your input id is not exist.";
  isValidString(id);
  parsedId = ObjectId.createFromHexString(id);
  if (!id) throw "Your input id is not exist.";
  const dogsCollection = await dogs();
  const removedData = await dogsCollection.findOne({ _id: parsedId });
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

module.exports = {
  createADog,
  updateTheDog,
  deleteTheDog,
  updateProfilePhotoOfTheDog,
  getAllDogs,
  getDog,
  addPhotos
}

function isValidHeightWeight (heightWeight) {
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