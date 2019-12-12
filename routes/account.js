const express = require("express");
const router = express.Router();
const usersData = require("../data/user");
const middleware = require('./middleware');

router.get('/signup', middleware.notLoginRequired, async (req, res) => {
  res.render('signup', {title: "Signup", hideFooter: true});
});

router.post('/signup', middleware.notLoginRequired, async (req, res) => {
  try {
    await usersData.addUser(req.body.username, req.body.password);
    res.redirect('/login');
  } catch (e) {
    res.status(401).render('signup', {title: "Signup", error: e, hideFooter: true});
  }
});

router.get('/logout', middleware.loginRequired, function(req, res) {
  req.session.destroy();
  return res.redirect('/');
});

router.get('/login', middleware.notLoginRequired, async (req, res) => {
  res.render('login', {title: "Login", hideFooter: true});
});

router.post('/login', middleware.notLoginRequired, async (req, res) => {
  try {
    const compareResult = await usersData.comparePassword(req.body.username, req.body.password);
    req.session.userid = compareResult.userid;
    req.session.username = compareResult.username;

    return res.redirect('/user');  
  } catch (e) {
    res.status(401).render('login', {title: "Login", error: "Invalid username and/or password", hideFooter: true});
  }
});

module.exports = router;
