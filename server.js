const path=require('path');
const http = require('http');
const express = require('express');
const socketio= require('socket.io');
const { connect } = require('http2');
const { Socket } = require('dgram');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

//static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatApp Bot';

//run when client connects
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);
    
        socket.join(user);

    //Welcome Current User
    socket.emit('message',formatMessage(botName, 'Welcome to ChatApp!'));

    //Broadcast when a user connects except that user
    socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'));

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

    });

    //listen for chatMessage
    socket.on('chatMessage',msg=>{
        //console.log(msg);
        io.emit('message',formatMessage('USER',msg));
    });
});

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));