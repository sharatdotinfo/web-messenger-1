var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
users = [];
connections = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('A user connected');
  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
  })

  // send message
  socket.on('chat message', function(data){
    if (socket.username !== undefined) {
      io.emit('chat message', {msg: data, user: socket.username});
    }
    else {
      var randomuser = 'randomuser' + Math.floor(Math.random()*10000);
      socket.username = randomuser;
      io.emit('chat message', {msg: data, user: socket.username});
    }
  });

  // New user
  socket.on('new user', function(data, callback){
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.emit('get users', users);
  }
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
