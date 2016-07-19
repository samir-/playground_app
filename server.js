
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

//middleware
app.use(bodyParser.urlencoded({extended: true}))

////handlers

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
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
  docClient.put(params , function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
      }
  });


  //redirection to the get method above
  console.log(localpath+'/users')
res.redirect(localpath+'/users')
})
app.listen(3000, function () {
  console.log(' app listening on port 3000!');
});
