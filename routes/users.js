const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
//Login
// Dashboard
router.get('/check', ensureAuthenticated, (req, res) =>{
  res.render('check', {
    name: req.user.name
  })
  console.log(req.user);
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
    User.findOne({ email: email }).then(user => {
      console.log(req.body)
      if (user) {
        res.render('login');
      } 
      else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.render('login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: './check',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

router.post('/check',(req,res)=>{
  const{bloodsugarlevel,bloodpressure,heartbeat,cholesterol}=req.body;
  if(bloodsugarlevel=='normal' && bloodpressure=='normal' && heartbeat=='normal' && cholesterol=='normal'){
    res.render('report',{name: req.user.name});
  }
  else{
    res.render('disease',{name: req.user.name});
  }
})
router.post('/disease',(req,res)=>{
  const{chestpain,shortnessofbreath,fatigue,fainting,swelling,persistentcoughing }=req.body;
  res.render("report",{name: req.user.name});
})
router.get('*', function (req, res) { 
  res.redirect('https://image.freepik.com/free-vector/glitch-error-404-page_23-2148105404.jpg'); 
}) 

module.exports = router;
