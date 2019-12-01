const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const bcryptjs = require("bcryptjs");
const saltRounds = 5;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    let originPasswrd = "testtest";
    
    
    let user = {
        username: 'testuser',
        password:originPasswrd,
        name: 'test',
        avatarId: null
    }

    const userOne = await userData.createANewUser(user.username, user.password, user.name, user.avatarId);

    console.log(userOne);

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
        owner:userOne._id.toString()
    }

    const dogOne = await dogData.createADog(
        dog.name,
        dog.gender,
        dog.dataOfBirth,
        dog.heightWeight,
        dog.type,
        dog.avatarId,
        dog.owner
    );
    
    console.log(dogOne);

  
    let aheightWeight = {height: 15, weight: 20, date: "2018-05-26"}
    let id = dogOne._id.toString()
    const updateDog = await dogData.updateHeightWeightOfDog(id, aheightWeight);
    console.log(updateDog);
    dogOne.dateOfBirth
    await db.serverConfig.close();
}

main().catch(console.log);
