const express = require('express')
const router = express.Router()
const Device = require('../models/device')

router.post('/add', (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const ownerID = req.body.uid;
  console.log(req.body)
  Device.add(ownerID, type, name, (success, id) => {
      res.send({success: success, id: id})
    })
})

router.ws('/:did', function (ws, req){
  // this websocket should be used to set an "Alive" flag in the
  // device state; User client will be than able to keep track of
  // devices being online
  Device.subscribe(req.params.did, function(channel, message){
    console.log("ws message", message)
    ws.send(message);
  })
})

router.delete('/:did', function (req, res){
  console.log(req.params.did)
  Device.remove(req.params.did, (success, err)=> {
    res.send({success: success, error: err})
  })
})

router.get('/:did', function (req, res){
  Device.getDeviceData(req.params.did, function(err, deviceData) {
    res.send(deviceData);
  })
})

//Set the state of the device. This should be posted by 
//the client running on the device and sets to db the actual
//state
router.post('/:did/setstate', (req, res) => {
  Device.setState(req.params.did, req.body.state, function(err, success){
    res.send({success: success, error: err})
  })
})

//Set the state of the device. This should be posted by 
//the user client and sets to db the desired
//state
router.post('/:did/reqstate', (req, res) => {
  Device.reqState(req.params.did, req.body.state, function(err, success){
    res.send({success: success, error: err})
  })

})

router.get('/:did/state', (req, res) => {
  Device.getState(req.params.did, function(err, state){
    res.send(state)
  })
})

router.get('/:did/reqstate', (req, res) => {
  Device.getStateRequest(req.params.did, function(err, stateRequest){
    res.send(stateRequest)
  })
})

// Define routes handling profile requests
module.exports = router
