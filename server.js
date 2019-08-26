const express = require('express'),
  http = require('http'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

const individualPlayer = require('./models/IndividualPlayers');

const individual_playing = require('./socket_communication/individuals_playing_comm');

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
app.use('/api/teamPlayerApi', require('./routs/api/teamPlayersApi'));

// socket communication
// individual_playing();

io.on('connection', socket => {
  console.log('user connected');

  socket.on('player_email', async function(playerEmail, myEmail) {
    let user = await User.findOne({ email: playerEmail });
    let myInfo = await User.findOne({ email: myEmail });

    if (!user) {
      console.log('user_not_available');
      return socket.broadcast.emit('findPlayer', 'user_not_available');
    }

    if (!myInfo) {
      console.log('i not available');
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

  socket.on('deletedAllIndividualsPlayers', async function() {
    try {
      socket.broadcast.emit(
        'send_to_waiting_players',
        'go_back_to_main_dashboard'
      );
    } catch (err) {}
  });

  //team playing communication

  socket.on('deletedAllTeamPlayers', async function() {
    try {
      socket.broadcast.emit(
        'send_to_waiting_players',
        'go_back_to_main_dashboard'
      );
    } catch (err) {}
  });

  socket.on('player_email_for_team', async function(playerEmail, myEmail) {
    let user = await User.findOne({ email: playerEmail });
    let myInfo = await User.findOne({ email: myEmail });

    if (!user) {
      console.log('user_not_available');
      return socket.broadcast.emit('findPlayer_for_team', 'user_not_available');
    }

    if (!myInfo) {
      console.log('i not available');
      return socket.broadcast.emit('findPlayer_for_team', 'i not available');
    }

    socket.broadcast.emit(
      'findPlayer_for_team',
      playerEmail + ':' + myInfo.name
    );
  });

  socket.on('player_not_found_for_team', function() {
    socket.broadcast.emit(
      'sendToStartPlayer_for_team',
      'player_not_founded_for_team'
    );
  });

  socket.on('acceptInvitationTeam', function(playerName, playerEmail) {
    socket.broadcast.emit(
      'sendToStartPlayerTeam',
      playerName + ':' + playerEmail
    );
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`server started on port ${PORT}`));

server.listen(PORT, () => {
  console.log('Node app is running on port 5000');
});
