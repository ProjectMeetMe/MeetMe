var config = require ("config");
var Pusher = require("pusher");

//Creates a pusher connection
var appId = config.get("pushConfig.appId");
var key = config.get("pushConfig.key");
var secret = config.get("pushConfig.secret");
var cluster = config.get("pushConfig.cluster");

var pusher = new Pusher({
    appId: appId,
    key: key,
    secret: secret,
    cluster: cluster,
    encrypted: true
});

//Creates a push notification for all clients connected to this channel + event
/*
pusher.trigger("my-channel", "my-event", {
    "message": "hello worldzz"
});
*/
module.exports = pusher;
