
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var porta = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
    res.render('index.html');
});

let messages = []; 

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('idSocket', socket.id);

    socket.on('sendMessage', data => {
        socket.broadcast.emit('receivedMessage', data);
    })
});

server.listen(porta);

