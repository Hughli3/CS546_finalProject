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
    if (name.constructor == String){
        return true;
      }else return false;
}

//========================================
// body functions here

async function createComments(content, author, dog){
  if (!author) throw "Your input author is not exist.";
  if (!content) throw "Your input content is not exist.";
  if(!isString(content))  `${content || "Provided input"} is not a string.`
  const commentsCollection = await comments();

  let date = new Date();
  formated_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
  let newComment = {
    content:content,
    author:author,
    dog:dog,
    date: formated_date
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

  if (!isString(id)) throw `Your input id is not a string`;

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

  if (!isString(id)) throw `Your input id is not a string`;
  parsedId = ObjectId.createFromHexString(id);
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({_id:parsedId});

  
  const usersCollection = await users();
  const userUpdateInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(comment.author) }
    ,{$pull: {comments: id}}
    );
  
  if (userUpdateInfo.modifiedCount === 0){
    throw `Could not delete the dog in the user comments ${id} list`;
  }

  const dogsCollection = await dogs();
  const dogUpdateInfo = await dogsCollection.updateOne(
    { _id: ObjectId.createFromHexString(comment.dog) }
    ,{$pull: {comments: id}}
    );
  
  if (dogUpdateInfo.modifiedCount === 0){
    throw `Could not delete the comment in the dog comments ${id} list`;
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

  if (!isString(id)) throw `Your input id is not a string`;
  parsedId = ObjectId.createFromHexString(id);
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({_id:parsedId});
  if (comment == null) throw `Could not find the comment with id of ${parsedId}`;


  return comment
}

async function getAllComments(){
  const commentsCollection = await comments();

  const comment = await commentsCollection.find();
  if (comment == null) throw `Could not find the comments`;

  return comment
}


async function deleteAllComments(ids){
  const commentsCollection = await comments();
  const usersCollection = await users();
  const dogsCollection = await dogs();

  for (let i = 0; i < ids.length; i++){
    let commentId = ids[i];
    let parsedCommentId = ObjectId.createFromHexString(commentId);
    const deletionInfo = commentsCollection.removeOne({_id:parsedCommentId});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${id}`;
    }

  const comment = await commentsCollection.findOne({_id:parsedCommentId});
  const userUpdateInfo = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(comment.author) }
    ,{$pull: {comments: id}}
    );
  
  if (userUpdateInfo.modifiedCount === 0){
    throw `Could not delete the dog in the user comments ${id} list`;
  }

  
  const dogUpdateInfo = await dogsCollection.updateOne(
    { _id: ObjectId.createFromHexString(comment.dog) }
    ,{$pull: {comments: id}}
    );
  
  if (dogUpdateInfo.modifiedCount === 0){
    throw `Could not delete the comment in the dog comments ${id} list`;
  }
  }

}
module.exports = {
  createComments,
  updateComments,
  deleteComments,
  getComments,
  getAllComments,
  deleteAllComments
  }
