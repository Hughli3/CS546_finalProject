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

async function createComments(){

}

async function updateComments(){

}

async function deleteComments(){

}

async function getComments(){

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
