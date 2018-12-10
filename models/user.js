const bcrypt = require('bcryptjs');
var redisClient = require('../config/redis').redisClient
var redisSubcsriber = require('../config/redis').redisPublisher
var redisPublisher = require('../config/redis').redisSubscriber

exports.register = function(name, password, email, callback){
  //use a sorted set to keep track of all emails in a sorted
  //set caled "emails". The score of each user will be used as
  //a uid.
  //check if user exists with the same email
  redisClient.zrank("users", email, function (err, rank){
    if (rank){
      //email already registered
      callback(false, "Email already in use");
      return;
    }
    //keep the top user id in a key inside the redis db. Use this 
    //approach to make sure we don't have concurency issues
    redisClient.incr("user:id", function (err, uid){
      if (err){
        callback(false, err);
      } else {
        console.log("adding id ", uid)
        redisClient.zadd("users", uid, email);
        redisClient.hset("user:"+uid, "name", name);
        exports.setPassword(uid, password, function(err, success){
          console.log(name, password, email);
          exports.findOne(email, function(err, user){
            console.log(user);
          });
          callback(success, err);
        });
      }
    })
  })
}

exports.remove = function(uid, callback) {
  redisClient.zrangebyscore("users", uid, uid, function(err, email){
    redisClient.zrem("users", email, function(err){
      if (err){
        callback(false, err);
        return;
      }
      redisClient.hdel("user:"+uid, ["name", "password"], function(err){
        if (err){
          callback(false, err);
          return;
        }
        callback(true, "");
      });
    });
  });
}

exports.setPassword = function(uid, password, callback) {
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      if(err){
        console.log(err);
        callback(err, true);
        return;
      }
      redisClient.hset("user:"+uid, "password", hash);
      callback(null, true);
    });
  });
}

exports.findOne = function(email, callback){
  redisClient.zscore("users", email, function(err, uid){
    console.log(uid);
    if (err) {
      callback(err, {});
      console.log(err)
      return;
    } 
    redisClient.hgetall("user:"+uid, function(err, user){
      console.log(user);
      callback(null, user);
    })
  })
}

exports.getUserData = function(uid, callback) {
  redisClient.hgetall("user:"+uid, function(err, user){
    if (!user){
      callback("no such user", null)
      return;
    }
    callback(null, user["name"]);
  })
}

exports.getUserDevices = function(uid, callback) {
  redisClient.smembers("devices:"+uid, function(err, devices){
    if (err){
      callback(err, null)
      return;
    }
    console.log(devices);
    callback(null, devices);
  })
}

// Subscribe to messages regarding this user. Messages from the pub/sub
// queue should contain the deviceID user has to check
exports.subscribe = function(uid, callback){
  console.log("ceva nu imi place deloc")
  redisSubscriber.on("message", callback);
  redisSubscriber.subscribe(uid+"_user");
}
