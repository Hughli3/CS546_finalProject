const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const commentsData = require('../data/comments');
const breedData = require("../data/breed");

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // =================================
    // Create a user 
    let originPasswrd1 = "testtest";

    let user1 = {
        username: 'testuser',
        password:originPasswrd1,
        avatarId: null
    }

    const userOne = await userData.addUser(user1.username, user1.password);

    console.log("user1 created");


    // user 2

    let originPasswrd2 = "myPassword";

    let user2 = {
        username: 'LucyLoveDog',
        password:originPasswrd2,
        avatarId: null
    }

    const userTwo = await userData.addUser(user2.username, user2.password);

    console.log("user2 created");

    // user 3

    let originPasswrd3 = "passpass1";

    let user3 = {
        username: 'MyNameRicky',
        password:originPasswrd3,
        avatarId: null
    }

    const userThree = await userData.addUser(user3.username, user3.password);

    console.log("user3 created");


    // user 3

    let originPasswrd3 = "passpass1";

    let user3 = {
        username: 'MyNameIsMike',
        password:originPasswrd3,
        avatarId: null
    }

    const userThree = await userData.addUser(user3.username, user3.password);

    console.log("user3 created");

    // =================================
    //  Create a dog
    // console.log(userOne);
    
    let userId = userOne._id.toString();
    let dog;
    for (let i = 0; i < 30; i++) {
        dog = await dogData.addDog(
            "Painting",
            "Male",
            "2019-03-19",
            "Samoyed",
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

   
     // =================================
    //  Create some comments


    for (let i = 0; i < 20; i++) {
        comment = await commentsData.addComment("I am a test", userId, dogId);
        // console.log(newComment);
    }
    // console.log(await commentsData.getComment(comment._id.toString()));
    // console.log(await commentsData.deleteCommentsByDog(dogId));
    
    console.log("comment created");

    // let output = await commentsData.getComments(newComment._id.toString());
    // console.log(output);
    await db.serverConfig.close();
}

main().catch(console.log);
