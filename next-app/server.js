const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/buyer/chat', (req, res) => {
    const { sellerID, buyerID } = req.query;

    if (!sellerID || !buyerID) {
        return res.status(400).send({ error: 'Missing sellerID or buyerID' });
    }

    res.status(200).send({ message: 'Chat route works!', sellerID, buyerID });
});


server.listen(8000, () => {
    console.log('Socket server running on http://localhost:8000');
});