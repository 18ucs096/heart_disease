const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { database } = require('../config/keys');

// Login Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
//Login
// Dashboard
router.get('/check', ensureAuthenticated, (req, res) =>{
  res.render('check', {
    name: req.user.name
  })
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
    User.findOne({ email: email }).then(user => {
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

//Possibility of Heart Disease checking
router.post('/check',(req,res)=>{
  const{bloodsugarlevel,bloodpressure,heartbeat,cholesterol}=req.body;
  // if all four parameter is normal then no heart disease can be there
  if(bloodsugarlevel=='normal' && bloodpressure=='normal' && heartbeat=='normal' && cholesterol=='normal'){
    var treatment=[
      {Treatment:"Consult physician "},{Treatment:"Do proper Rest"},{Treatment:"Do Meditation"},{Treatment:"Avoid taking too much tension and mental stress"}];
    res.render("report",{name: req.user.name,disease:"No Heart Disease,there might be something else,Consult physician if you feel same.",treatment:treatment})
  }
  else{
    //possiblity of heart disease is high
    res.render('disease',{name: req.user.name});
  }
})

//Checking of type of heart disease is there
router.post('/disease',(req,res)=>{
  const{chestpain,shortnessofbreath,fatigue,fainting,swelling,persistentcoughing }=req.body;
  var treatment=[
    {Treatment:"Consult physician "},{Treatment:"Do proper Rest"},{Treatment:"Do Meditation"},{Treatment:"Avoid taking too much tension and mental stress"}];
    //if all parameters is normal then no heart disease,might be something else 
  if(chestpain=='no'&& shortnessofbreath=="no" && fatigue=="no" && fainting=="no" && swelling=="no" && persistentcoughing=="no"){
    res.render("report",{name: req.user.name,disease:"No Heart Disease,there might be something else,Consult physician if you feel same.",treatment:treatment})
  }else{
  //Finding the possiblity of which disease is there.
  var sql=`select * from Disease_Detection`;
  //Fetching of result in Knowledge Base
  database.query(sql,function(err,data,field){
    var result = new Array(data.length);
    
    for(var i=0;i<data.length;i++){
      //Calculating priority on the basis of Input by user
      var priority=0;

      //chestpain
      if(chestpain.localeCompare("yes")==0){
        priority=priority+data[i].Chest_pain;
      }
      else{
        priority=priority+(10-data[i].Chest_pain);
      }

      //shortnessofbreath
      if(shortnessofbreath.localeCompare("yes")==0){
        priority=priority+data[i].Short_of_breath;
      }
      else{
        priority=priority+(10-data[i].Short_of_breath);
      }

      //fatigue
      if(fatigue.localeCompare("yes")==0){
        priority=priority+data[i].Fatigue;
      }
      else{
        priority=priority+(10-data[i].Fatigue);
      }

      //fainting
      if(fainting.localeCompare("yes")==0){
        priority=priority+data[i].Fainting;
      }
      else{
        priority=priority+(10-data[i].Fainting);
      }

      //swelling
      if(swelling.localeCompare("yes")==0){
        priority=priority+data[i].Swelling;
      }
      else{
        priority=priority+(10-data[i].Swelling);
      }

      //persistentcoughing
      if(persistentcoughing.localeCompare("yes")==0){
        priority=priority+data[i].Persistent_coughing;
      }
      else{
        priority=priority+(10-data[i].Persistent_coughing);
      }

      result[i]=priority;
    }
    var maxpriority=-1;
    var index=0;
    for(i=0;i<data.length;i++){
      if(maxpriority<result[i]){
        index=i;
      }
      maxpriority=Math.max(result[i],maxpriority);
    }
    // Fetching the Treatment of the Maximum possibilty of disease from knowledge base
    sql= `SELECT Treatment FROM Disease_Treatment where Disease='${data[index].Disease}'`;
    database.query(sql,function(err,treatment,field){
      res.render("report",{name: req.user.name,disease:data[index].Disease,treatment:treatment})

    })

  })

  }



  //res.render("report",{name: req.user.name});
})
router.get('*', function (req, res) { 
  res.redirect('https://image.freepik.com/free-vector/glitch-error-404-page_23-2148105404.jpg'); 
}) 

module.exports = router;
