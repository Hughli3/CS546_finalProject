const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    aDog = {
        name: 'Painting', 
        gender: "Male", 
        dataOfBirth: new Date('2012/12/25').format("yyyy-MM-dd"), 
        height: 33.00, 
        weight: 43.00, 
        type:'samoye', 
        avatarId:null
    }

    const dogOne = await dogData.createADog(aDog);
    const id = dogO._id;
    console.log(dogOne);

    await db.serverConfig.close();
}

main().catch(console.log);
