const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const bcryptjs = require("bcryptjs");
const saltRounds = 5;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    let originPasswrd = testtest;
    password = bcryptjs.hash(originPasswrd, saltRounds);
    
    let user = {
        username: testuser,
        password:password,
        name, test,
        avatarId:null
    }

    const userOne = await userData.createANewUser(user.username, user.password, user.name, user.avatarId);

    console.log(userOne);

    let dog = {
        name: "Paintin", 
        gender: "Male", 
        dataOfBirth: "2011-10-19", 
        heightWeight: [
            {height: 40, weight: 50, date: "2016-10-19"},
            {height: 30, weight: 60, date: "2012-10-19"},
            {height: 10, weight: 20, date: "2013-10-19"}
        ],
        type: "samoye", 
        avatarId: null,
        owner:userOne._id
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

    await db.serverConfig.close();
}

main().catch(console.log);
