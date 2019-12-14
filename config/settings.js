
module.exports = {
    "mongoConfig": {
      "serverUrl": "mongodb://localhost:27017/",
      "database": "CS546_final"
    },
    "limiterConfig": {
      "loginLimiter" : {
        "collection": "loginLimiter",
        "max": 10,
        "windowMs": 1 * 60 * 1000,
      }, 
      "signupLimiter" : {
        "collection": "signupLimiter",
        "max": 5,
        "windowMs": 60 * 60 * 1000,
      },
      "commentLimiter" : {
        "collection": "commentLimiter",
        "max": 5,
        "windowMs": 10 * 60 * 1000,
      }
    }
}