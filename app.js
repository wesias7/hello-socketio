var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/modules', express.static(path.join(__dirname, 'node_modules')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
  1. simple examples

  // sending to sender-client only
  socket.emit('message', "this is a test");

  // sending to all clients, include sender
  io.emit('message', "this is a test");

  // sending to all clients except sender
  socket.broadcast.emit('message', "this is a test");

  // sending to all clients in 'game' room(channel) except sender
  socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
  io.in('game').emit('message', 'cool game');

  // sending to sender client, only if they are in 'game' room(channel)
  socket.to('game').emit('message', 'enjoy the game');

  // sending to all clients in namespace 'myNamespace', include sender
  io.of('myNamespace').emit('message', 'gg');

  // sending to individual socketid (server-side)
  socket.broadcast.to(socketid).emit('message', 'for your eyes only');

  // join to subscribe the socket to a given channel (server-side):
  socket.join('some room');

  // then simply use to or in (they are the same) when broadcasting or emitting (server-side)
  io.to('some room').emit('some event'):

  // leave to unsubscribe the socket to a given channel (server-side)
  socket.leave('some room');

  2. Simple example

  The syntax is confusing in socketio. Also, every socket is automatically connected to their own room with the id socket.id (this is how private chat works in socketio, they use rooms).

  Send to the sender and noone else

  socket.emit('hello', msg);
  Send to everyone including the sender(if the sender is in the room) in the room "my room"

  io.to('my room').emit('hello', msg);
  Send to everyone except the sender(if the sender is in the room) in the room "my room"

  socket.broadcast.to('my room').emit('hello', msg);
  Send to everyone in every room, including the sender

  io.emit('hello', msg); // short version

  io.sockets.emit('hello', msg);
  Send to specific socket only (private chat)

  socket.broadcast.to(otherSocket.id).emit('hello', msg);
*/

io.on('connection', function(socket){
  console.log('info %s', 'a user connected.');
  console.log(socket);

  // Broadcasting
  // The next goal is for us to emit the event from the server to the rest of the users.
  // In order to send an event to everyone, Socket.IO gives us the io.emit:
  //io.emit('some event', { for: 'everyone' });
  socket.broadcast.to(
  io.emit('chat message', '즐거운 대화 문화를 만들어갑시다.');

  // If you want to send a message to everyone except for a certain socket, we have the broadcast flag:
  socket.broadcast.emit('chat message', '[전체공지] 즐거운 대화 문화를 만들어주세요.');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    // In this case, for the sake of simplicity we’ll send the message to everyone, including the sender.
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('info %s', 'user disconnected.');
  });

});

http.listen(3000, function(){
  console.log('info %s', 'success to started for socket.io');
});