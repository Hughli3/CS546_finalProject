const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const users = mongoCollections.users;
const comments = mongoCollections.comments;
const imgData = require("./img");
// const commentData = require("./comments");
const breedData = require("./breed");
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs');

// ======================================================
// check input
function validateHeightWeight (hw) {
  if (!hw) throw "heightWeight is undefinded";
  validateHeight(hw.height);
  validateWeight(hw.weight);
}


function validateWeight(weight){
  if (!weight) throw "weight is undefinded";
  if (typeof weight != "number") throw "weight is not of the proper type";
  if (weight <= 0 ) throw "weight is not a positive number";
}


function validateHeight(height){
  if (!height) throw "height is undefinded";
  if (typeof height != "number") throw "height is not of the proper type";
  if (height <= 0 ) throw "height is not a positive number";
}


function validateId(id){
  if (!id) throw "id is undefinded";
  if (id.constructor !== String) throw "id is not a string";
  if (!ObjectId.isValid(id)) throw "id is invalid";
}


function validateName(name){
  if (!name) throw "name is undefinded";
  if (name.constructor !== String) throw "name is not a string";
  if (name.length > 30) throw "name is too long";
}


function validateGender(gender){
  if (!gender) throw "gender is undefinded";
  if (gender.constructor !== String) throw "gender is not a string";
  const genderType = new Set();
 ["male", "female","other"].forEach(x => genderType.add(x));
  if (!genderType.has(gender.toLowerCase())){
    throw "Gender should be male, female or other";
  }
}


function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}


function validateType(type){
  if (!type) throw "type is undefinded";
  if (type.constructor !== String) throw "type is not a string";

  const dogType = firstUpperCase(type)
  if (!dogType in breedData.breed ){
    throw "Type is not available";
  }
}



async function validateOwner(owner){
  if (!owner) throw "owner is undefinded";
  if (owner.constructor !== String) throw "owner is not a string";

  const usersCollection = await users();
  parsedOwner = ObjectId.createFromHexString(owner);
  const user = await usersCollection.find({_id:parsedOwner});
  if (user == null) thorw `owner with the id ${parsedOwner} is not exist`;
}


function validateDob(dob) {
  let today = new Date();
  if (!dob) throw "date of birth is undefinded";
  if (isNaN(Date.parse(dob))) throw "date of birth is invalid";
  if (today - dob < 0 || (today - dob)/ (1000 * 24 * 60 * 60 * 366) > 35)
    throw "date of birth is invalid, dog age should less than 35 and greater than 0";
}


function validateImage(image) {
  if(!image) throw "image is undefinded";
  if(image.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(image.path);
    throw "file is not in proper type image";
  }
}


function convertDateToString(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}


function calculateAge(date) {
  let ageDifMs = Date.now() - date.getTime();
  let ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// ======================================================
async function addDog(name, gender, dob, type, owner){
  validateName(name);
  validateGender(gender);
  validateDob(dob);
  validateType(type);
  validateOwner(owner);

  let dog = {
    name: name,
    type: type,
    gender: gender,
    dob: new Date(Date.parse(dob)),
    avatar: null,
    owner: owner,
    heightWeight: [],
    photos: [],
    comments: [] }

  const dogsCollection = await dogs();
  const insertedInfo = await dogsCollection.insertOne(dog);
  if (insertedInfo.insertedCount === 0) throw "could not create the dog";
  const dogId = insertedInfo.insertedId;

  const usersCollection = await users();
  const updateInfo = await usersCollection.updateOne({ _id: ObjectId.createFromHexString(owner) }, 
                                        {$push: {dogs: { $each: [ ObjectId(dogId).toString() ], $position: 0}}});
  if (updateInfo.modifiedCount === 0) throw "could not add the dog to the user";

  return await getDog(dogId.toString());
}


async function updateDog(id, dog){
  validateId(id);
  validateName(dog.name);
  validateGender(dog.gender);
  validateType(dog.type);
  validateDob(dog.dob);

  let updateDog = {
    name: dog.name,
    type: dog.type,
    gender: dog.gender,
    dob: new Date(Date.parse(dog.dob)) }

  const dogsCollection = await dogs();
  const parsedId = ObjectId.createFromHexString(id);
  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$set: updateDog});
  if (updateInfo.modifiedCount === 0) throw "nothing changed";

  return await this.getDog(id);
}


async function removeDog(id){
  validateId(id);

  const parsedId = ObjectId.createFromHexString(id);
  const dogsCollection = await dogs();

  const deletionInfo = await dogsCollection.removeOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) throw `could not delete dog with id of ${id}`;

  const usersCollection = await users();
  const updateInfo = await usersCollection.updateOne( { _id: removedData.owner }, {$pull: {dogs: id}});
  if (updateInfo.modifiedCount === 0) throw "could not delete the dog in the user";
  // TODO delete comment
  comments.deleteAllComments(removedData.comments);
  // TODO delete photo

  return removedData;
}


