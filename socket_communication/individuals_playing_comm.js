const express = require('express'),
  http = require('http'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

const individual = async () => {
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
      socket.broadcast.emit(
        'sendToStartPlayer',
        playerName + ':' + playerEmail
      );
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
  });
};

module.exports = individual;
