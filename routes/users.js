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
      res.json({success: false, message: "failed to register user"});
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
            expiresIn: 604800
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

router.ws('/ws', (ws, req)=> {
  console.log("Connected!");
  ws.on('message', (msg) => {
    console.log(msg)
    newMsg = JSON.parse(msg);
    console.log(newMsg.method);
    switch (newMsg.method) {
      case "getUser":
        console.log("getUserMethod " + newMsg.params[0].token);
        jwt.verify(newMsg.params[0].token, config.secret, (err, user) => {
          if(err) {
            ws.send(JSON.stringify(
              {
                method: "getUser",
                params: [
                  {
                    error: {
                      name: err.name,
                      msg: err.message
                    }
                  }
                ]
              }
            ));
          } else {
            ws.send(JSON.stringify(
              {
                method: "getUser",
                params: [
                  {
                    result: {
                      name:user._doc.name,
                      id: user.id,
                      username: user.name,
                      email: user.email1

                    }
                  }
                ]
              }
            ));
          }
        });
        // User.getUserByUsername(newMsg.params[0].username, (err, user) => {
        //   if(err) throw err;
        //   ws.send(JSON.stringify({user: {
        //     name:user.name,
        //     id: user.id,
        //     username: user.name,
        //     email: user.email
        //   }}));
        // })
        break;
      default:

    }
  })
});

module.exports = router;
