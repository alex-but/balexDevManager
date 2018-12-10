const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/register', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body)
  User.register(name, password, email, (success, err) => {
      res.send({success: success, error: err})
    })
})

router.ws('/:uid', function (ws, req){
  var uid = req.params.uid;
  // the websocket is used to anounce the user when a state change
  // has occured. The message should contain the 
  // deviceID
  // so the user client can than get the state of the device
  console.log("start ws")
  User.subscribe(uid, function(channel, message){
    ws.send(message);
  })
})

router.delete('/:uid', function (req, res){
  console.log(req.params.uid)
  User.remove(req.params.uid, (success, err)=> {
    res.send({success: success, error: err})
  })
})

router.get('/:uid', function (req, res){
  User.getUserData(req.params.uid, function(err, userData) {
    res.send(userData);
  })
})

router.get('/:uid/devices', function (req, res){
  User.getUserDevices(req.params.uid, function(err, userDevices) {
    res.send(userDevices);
  })
})

// Define routes handling profile requests
module.exports = router
