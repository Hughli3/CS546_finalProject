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

async function updateTheDog(){

}


async function deleteTheDog(){

}


async function updateProfilePhotoOfTheDog(){

}


async function getAllDogs(){

}


async function getDog(){

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