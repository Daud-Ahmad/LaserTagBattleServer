const express = require('express'),
  http = require('http'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

const individualPlayer = require('./models/IndividualPlayers');

app.get('/', (req, res) => {
  res.send('Chat Server is running on port 3000');
});

const connectDB = require('./config/db.js');

// Connect Database...
connectDB();

//init middleware
app.use(express.json({ extended: false }));

//define routes
app.use('/api/auth/', require('./routs/api/auth'));
app.use('/api/individualPlayer', require('./routs/api/individualPlayerApi'));
app.use('/api/profile', require('./routs/api/profile'));
app.use('/api/users', require('./routs/api/users'));

io.on('connection', socket => {
  console.log('user connected');

  socket.on('player_email', async function(playerEmail, myEmail) {
    let user = await User.findOne({ email: playerEmail });
    let myInfo = await User.findOne({ email: myEmail });

    if (!user) {
      return socket.broadcast.emit('findPlayer', 'user not available');
    }

    if (!myInfo) {
      return socket.broadcast.emit('findPlayer', 'i not available');
    }

    socket.broadcast.emit('findPlayer', playerEmail + ':' + myInfo.name);
  });

  socket.on('disconnect', function() {
    console.log(' user has left ');
    socket.broadcast.emit('userdisconnect', ' user has left ');
  });

  socket.on('acceptInvitation', function(playerName, playerEmail) {
    socket.broadcast.emit('sendToStartPlayer', playerName + ':' + playerEmail);
  });

  socket.on('cancelInvitation', function() {
    socket.broadcast.emit('sendToStartPlayer', 'invitation_cancel');
  });

  socket.on('player_not_found', function() {
    socket.broadcast.emit('sendToStartPlayer', 'player_not_founded');
  });

  socket.on('startGame', function() {
    socket.broadcast.emit('allInviteGameStart', 'startNow');
  });

  socket.on('checkAlivePlayers', async function() {
    try {
      // const alivePlayer = 0;
      // const { isAlive } = await individualPlayer.find();
      // isAlive.forEach(function(item) {
      //   if (item) {
      //     alivePlayer++;
      //   }
      // });

      socket.broadcast.emit('individualWinnerPlayer', 'you_win');
    } catch (err) {
      socket.broadcast.emit('individualWinnerPlayer', 'errrror');
    }
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`server started on port ${PORT}`));

server.listen(PORT, () => {
  console.log('Node app is running on port 5000');
});
