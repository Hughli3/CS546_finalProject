//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
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

async function createComments(){

}


module.exports = {
    Create,
 
  }
