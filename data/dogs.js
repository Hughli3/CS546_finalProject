//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const { ObjectId } = require("mongodb");

//========================================
// Check input
function checkaString (name){
    if (!name || name === undefined || name === '' || name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}

function checkNumber(number){
  if (number.constructor != Number || number === NaN){
    throw `${number || "Provided number"} is not a number.`
  }
}

//========================================

async function createADog(name, gender, dataOfBirth, height, weight, type, avatarId){
if (name) throw `Your input name is not exist`;
if (gender) throw `Your input name is not exist`;
if (dataOfBirth) throw `Your input name is not exist`;
if (height) throw `Your input name is not exist`;
if (weight) throw `Your input name is not exist`;
if (type) throw `Your input name is not exist`;
if (avatarId) throw `Your input name is not exist`;
checkaString (name);
checkaString (gender);
checkaString (type);
checkaString (imageId);
checkNumber(height);
checkNumber(weight);


const dogsCollection = await dogs();

let newDog = {
  dogName: name,
  gender: gender,
  dataOfBirth:dataOfBirth, 
  height: height, 
  weight: weight, 
  type:type, 
  avatarId: avatarId,
  photos:[],
  comments:[]
}
const insertInfo = await dogsCollection.insertOne(newDog);
    if (insertInfo.insertedCount === 0) throw "Could not create a new user";
    else return getDog(id)

}

async function updateTheDog(id, newDogData){
  if (!id) throw "Your input id is not exist.";
  checkaString(id);

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
  checkaString(id);
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


async function getAllDogs(){

}


async function getDog(id){
  if (!id || id === undefined || id === '' ){
    throw `${id || "Provided string"} is not vaild.`;
  }

  id = ObjectId.createFromHexString(id);
  const dogsCollection = await dogs();

  const dog = await dogsCollection.findOne({_id: id});
  if (dog == null) thorw `Could not find dog with the id of ${id}`;

  return dog
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