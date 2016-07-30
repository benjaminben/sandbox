var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.vom_clients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})
app.use(express.static(__dirname + '/public'));

app.get('/vom', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

server.listen(8000, function(){
  console.log('live enough *:8000')
})

io.on('connection', function(socket){
  console.log(socket.request.headers.referer);
  io.vom_clients.push(socket);
  // socket.on('disconnect', function(){

  // });

  if( io.vom_host ){
    io.to(socket.id).emit('enter_vom');
  }

  if( socket.request.headers.referer.indexOf('/vom') > -1 ){
    io.vom_host = true;
    io.vom_host_client_id = socket.id;
    io.vom_clients.forEach(function(client){
      client.vom_string = "";
    })
    io.emit('host_in')

    socket.on('disconnect', function(){
      io.vom_host = false;
      io.emit('host_dip');
    });
  }

  socket.vom_string = "";

  // socket.on('host', function(){
  //   io.emit('host_in')
  // })

  socket.on('vom', function(vom){
    socket.vom_string = vom.string;
    io.to(io.vom_host_client_id).emit('ship_vom', vom.char)
  })

  socket.on('spread_vom', function(){
    console.log('boobs')
    var vom_strings = io.vom_clients.map(function(client){
      return client.vom_string;
    })
    console.log(vom_strings)
    io.to(io.vom_host_client_id).emit('vom_clients', vom_strings)
  })
})
