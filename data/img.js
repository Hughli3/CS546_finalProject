//========================================
// Requires
const base64Img = require('base64-img');
const now = new Date();
const md5 = require('md5');
const ObjectID = require("mongodb").ObjectID;

const mongoCollections = require("../config/mongoCollections");
const fsFiles = mongoCollections.fsFiles;
const fsChunks = mongoCollections.fsChunks;

//========================================
// Check input
function isString (name){
    if (name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}
//========================================
function chunkSubstr(str) {
  let size = 261120
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
  }

  return chunks
}

async function createGridFS(file){
  if (!file) throw "file is not exist.";
  let base64Data = await base64Img.base64Sync(file.path);
  if (base64Data.length > 16777216) {
    throw "This Size is larger than 16MB";
  }

  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();

  let newFiles = {
    length: base64Data.length,
    chunkSize: 261120,
    uploadDate: now,
    filename: file.filename,
    md5: md5(base64Data),
    contentType: file.mimetype,
  }

  const insertFilesInfo = await fsFilesCollection.insertOne(newFiles);
  if (insertFilesInfo.insertedCount === 0){
    deletePhoto(file.filename)
    throw "Could not create a new Files";
  }
  
  let insertFiles = await getPhotoByName(file.filename)  
  let chunks = chunkSubstr(base64Data)

  for (let i = 0; i < chunks.length; i++) {
    let buff = Buffer.from(chunks[i]);
    let newChunk = {
      files_id: insertFiles._id,
      n: i,
      data: buff,
    }

    let insertChunksInfo = await fsChunksCollection.insertOne(newChunk);
    if (insertChunksInfo.insertedCount === 0){
      deletePhoto(file.filename)      
      throw "Could not create a new Chunks";
    }    
  }
  return insertFiles._id
}

async function deletePhoto(id){
  if (!id) throw "Your input is not exist.";
  let nid = ObjectID(id)

  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();

  let PhotoInfo = await getPhotoById(id);
  let Id = PhotoInfo._id;
  
  // const deletionInfo1 = await fsFilesCollection.removeOne({ _id: Id });
  // const deletionInfo2 = await fsChunksCollection.remove({ files_id: Id });
  
  const deletionInfo1 = await fsFilesCollection.deleteOne({ _id: Id });
  const deletionInfo2 = await fsChunksCollection.deleteMany({ files_id: Id });

  if (deletionInfo1.deletedCount === 0 && deletionInfo2.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }

  return true;
}

async function deleteAll(){
  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();

  await fsFilesCollection.deleteMany();
  await fsChunksCollection.deleteMany();
}
// deleteAll()

async function getPhotoData(name){
  if (!name) throw "Your input is not exist.";
  isString(name);

  let PhotoInfo = await getPhotoByName(name);
  let Id = PhotoInfo._id;  

  const fsChunksCollection = await fsChunks();

  const PhotoData = await fsChunksCollection.find({ files_id: Id }).toArray();
  // const PhotoData = await fsChunksCollection.findOne({ files_id: Id });
  if (PhotoData == null) {
        throw "Could not find Photo Data successfully";
  }

  let stringPhotoData = ''
  for (let i = 0; i < PhotoData.length; i++) {
    for(let j=0; j < PhotoData.length; j++){
      if (PhotoData[j].n == i) {
        // stringPhotoData += PhotoData[i].data.buffer
        stringPhotoData += PhotoData[i].data.buffer.toString()
        break
      }
    }
  }
  return stringPhotoData
}

async function getPhotoDataId(id){
  if (!id) throw "Your input is not exist.";
  let nid = ObjectID(id)

  let PhotoInfo = await getPhotoById(nid);
  let Id = PhotoInfo._id;  

  const fsChunksCollection = await fsChunks();

  const PhotoData = await fsChunksCollection.find({ files_id: Id }).toArray();
  // const PhotoData = await fsChunksCollection.findOne({ files_id: Id });
  if (PhotoData == null) {
        throw "Could not find Photo Data successfully";
  }

  let stringPhotoData = ''
  for (let i = 0; i < PhotoData.length; i++) {
    for(let j=0; j < PhotoData.length; j++){
      if (PhotoData[j].n == i) {
        // stringPhotoData += PhotoData[i].data.buffer
        stringPhotoData += PhotoData[i].data.buffer.toString()
        break
      }
    }
  }
  return stringPhotoData
}

async function getPhotoByName(name){
  if (!name) throw "Your input is not exist.";
  isString(name);
  const fsFilesCollection = await fsFiles();

  const PhotoInfo = await fsFilesCollection.findOne({ filename: name });
  if (PhotoInfo == null) {
        throw "Could not find Photo successfully";
  }
  return PhotoInfo
}

async function getPhotoById(Id){
  if (!Id) throw "Your input is not exist.";
  const fsFilesCollection = await fsFiles();

  const PhotoInfo = await fsFilesCollection.findOne({ _id: Id });
  if (PhotoInfo == null) {
        throw "Could not find Photo successfully";
  }
  return PhotoInfo
}

module.exports = {
  createGridFS,
  deletePhoto,
  getPhotoDataId
}
