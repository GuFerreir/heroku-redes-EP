
//no começo setamos as dependencias
const express = require('express');
const path = require('path');
//criação do servidor
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//a porta que irá escutar (no Heroku eles usam process.env.PORT como uma variável para saber a porta)
var porta = process.env.PORT || 3000;
//setamos a infra para renderizar o front
app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//escutamos todas as requisições ao endereço seguido por '/' e renderezimos o index.html
app.use('/', (req,res) => {
    res.render('index.html');
});

//ligamos o socket
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    //enviamos via socket para o front o id (la eles escutarão e tratarão esse envio)
    socket.emit('idSocket', socket.id);
    //escutamos o evendo sendMessage do front para receber o autor e a imagem
    socket.on('sendMessage', data => {
        //enviamos à todos os dispositivos conectados os dados recebidos
        socket.broadcast.emit('receivedMessage', data);
    })
});
//servidor fica conectado na porta definida
server.listen(porta);

