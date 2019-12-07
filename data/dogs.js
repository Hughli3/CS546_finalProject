const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const users = mongoCollections.users;
const comments = mongoCollections.comments;
const imgData = require("./img");
const commentData = require("./comments");
const ObjectId = require('mongodb').ObjectID;

// ======================================================
function validateHeightWeight (hw) {
  if (!hw) throw "heightWeight is undefinded";
  // if (! heightWeight instanceof Array) throw "Your input heightWeight is not an array.";
  validateHeight(hw.height);
  validateWeight(hw.weight);
}


function validateWeight(weight){
  if (!weight) throw "weight is undefinded";
  if (typeof weight != "number") throw "weight is not of the proper type";
  if (weight < 0 ) throw "weight is not a positive number";
}


function validateHeight(height){
  if (!height) throw "height is undefinded";
  if (typeof height != "number") throw "height is not of the proper type";
  if (height < 0 ) throw "height is not a positive number";
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
}


function validateType(type){
  if (!type) throw "type is undefinded";
  if (type.constructor !== String) throw "type is not a string";
}


function validateOwner(owner){
  if (!owner) throw "owner is undefinded";
  if (owner.constructor !== String) throw "owner is not a string";

  const usersCollection = await users();
  parsedOwner = ObjectId.createFromHexString(dog.owner);
  const user = await usersCollection.find({_id:parsedOwner});
  if (user == null) thorw `owner with the id ${parsedOwner} is not exist`;
}


function validateDob(dob) {
  let today = new Date();
  if (!dob) throw "date of birth is undefinded";
  if (isNaN(Date.parse(dob))) throw "date of birth is invalid";
  if (today - dateOfBirth < 0 || (today - dateOfBirth)/ (1000 * 24 * 60 * 60 * 366) > 35) 
    throw "date of birth is invalid, dog age should less than 35 and greater than 0";
}


function validateImage(image) {
  if(!image) throw "image is undefinded";
  if(file.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(file.path);
    throw "file is not in proper type image";
  }
}


function convertDateToString(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
    health: [],
    photos: [],
    comments: [] }

  const dogsCollection = await dogs();
  const insertedInfo = await dogsCollection.insertOne(dog);
  if (insertedInfo.insertedCount === 0) throw "could not create the dog";
  const dogId = insertedInfo.insertedId;

  const updateInfo = await usersCollection.updateOne({ _id: ObjectId.createFromHexString(owner) }, {$addToSet: {dogs: ObjectId(dogId).toString()}});
  if (updateInfo.modifiedCount === 0) throw "could not add the dog to the user";

  return await getDog(dogId);
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
    dob: new Date(Date.parse(dob)) }

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
  const dogs = dogsCollection.find().toArray();
  if (!dogs) throw 'no dog found';

  return dogs;
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
  dog.dob = convertDateToString(dog.dob);

  return dog;
}


async function updateAvatar(id, file){
  validateId(id);
  validateImage(file);

  const dogsCollection = await dogs(); 
  let parsedId = ObjectId.createFromHexString(id);  
  let photoId = await imgData.createGridFS(file);
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, { $Set: {avatar: photoId.toString()}});
  if (updateInfo.modifiedCount === 0) throw "Could not update avatar successfully";

  return await getDog(id);
}


async function addHeightWeight(id, hw){
  validateId(id);
  validateHeightWeight(hw);
  hw.date = new Date();

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$addToSet: {heightWeight: hw}});
  if (updateInfo.modifiedCount === 0) throw "Could not update the height/weight successfully";
  return await getDog(id);
}


async function addPhotos(id, file){
  validateId(id);
  validateImage(file);

  const dogsCollection = await dogs();
  let parsedId = ObjectId.createFromHexString(id);
  let photoId = await imgData.createGridFS(file);
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, { $addToSet: {photos: photoId.toString()}});
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
  const dog = dogsCollection.findOne({_id: parsedUserId});
  if (!dog) throw "dog not found";

  let allComments = [];
  for (let commentId of dog.comments){
    let parsedCommentId = ObjectId.createFromHexString(commentId);
    let comment = commentsCollection.findOne({_id:parsedCommentId})
    if (!comment) throw "could not find the comment successfully";

    let parsedUserId = ObjectId.createFromHexString(comment.author);
    let user = usersCollection.findOne({_id:parsedUserId});
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


// async function getDogDetail(id){
//   // TODO Get the dog owner name
//   if (!id) throw "id is undefinded";
//   if (!ObjectId.isValid(id)) throw "id is invalid";
//   if (!isString(id)) id = id.toString();
//   id = ObjectId.createFromHexString(id);

//   const dogsCollection = await dogs();
//   const dog = await dogsCollection.findOne({_id: id});
//   if (!dog) throw 'dog not found';

//   let data = {
//     _id: dog._id,
//     dogName: dog.name,
//     gender: gender,
//     dateOfBirth: dateOfBirth,
//     heightWeight: heightWeight,
//     type: type, 
//     avatarId: avatarId,
//     photos: [],
//     comments: [],
//     owner:owner
//   }

//   return dog
// }

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

