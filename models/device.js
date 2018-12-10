// Redis DB interface regarding devices
var redisClient = require('../config/redis').redisClient
var redisSubcsriber = require('../config/redis').redisPublisher
var redisPublisher = require('../config/redis').redisSubscriber

exports.add = function(ownerID, type, name, callback) {
  redisClient.incr("device:id", function (err, did){
    if (err){
      callback(false, err);
    } else {
      console.log("adding id ", did)
      redisClient.hset("device:"+did, "name", name);
      redisClient.hset("device:"+did, "type", type);
      redisClient.hset("device:"+did, "owner", ownerID);
      // TODO based on the type get the state type of the device
      // e.g. Status, Brightness, Level
      // This informations should be added by an admin in the db via
      // a dedicated interface 
      // I am just hardcoding it here
      var state = {};
      switch(type) {
        case "Light":
          state = {Status: 'OFF', Brightness: 0};
          break;
        case "Switch":
          state = {Status: 'OFF'};
          break;
        default:
          state = {Status: 'OFF'};
      }
      redisClient.hmset("device:"+did+":state", state)
      redisClient.hmset("device:"+did+":request", state)
      //add device to owner device list
      redisClient.sadd("devices:"+ownerID, did);
      console.log(ownerID)
    callback(true, did);
    }
  })
}

exports.remove = function(did) {
  redisClient.hdel("device:"+did, ["name", "type"], function(err){
    if (err){
      callback(false, err);
      return;
    }
    callback(true, "");
  });
}

exports.getDeviceData = function(did, callback) {
  redisClient.hgetall("device:"+did, function(err, device){
    console.log(device);
    callback(null, device);
  })
}

exports.setState = function(did, state, callback ) {
  // TODO the state object should be validated here
  // depending on the type of the device
  if (!state){
    callback("Invalid input", false);
    return;
  }
  state=JSON.parse(state);
  redisClient.hmset("device:"+did+":state", state, function(err) {
    if (!state){
      callback(err, false);
      return;
    }
    console.log("state", state, "did", did)
    //announce user there is a state request
    redisClient.hget("device:"+did, "owner", function(err, ownerID){
      redisPublisher.publish(ownerID+"_user", did);
      callback("", true);
    })
  })
}

exports.reqState = function(did, state, callback) {
  // TODO the state object should be validated here
  // depending on the type of the device
  if (!state){
    callback("Invalid input", false);
    return;
  }
  state=JSON.parse(state);
  redisClient.hmset("device:"+did+":request", state, function(err) {
    if (!state){
      callback(err, false);
      return;
    }
    console.log("state", state, "did", did)
    //announce device there is a state request
    redisPublisher.publish(did+"_device", "new request");
    callback("", true);
  })
}

exports.getState = function(did, callback) {
  redisClient.hgetall("device:"+did+":state", function(err, state){
    console.log(state);
    callback(null, state);
  })
}

exports.getStateRequest = function(did, callback) {
  redisClient.hgetall("device:"+did+":request", function(err, stateRequest){
    console.log(stateRequest);
    callback(null, stateRequest);
  })
}

// Subscribe to messages regarding this device. Once a message like
// this occurs the device will check if there is any state changes it
// should be aware.
exports.subscribe = function(did, callback){
  console.log("wait for messages", did)
  redisSubscriber.on("message", function(channel, message){
    console.log(channel, message);
    callback(channel, message);
  });
  redisSubscriber.subscribe(did+"_device");
}
