const base64Img = require('base64-img');
const now = new Date();
const md5 = require('md5');
const ObjectID = require("mongodb").ObjectID;

const mongoCollections = require("../config/mongoCollections");
const fsFiles = mongoCollections.fsFiles;
const fsChunks = mongoCollections.fsChunks;
const fs = require('fs');

//========================================
// Validate functions
function isString (name){
    if (name.constructor !== String){
        throw `${name || "Provided string"} is not a string.`
      }
}

async function validateImage(image) {
  if(!image) throw "image is undefinded";
  const imageType = new Set(['jpg', 'jpeg','png']);
  const fileType = image.mimetype.split("/");
  
  if(fileType[0] != "image" || ! imageType.has(fileType[1]) ) {
    fs.unlinkSync(image.path);
    throw "file is not in proper type image, jpg jpeg png are accepted";
  }

  let base64Data = base64Img.base64Sync(image.path);
  if (base64Data.length > 16777216) {
    fs.unlinkSync(image.path);
    throw "size is larger than 16MB";
  }
}

//========================================
// Body functions
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
  await validateImage(file);

  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();

  let base64Data = base64Img.base64Sync(file.path);
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
    fs.unlinkSync(file.path);
    throw "could not create a new file";
  }
  
  let chunks = chunkSubstr(base64Data);
  for (let i = 0; i < chunks.length; i++) {
    let buff = Buffer.from(chunks[i]);
    let newChunk = {
      files_id: insertFilesInfo.insertedId,
      n: i,
      data: buff,
    }

    let insertChunksInfo = await fsChunksCollection.insertOne(newChunk);
    if (insertChunksInfo.insertedCount === 0){
      deletePhoto(file.filename)      
      throw "Could not create a new Chunks";
    }    
  }
  
  fs.unlinkSync(file.path);
  return insertFilesInfo.insertedId;
}

async function deletePhoto(id){
  if (!id) throw "Your input is not exist.";
  let nid = ObjectID(id)

  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();
  
  const deletionInfo1 = await fsFilesCollection.deleteOne({ _id: nid });
  const deletionInfo2 = await fsChunksCollection.deleteMany({ files_id: nid });

  if (deletionInfo1.deletedCount === 0 && deletionInfo2.deletedCount === 0)
      throw "could not delete photo";

  return true;
}

async function deletePhotos(ids){
  if (!ids) throw "Your input is not exist.";

  const fsFilesCollection = await fsFiles();
  const fsChunksCollection = await fsChunks();

  for (let i = 0; i < ids.length; i++) {
    let nid = ObjectID(ids[i])
    
    let deletionInfo1 = await fsFilesCollection.deleteOne({ _id: nid });
    let deletionInfo2 = await fsChunksCollection.deleteMany({ files_id: nid });

    if (deletionInfo1.deletedCount === 0 && deletionInfo2.deletedCount === 0) {
      throw `Could not delete user with id of ${nid}`;
    }
  }
  return true;
}

async function getPhotoDataId(id){
  if (!id) throw "Your input is not exist.";
  let nid = ObjectID(id);

  const fsChunksCollection = await fsChunks();

  const PhotoData = await fsChunksCollection.find({ files_id: nid }).toArray();
  // const PhotoData = await fsChunksCollection.findOne({ files_id: Id });
  if (PhotoData == null) {
        throw "Could not find Photo Data successfully";
  }

  let stringPhotoData = ''
  for (let i = 0; i < PhotoData.length; i++) {
    for(let j=0; j < PhotoData.length; j++){
      if (PhotoData[j].n == i) {
        stringPhotoData += PhotoData[i].data.buffer.toString()
        break
      }
    }
  }
  return stringPhotoData
}

async function getPhotoDataIds(ids){
  if (!ids) throw "Your input is not exist.";
  let photos = []
  const fsChunksCollection = await fsChunks();
  for (let i = 0; i < ids.length; i++) {
    let nid = ObjectID(ids[i])

    let PhotoData = await fsChunksCollection.find({ files_id: nid }).toArray();
    // let PhotoData = await fsChunksCollection.findOne({ files_id: Id });
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
    photos.push(stringPhotoData)
  }
  return photos
}

module.exports = {
  createGridFS,
  deletePhoto,
  deletePhotos,
  getPhotoDataId,
  getPhotoDataIds,
}
