//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;

const { ObjectId } = require("mongodb");

//========================================
// Check input
function isString (name){
    if (!name || name === undefined || name === '' || name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}

function isNumber(number){
  if (number.constructor != Number || number === NaN){
    throw `${number || "Provided number"} is not a number.`
  }
}

//========================================
// body functions here

async function createComments(content, author,dog){
  if (!author) throw "Your input author is not exist.";
  if (!content) throw "Your input content is not exist.";
  isString(content);
  const commentsCollection = await comments();

  let newComment = {
    content:content,
    author:author,
    dog:dog
  }
  
  
  // =============
  // before create a new comments check if user and dog exist
  parsedAuthor = ObjectId.createFromHexString(newComment.author);
  const usersCollection = await users();

  const aUser = await usersCollection.findOne({_id:parsedAuthor});
  if (aUser == null) throw `Could not find the user with id of ${parsedAuthor}`;


  parsedDog = ObjectId.createFromHexString(newComment.dog);
  const dogsCollection = await dogs();
  const aDog = await dogsCollection.findOne({_id:parsedDog});
  if (aDog == null) throw `Could not find the dog with id of ${parsedDog}`;
  // =============


  const insertInfo = await commentsCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw "Could not add comments";

    const newId = insertInfo.insertedId;
    const userUpdateInfo = await usersCollection.updateOne({ _id: parsedAuthor }, {$addToSet: {comments: ObjectId(newId).toString()}});
    if (userUpdateInfo.modifiedCount === 0) throw "Could not add comment to the user";
    
    parsedDog = ObjectId.createFromHexString(newComment.dog);
    const dogUpdateInfo = await dogsCollection.updateOne({ _id: parsedDog }, {$addToSet: {comments: ObjectId(newId).toString()}});
    if (dogUpdateInfo.modifiedCount === 0) throw "Could not add comment to the dog";

    const comment =  await this.getComments(ObjectId(newId).toString());
    return comment;
}

async function updateComments(id){
  if (!id) throw "Your input id is not exist.";

  isString(id);

  const parsedId = ObjectId.createFromHexString(id);

  const commentsCollection = await comments();

  const updateComment = {
      content: content
    };
   
  const updateInfo = await commentsCollection.updateOne({ _id: parsedId }, { $set: updateComment});

  if (updateInfo.modifiedCount === 0) {
      throw "Could not update comment successfully";
    }

  return await this.get(ObjectId(id).toString());
}

async function deleteComments(id){
  if (!id) throw "Your input id is not exist.";

  isString(id);
  parsedId = ObjectId.createFromHexString(id);
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({_id:parsedId});

  const usersCollection = await users();
  const deleteCommentInUserList = usersCollection.removeOne({_id:comment.author});
  if (deleteCommentInUserList.deletedCount == 0){
    throw `Could not delete the comment in the user comment ${id} list`;
  }

  const dogsCollection = await dogs();
  const deleteCommentInDogList = dogsCollection.removeOne({_id:comment.dog});
  if (deleteCommentInDogList.deletedCount == 0){
    throw `Could not delete the comment in the dog comment ${id} list`;
  }
  const deletionInfo = await commentsCollection.removeOne({_id:parsedId});
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete dog with id of ${id}`;
  }
// just return comment content without user info and dog info 
return comment;
}

async function getComments(id){
  if (!id) throw "Your input id is not exist.";

  isString(id);
  parsedId = ObjectId.createFromHexString(id);
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({_id:parsedId});
  if (comment == null) throw `Could not find the comment with id of ${parsedId}`;

  return comment
}

async function getAllComments(){

}

module.exports = {
  createComments,
  updateComments,
  deleteComments,
  getComments,
  getAllComments
  }
