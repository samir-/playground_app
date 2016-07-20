
var express = require('express');
var AWS = require("aws-sdk");
const bodyParser= require('body-parser')
var app = express();
var localpath = "http://localhost:3000";
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var redis = require('redis');
var redis_client = redis.createClient();

//middleware to parse the body
app.use(bodyParser.urlencoded({extended: true}))

////handlers

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});
app.get('/hello', function (req, res) {
  res.send('Hello World')
});
app.get('/users', function (req, res) {
  var params = {
      TableName: "Users"
  };
  docClient.scan(params, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          res.send(data);
  });
});
app.post('/users',function (req, res) {

  var user = req.body ;
  console.log(user.email);
  var table = "Users"
  var params = {
      TableName:table,
      Item:{
          "username": user.username,
          "email": user.email,
          "info":{
              "age": user.age,
          }
      }
  };

  console.log("Adding a new item...");

  if(redis_check(user.username)==false){
    console.log("meeeeeeee");
  docClient.put(params , function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          redis_add(user.username,user.email) ;
          console.log("Added item:", JSON.stringify(data, null, 2));
      }
  });
}

  //redirection to the get method above
  console.log(localpath+'/users')
res.redirect(localpath+'/users')
})

app.listen(3000, function () {
  console.log(' app listening on port 3000!');
});
/////REDIS  PART for stroring simple key-value pair (username , email )

redis_client.on('connect', function() {
    console.log('redis connected');
});
var redis_add = function(username , email ){

  redis_client.set(username ,email , function(err, reply) {
  console.log(reply + " ,  Userame /Email added " );

});

}
var redis_retrieve = function(username){

    redis_client.get(username, function(err, reply) {
    console.log(reply);

});
}

// i don't know how to return from from asynch func , it seems like it's impossible so check is there to avoid another fnction


var redis_check = function(username){
    var check=0 ;
    redis_client.exists(username, function(err, reply) {

    if (reply === 1) {
        console.log('exists');
        check = true ;
    } else {
        console.log('doesn\'t exist');
        check = false ;
    }
});
   return check ;
}