async function getAllDogs(){
  const dogsCollection = await dogs();
  const allDogs = await dogsCollection.find().toArray();
  if (!allDogs) throw 'no dog found';

  for(let dog of allDogs) {
    if (dog.avatar) dog.avatar = await imgData.getPhotoDataId(dog.avatar);
    dog.age = calculateAge(dog.dob);
  }

  return allDogs;
}


async function getDog(id){
  validateId(id);

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  const dog = await dogsCollection.findOne({_id: parsedId});
  if (!dog) throw "dog not found";

  const usersCollection = await users();
  const owner = await usersCollection.findOne({_id: ObjectId.createFromHexString(dog.owner)});
  if (!owner) throw "owner not found";

  dog.owner = owner.username;
  dog.age = calculateAge(dog.dob);
  dog.dob = convertDateToString(dog.dob);
  if (dog.avatar) dog.avatar = await imgData.getPhotoDataId(dog.avatar);

  if(dog.heightWeight && dog.heightWeight.length) {
    dog.weightList = [], dog.bmiList = [], dog.healthDateList = [];
    dog.weight = dog.heightWeight[0].weight;
    dog.height = dog.heightWeight[0].height;
    dog.bmi = Math.round(dog.weight / dog.height * 100) / 100;
    dog.lastHeightWeightUpdate = convertDateToString(dog.heightWeight[0].date);
    for (let hw of dog.heightWeight) {
      dog.weightList.push(hw.weight);
      dog.bmiList.push(Math.round(hw.weight / hw.height * 100) / 100);
      dog.healthDateList.push(convertDateToString(hw.date));
    }
  }

  return dog;
}


async function updateAvatar(id, file){
  validateId(id);
  validateImage(file);

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  let photoId = await imgData.createGridFS(file);
  fs.unlinkSync(file.path);
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, { $set: {avatar: photoId.toString()}});
  if (updateInfo.modifiedCount === 0) throw "Could not update avatar successfully";

  return await getDog(id);
}


async function addHeightWeight(id, hw){
  validateId(id);
  validateHeightWeight(hw);
  hw.date = new Date();

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$push: {heightWeight: hw}});
  if (updateInfo.modifiedCount === 0) throw "Could not update the height/weight successfully";
  return await getDog(id);
}


async function addPhotos(id, file){
  validateId(id);
  validateImage(file);

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  let photoId = await imgData.createGridFS(file);
  fs.unlinkSync(file.path);
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, 
                          { $push: {photos: { $each: [ photoId.toString() ], $position: 0}}});
  if (updateInfo.modifiedCount === 0) throw "could not add a new photo successfully";

  return await getDog(id);
}


async function removePhotos(dogId, photoId){
  validateId(dogId);
  validateId(photoId);

  const dogsCollection = await dogs();
  let parsedDogId = ObjectId.createFromHexString(dogId);
  const updateInfo = await dogsCollection.updateOne({ _id: parsedDogId } ,{$pull: {photos: photoId}});
  if (updateInfo.modifiedCount === 0) throw "could not remove the photo successfully";

  imgData.deletePhotos([photoId]);

  return getDog(dogId);
}


async function getAllComments(dogId){
  // Get all comments of this dog
  validateId(dogId);

  const dogsCollection = await dogs();
  const commentsCollection = await comments();
  const usersCollection = await users();

  let parsedUserId = ObjectId.createFromHexString(dogId);
  const dog = await dogsCollection.findOne({_id: parsedUserId});
  if (!dog) throw "dog not found";

  let allComments = [];
  if (!dog.comments || !dog.comments.length) return [];

  for (let commentId of dog.comments){
    let parsedCommentId = ObjectId.createFromHexString(commentId);
    let comment = await commentsCollection.findOne({_id:parsedCommentId})
    if (!comment) throw "could not find the comment successfully";

    let parsedUserId = ObjectId.createFromHexString(comment.author);
    let user = await usersCollection.findOne({_id:parsedUserId});
    if (!user) throw "could not find the user successfully";

    allComments.push({
      author: user.username,
      content: comment.content,
      avatar: user.avatar,
      id: comment._id
    });
  }

  return allComments;
}


module.exports = {
  addDog,
  getAllDogs,
  getDog,
  updateDog,
  updateAvatar,
  addHeightWeight,
  removeDog,
  addPhotos,
  removePhotos,
  getAllComments
}
