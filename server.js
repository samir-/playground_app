
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/samir', function (req, res) {
  res.send('Hello samir!');
});
app.get('/:x', function (req, res) {
  res.send('Hello samir!' );
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
