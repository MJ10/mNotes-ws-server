const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db')
const router = express.Router();

router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, message: err});
    } else {
      res.json({success: true, message: "user registered"});
    }
  });
});

router.post('/authenticate', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if(!user){
      res.json({success: false, msg : "User does not exist"});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if(isMatch) {
          const token = jwt.sign(user, config.secret, {
            expiresIn: 1209600
          });
          res.json({
            success: true,
            token: 'JWT '+token,
            user : {
              name: user.name,
              id: user._id,
              username: user.username,
              email: user.email
            }
          })
        } else {
          return res.json({success: false, msg : "Incorrect password"});
        }
    });
  })

});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({ user: req.user});
});

module.exports = router;
