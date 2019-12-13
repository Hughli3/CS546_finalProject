const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const commentsData = require('../data/comments');
const breedData = require("../data/breed");

// =================================
// helper functions



const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // =================================
    // Create a user 
    let originPassword1 = "testtest";

    let user1 = {
        username: 'IamHugh',
        password:originPassword1,
        avatarId: null
    }

    const userOne = await userData.addUser(user1.username, user1.password);

    console.log("user1 created");


    // user 2

    let originPassword2 = "myPassword";

    let user2 = {
        username: 'LucyLoveDog',
        password:originPassword2,
        avatarId: null
    }

    const userTwo = await userData.addUser(user2.username, user2.password);

    console.log("user2 created");

    // user 3

    let originPassword3 = "passpass1";

    let user3 = {
        username: 'MyNameMike',
        password:originPassword3,
        avatarId: null
    }

    const userThree = await userData.addUser(user3.username, user3.password);

    console.log("user3 created");


    // user 4

    let originPassword4 = "mysuperpassword";

    let user4 = {
        username: 'Greeneee',
        password:originPassword4,
        avatarId: null
    }

    const userFour = await userData.addUser(user4.username, user4.password);

    console.log("user4 created");

       // user 5

       let originPassword5 = "mysupersupersuperpassword";

       let user5 = {
           username: 'PatrickHill',
           password:originPassword5,
           avatarId: null
       }
   
       const userFive = await userData.addUser(user5.username, user5.password);
   
       console.log("user4 created");

    // =================================
    //  Create a dog
    // console.log(userOne);
    
    // hugh's dog
    let userId1 = userOne._id.toString();

    
    dog1 = await dogData.addDog(
        "Painting",
        "Male",
        "2019-03-19",
        "Samoyed",
        userId1
    );
    
    console.log("hugh's dog1 created");

    dog2 = await dogData.addDog(
        "Snow",
        "Female",
        "2018-03-13",
        "Samoyed",
        userId1
    );
    
    console.log("hugh's dog2 created");

    // Lucy's dog
    let userId2 = userTwo._id.toString();

    
    userId2dog1 = await dogData.addDog(
        "P",
        "Male",
        "2018-10-19",
        "Husky",
        userId2
    );
    
    console.log("Lucy's dog1 created");

    userId2dog2 = await dogData.addDog(
        "Rose",
        "Female",
        "2015-06-22",
        "Labrador retriever",
        userId2
    );
    
    console.log("Lucy's dog2 created");

    userId2dog3 = await dogData.addDog(
        "Rose",
        "Female",
        "2016-08-01",
        "Golden retriever",
        userId2
    );
    
    console.log("Lucy's dog3 created");


    // Mike's dog
    let userId3 = userThree._id.toString();
    
    userId3dog1 = await dogData.addDog(
        "Ricky",
        "Male",
        "2017-09-19",
        "Afghan hound",
        userId3
    );
    
    console.log("Mike's dog1 created");
    
    // Green's dog
    let userId4 = userFour._id.toString();
    userId4dog1 = await dogData.addDog(
        "Fierce",
        "Male",
        "2013-09-19",
        "Alaskan malamute",
        userId4
    );
    
    console.log("Green's dog1 created");

    userId4dog2 = await dogData.addDog(
        "H",
        "Female",
        "2014-10-19",
        "Alaskan malamute",
        userId4
    );
    
    console.log("Green's dog1 created");

    // Hill's dog
    let userId5 = userFive._id.toString();
    userId5dog1 = await dogData.addDog(
        "R",
        "Male",
        "2018-03-19",
        "Husky",
        userId5
    );
    
    console.log("Hill's dog1 created");

    userId5dog2 = await dogData.addDog(
        "O",
        "Male",
        "2018-09-19",
        "Husky",
        userId5
    );
    
    console.log("Hill's dog2 created");

    userId5dog3 = await dogData.addDog(
        "X",
        "Female",
        "2018-07-19",
        "Husky",
        userId5
    );
    
    console.log("Hill's dog3 created");

    // =================================
    //  Create some height and weight

    // let dogId = dog._id.toString()

    // for (let i = 0; i < 20; i++) {
    //     let heightWeight = {height: i + 1, weight: i + 2}
    //     dog = await dogData.addHeightWeight(dogId, heightWeight);
    // }
    // console.log("heightWeight created");

   
     // =================================
    //  Create some comments


    // for (let i = 0; i < 20; i++) {
    //     comment = await commentsData.addComment("I am a test", userId, dogId);
    //     // console.log(newComment);
    // }
    // console.log(await commentsData.getComment(comment._id.toString()));
    // console.log(await commentsData.deleteCommentsByDog(dogId));
    
    // console.log("comment created");

    // let output = await commentsData.getComments(newComment._id.toString());
    // console.log(output);
    await db.serverConfig.close();
}

main().catch(console.log);
