module.exports = {

 redis_add: function(username, email,redis_client) {

    redis_client.set(username, email, function(err, reply) {
        console.log(reply + " ,  Userame /Email added ");

    });

},
redis_retrieve: function(username,redis_client) {

    redis_client.get(username, function(err, reply) {
        console.log(reply);

    });
},

redis_check:  function(username,redis_client, callback) {
    redis_client.exists(username, function(err, reply) {

        if (reply === 1) {
            console.log('exists');
            if (typeof callback === 'function') callback(true)
        } else {
            console.log('doesn\'t exist');
            if (typeof callback === 'function') callback(false)
        }
    });
}

}
