const express = require('express');
const path = require('path');
const socket = require('socket.io');

const db = require('./db.js');
const messages = db.messages;
const users = db.users;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

// app.get('/db/messages', (req, res) => {
//   res.send(messages);
// });

// app.get('/db/users', (req, res) => {
//   res.send(users);
// });

app.use((req, res) => {
  res.status(404).send('<h1>404 not found...</h1>');
})

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server, {
  allowEIO3: true // false by default
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', (user) => {
    console.log(`User ${user.name} logged`);
    users.push(user);
  })
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id)
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const index = users.findIndex(user => user.id === socket.id);
    users.splice(index, 1);
  });
  console.log('I\'ve added a listener on message event \n');
});
