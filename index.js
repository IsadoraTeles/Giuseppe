// console.log("hi")

// a database is for persistance with information save (I DONT NEED THAT)
// to share information with clients
// using NeDB (very light)

// SERVER SIDE CODE
const express = require('express'); // creating a server obj
const Datastore = require('nedb');  // creating a database on NeDB

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Starting server at : ${port}')
}
);
const socket = require('socket.io')(server);  // creating a socket obj
app.use(express.static('public'));     // use everything in 'public' dir
app.use(express.json({ limit: '1mb' }));

// DATABASE
const database = new Datastore('database.db');
database.loadDatabase();

// CREATE SOCKET FOR THE SERVER
//var io = socket(port);
socket.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('mouse', mouseMsg);

    function mouseMsg(data) {
        socket.broadcast.emit('mouse', data);
        // io.sockets.emit('mouse', data);
        console.log(data);
    }
}


// SERVER GET POST
app.get('/api', (request, response) => { // ROUTING
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data); // send data BACK TO CLIENT
    });
});

// CLIENT SEND POST
// my application interface (api) for my clients to send data to me
app.post('/api', (request, response) => { // ROUTING
    console.log('I got a request!');
    const data = request.body;
    // TIME OF REQUEST
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data); // sending the information back to the client
    // HOW TO CLEAR THE DATABASE ???
});

//const port = process.env.PORT || 3000;


