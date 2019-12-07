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

    const userOne = await userData.addUser(user.username, user.password);
    console.log("user created");
    // =================================
    //  Create a dog
    // console.log(userOne);
    
    let userId = userOne._id.toString();
    let dog;
    for (let i = 0; i < 30; i++) {
        dog = await dogData.addDog(
            "Painting",
            "Male",
            "1988-03-19",
            "samoye",
            userId
        );
    }
    console.log("dog created");
    // let date = new Date();
    

    let dogId = dog._id.toString()

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: i + 2}
        dog = await dogData.addHeightWeight(dogId, heightWeight);
    }
    console.log("heightWeight created");

    // console.log(updateDog);
    // dogOne.dateOfBirth


     // =================================
    //  Create some comments

    for (let i = 0; i < 20; i++) {
        await commentsData.createComments("I am a test", userId, dogId);
        // console.log(newComment);
    }
    console.log("comment created");

    // let output = await commentsData.getComments(newComment._id.toString());
    // console.log(output);
    await db.serverConfig.close();
}

main().catch(console.log);
