const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const commentsData = require('../data/comments');


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // =================================
    // Create a user 
    let originPasswrd = "testtest";

    let user = {
        username: 'testuser',
        password:originPasswrd,
        name: 'test',
        avatarId: null
    }

    const userOne = await userData.createANewUser(user.username, user.password, user.name, user.avatarId);
    // =================================
    //  Create a dog
    console.log(userOne);

    let userId = userOne._id.toString()
    let dog = {
        name: "Painting", 
        gender: "Male", 
        dataOfBirth: "2018-03-19", 
        // format should be day month year
        heightWeight: [
            {height: 40, weight: 50, date: "2019-10-30"},
            {height: 36, weight: 55, date: "2019-03-05"},
            {height: 34, weight: 54, date: "2019-01-25"},
            {height: 32, weight: 57, date: "2019-01-01"},
            {height: 30, weight: 55, date: "2018-10-25"},
            {height: 25, weight: 56, date: "2018-07-19"}
        ],
        type: "samoye", 
        avatarId: null,
        owner:userId
    }

    let dogOne;
    for (let i = 0; i < 100; i++) {
        dogOne = await dogData.createADog(
            dog.name,
            dog.gender,
            dog.dataOfBirth,
            dog.heightWeight,
            dog.type,
            dog.avatarId,
            dog.owner
        );
    }
    
    // console.log(dogOne);

  
    let aheightWeight = {height: 15, weight: 20, date: "2018-05-26"}
    let dogId = dogOne._id.toString()
    const updateDog = await dogData.updateHeightWeightOfDog(dogId, aheightWeight);
    console.log(updateDog);
    dogOne.dateOfBirth


     // =================================
    //  Create some comments

    for (let i = 0; i < 20; i++) {
        const newComment = await commentsData.createComments("I am a test", userId, dogId);
        console.log(newComment);
    }
    // let output = await commentsData.getComments(newComment._id.toString());
    // console.log(output);
    await db.serverConfig.close();
}

main().catch(console.log);
