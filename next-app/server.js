const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const Chat = require('../src/utils/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' },
});

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.NEXT_APP_MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Retrieve past messages from the database
    Chat.findOne({ room }).then((chat) => {
      if (chat) {
        socket.emit('previousMessages', chat.messages);
      }
    });
  });

  socket.on('message', async (data) => {
    if (data.room) {
      const message = {
        text: data.text,
        user: data.user,
        sender: data.sender,
        timestamp: new Date(),
      };

      let chat = await Chat.findOne({ room: data.room });
      if (!chat) {
        chat = new Chat({ room: data.room, messages: [] });
      }
      chat.messages.push(message);
      await chat.save();
      io.to(data.room).emit('message', message);
    } else {
      console.error('No room specified in message event');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/chat/buyer', (req, res) => {
  const { sellerID, buyerID } = req.query;

  if (!sellerID || !buyerID) {
    return res.status(400).send({ error: 'Missing sellerID or buyerID' });
  }

  res.status(200).send({ message: 'Buyer Chat route works!', sellerID, buyerID });
});

app.get('/chat/seller', (req, res) => {
  const { sellerID, buyerID } = req.query;

  if (!sellerID || !buyerID) {
    return res.status(400).send({ error: 'Missing sellerID or buyerID' });
  }

  res.status(200).send({ message: 'Seller Chat route works!', sellerID, buyerID });
});

server.listen(8000, () => {
  console.log('Socket server running on http://localhost:8000');
});