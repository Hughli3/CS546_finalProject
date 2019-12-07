const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const users = mongoCollections.users;
const comments = mongoCollections.comments;
const imgData = require("./img");
const commentData = require("./comments");
const ObjectId = require('mongodb').ObjectID;

// ======================================================
function isValidHeightWeight (heightWeight) {
  // The heightWeight contains height, weight, date. The date is the scale date of height and weight.
  if (!heightWeight) throw "heightWeight is undefinded";
  if (! heightWeight instanceof Array) throw "Your input heightWeight is not an array.";

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
    return false
    }else return true;
}


// ======================================================
async function createADog(name, gender, dateOfBirth, heightWeight, type, avatarId, owner){
  // create a dog
<<<<<<< HEAD
  if (!name) throw "name is undefinded";
  if (typeof name != "string") throw "name is not a string";
  if (name.length > 30) throw "name is too long";
=======
  if (!name) throw "Name is undefinded";
  
  if (!isString(name)) throw `Your input username is not string`;
>>>>>>> 8aaec16663e3ca7ef16b309e78696bd62943192d

  if (!gender) throw "Gender is undefinded";
  if (!isString(gender)) throw `Your input gender is not string`;
  

  if (!dateOfBirth) throw "dateOfBirth is undefinded";  
  dateOfBirth = Date.parse(dateOfBirth);
  if (isNaN(dateOfBirth)) throw "dateOfBirth is invalid";
  dateOfBirth = new Date(dateOfBirth);

  let today = new Date();
  
  if (today - dateOfBirth < 0 || (today - dateOfBirth)/ (1000 * 24 * 60 * 60 * 366) > 35) throw `Please input a real birth date of your dog`;
// Dog age should less than 35 and greater than 0


  let formatted_date = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
  // console.log(dateOfBirth.toString());
  // console.log(formatted_date);
  /*
Date.parse() 方法解析一个表示某个日期的字符串，并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数，
如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：2015-02-31），则返回值为NaN。
*/

  isValidHeightWeight(heightWeight);

  if (!type) throw "type is undefinded";
 
  if (!isString(type)) throw `Your input type is not string`;
  if (!owner) throw "owner is undefinded";
  if (!isString(owner)) throw `Your input owner is not string`;


  // if (!avatarId) throw "avatar is undefinded";
  // if (!ObjectId.isValid(avatarId)) throw "avatarId is invalid";
  // if (typeof avatarId != "string") avatarId = avatarId.toString();
  
  let dog = {
    dogName: name,
    gender: gender,
    dateOfBirth: formatted_date,
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
  // If this user is not created throw error
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


async function updateHeightWeightOfDog(id, newHeightWeight){
  // A function just add a new height and weight
  if (!id) throw "Your input id is not exist.";
  isString(id);
  const dogsCollection = await dogs();

  parsedId = ObjectId.createFromHexString(id);

  const updateInfo = await dogsCollection.updateOne({_id: parsedId}, {$addToSet: {heightWeight: newHeightWeight}});
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the dog successfully";
  }
  return await this.getDog(id);
}

async function getDog(id){
  // TODO Get the dog owner name
  if (!id) throw "id is undefinded";
  if (!ObjectId.isValid(id)) throw "id is invalid";
  if (!isString(id)) id = id.toString();
  id = ObjectId.createFromHexString(id);

  const dogsCollection = await dogs();
  const dog = await dogsCollection.findOne({_id: id});
  if (!dog) throw 'dog not found';
//TODO return formated data
  return dog
}

async function getDogDetail(id){
  // TODO Get the dog owner name
  if (!id) throw "id is undefinded";
  if (!ObjectId.isValid(id)) throw "id is invalid";
  if (!isString(id)) id = id.toString();
  id = ObjectId.createFromHexString(id);

  const dogsCollection = await dogs();
  const dog = await dogsCollection.findOne({_id: id});
  if (!dog) throw 'dog not found';

  let data = {
    _id: dog._id,
    dogName: dog.name,
    gender: gender,
    dateOfBirth: dateOfBirth,
    heightWeight: heightWeight,
    type: type, 
    avatarId: avatarId,
    photos: [],
    comments: [],
    owner:owner
  }

  return dog
}

async function updateTheDog(id, newDogData){
  // Update dog name gender and birthday but can not update height weight
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
    dateOfBirth = Date.parse(newDogData.dateOfBirth);
    if (isNaN(dateOfBirth)) throw "dateOfBirth is invalid";
    dateOfBirth = new Date(dateOfBirth);
  
    let today = new Date();
    
    if (today - dateOfBirth < 0 || (today - dateOfBirth)/ (1000 * 24 * 60 * 60 * 366) > 35) throw `Please input a real birth date of your dog`;
  // Dog age should less than 35 and greater than 0
    let formatted_date = dateOfBirth.getFullYear() + "-" + (dateOfBirth.getMonth() + 1) + "-" + dateOfBirth.getDate();
   
    updateDog.dateOfBirth = formatted_date;
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
  //Delete the dog
  if (!id) throw "Your input id is not exist.";
  isString(id);
  parsedId = ObjectId.createFromHexString(id);
  if (!id) throw "Your input id is not exist.";
  const dogsCollection = await dogs();
  const removedData = await dogsCollection.findOne({ _id: parsedId });

  const usersCollection = await users();
  const updateInfo = await usersCollection.updateOne(
    { _id: removedData.owner }
    ,{$pull: {dogs: id}}
    );
  
  if (updateInfo.modifiedCount === 0){
    throw `Could not delete the dog in the user dog ${id} list`;
  }

  const deletionInfo = await dogsCollection.removeOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete dog with id of ${id}`;
  }

  comments.deleteAllComments(removedData.comments);

  return removedData
}

async function updateProfilePhotoOfTheDog(dogId, file){
  if (!dogId) throw "Your input photoId is not exist.";

  isString(dogId);

  if(!file) {
    throw `no file input`;
  } else if(file.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(file.path);
    throw `type error, image only`;
  } 
  parsedDogId = ObjectId.createFromHexString(dogId);

  let photoId = await imgData.createGridFS(file);

  const dogsCollection = await dogs();

  const updatePhoto = {
    photos: photoId.toString()
  };
   
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, { $Set: updatePhoto});

  if (updateInfo.modifiedCount === 0) {
      throw "Could not update photo successfully";
  }

  return await getDog(dogId);
}

async function addPhotos(dogId, file){
  // add a photo to the dog 
  if (!dogId) throw "Your input photoId is not exist.";

  isString(dogId);

  if(!file) {
    throw `no file input`;
  } else if(file.mimetype.split("/")[0] != "image") {
    fs.unlinkSync(file.path);
    throw `type error, image only`;
  } 

  parsedDogId = ObjectId.createFromHexString(dogId);

  let photoId = await imgData.createGridFS(file);

  const dogsCollection = await dogs();

  const addPhoto = {
    photos: photoId.toString()
  };
   
  const updateInfo = await dogsCollection.updateOne({ _id: parsedId }, { $addToSet: addPhoto});

  if (updateInfo.modifiedCount === 0) {
      throw "Could not add a new photo successfully";
  }

  return await getDog(dogId);
}


async function removePhotos(dogId, photoIds){
  // remove a photos from the dog 
  if (!dogId) throw "Your input photoId is not exist.";
  isString(dogId);

  if(!photoIds) throw "Your input photo id array is not exist.";

  if (! photoIds instanceof Array) throw "Your input photo id array is not exist.";

  parsedDogId = ObjectId.createFromHexString(dogId);

  for (i in photoIds){
    const updateInfo = await dogssCollection.updateOne(
      { _id: parsedDogId }
      ,{$pull: {photos: i}}
      );

      if (updateInfo.modifiedCount === 0) {
        throw "Could not remove the photo successfully";
    }
  }
  imgData.deletePhotos(ids);

  return getDog(dogId);
}


async function getAllComments(dogId){
  // Get all comments of this dog
  if (!dogId) throw "Your input id is not exist.";
  isString(dogId);

  parsedUserId = ObjectId.createFromHexString(dogId);
  const dogsCollection = await dogs();
  const aDog = dogsCollection.findOne({_id: parsedUserId});
  let allComments = [];

  const commentsCollection = await comments();
  const usersCollection = await users();

  for (let i = 0; i < aDog.comments.length;i++){

    parsedCommentId = ObjectId.createFromHexString(aDog.comments[i]);
    let comment = commentsCollection.findOne({_id:parsedCommentId})
    if (comment == null){
      throw "Could not find the comment successfully";
    }

    parsedUserId = ObjectId.createFromHexString(comment.author);
    let userInfo = usersCollection.findOne({_id:parsedUserId});
    if (userInfo == null){
      throw "Could not find the user successfully";
    }
    let data = {
      author: userInfo.name,
      content: comment.content,
      avatar: userInfo.avatarId,
      commentId:comment._id
    }
    allComments.push(data);
  }
  return allComments;

}

module.exports = {
  createADog,
  updateTheDog,
  deleteTheDog,
  updateProfilePhotoOfTheDog,
  getAllDogs,
  getDog,
  addPhotos,
  updateHeightWeightOfDog,
  getAllComments,
  removePhotos
}

