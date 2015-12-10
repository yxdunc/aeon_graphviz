
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/vis/dist/vis.js', function(req, res){
  res.sendFile(__dirname + '/vis/dist/vis.js');
});

app.get('/vis/dist/vis.css', function(req, res){
  res.sendFile(__dirname + '/vis/dist/vis.css');
});

io.on('connection', function(socket){
  socket.on('graphUDR', function(msg){
	console.log('Graph update requested');
    io.emit('graphUD', fs.readFileSync('graph.DOT', 'utf8'));
  });

});

fs.watchFile('graph.DOT',{ persistent: true, interval: 1500 }, function (curr, prev) {
	console.log('Graph file updated (' + curr.mtime + ')');
	io.emit('graphUD', fs.readFileSync('graph.DOT', 'utf8'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

