var redis = require('redis');

exports.redisClient = redis.createClient();
exports.redisSubscriber = redis.createClient();
exports.redisPublisher  = redis.createClient();
