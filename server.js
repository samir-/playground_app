       var express = require('express');
       var AWS = require("aws-sdk");
       const bodyParser = require('body-parser')
       var app = express();
       var localpath = "http://localhost:3000";
       AWS.config.update({
           accessKeyId: "akid",
           secretAccessKey : "secret",
           region: "us-west-2",
           endpoint: "http://localhost:8000"
       });
       var dynamodb = new AWS.DynamoDB();
       var docClient = new AWS.DynamoDB.DocumentClient();
       var redis = require('redis');
       var redis_client = redis.createClient();
       var wredis = require('./modules/wredis.js')


       //to serve js / css files
       app.use(express.static('public'));
       //middleware to parse the body
       app.use(bodyParser.urlencoded({
           extended: true
       }))

       ////handlers

       app.get('/', function(req, res) {
           res.sendFile(__dirname + '/public/html/index.html')
       });
       app.get('/hello', function(req, res) {
           res.send('Hello World')
       });
       app.get('/users', function(req, res) {
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
       app.post('/users', function(req, res) {

           var user = req.body;
           console.log(user.email);
           var table = "Users"
           var params = {
               TableName: table,
               Item: {
                   "username": user.username,
                   "email": user.email,
                   "info": {
                       "age": user.age,
                   }
               }
           };

           console.log("Adding a new item...");
           wredis.redis_check(user.username,redis_client, function(check) {
               if (check == false) {
                   docClient.put(params, function(err, data) {
                       if (err) {
                           console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                       } else {
                           wredis.redis_add(user.username, user.email,redis_client);
                           console.log("Added item:", JSON.stringify(data, null, 2));
                           res.redirect(localpath + '/users')
                       }

                   });
               }

           });
       });
       app.listen(3000, function() {
           console.log(' app listening on port 3000!');
       });
       /////REDIS  PART for stroring simple key-value pair (username , email )

       redis_client.on('connect', function() {
           console.log('redis connected');
       });
