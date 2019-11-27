const express = require('express');
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const app = express();

app.use(express.json());
app.use('/public', static);
app.use(express.urlencoded({extended: true}));

// app.use(function(req, res, next){
//   let timeStamp = new Date().toUTCString();
//   if(req.session.user){
    
//     console.log(`[${timeStamp}]: ${req.method} ${req.originalUrl} (Authenticated User)`);
    
//   }else{
//     let timeStamp = new Date().toUTCString();
//     console.log(`[${timeStamp}]: ${req.method} ${req.originalUrl} (Non-Authenticated User)`);
//   }
//   next();
// });

configRoutes(app);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});