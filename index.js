// console.log("hi")

// a database is for persistance with information save (I DONT NEED THAT)
// to share information with clients
// using NeDB (very light)

// P5 STUFF

// SERVER SIDE CODE
const path = require('path');
const express = require('express'); // creating a server obj
const Datastore = require('nedb');  // creating a database on NeDB

// OPENCV
//const cv = require('opencv4nodejs');
//const wCap = new cv.VideoCapture(0); // id 0 is the facecam
//wCap.set(cv.CAP_PROP_FRAME_WIDTH, 320);
//wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 240);


const app = express(); // new express app
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Starting server at : ${port}`)
});
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

    // SENDING DRAWING MESSAGE FROM ONE CLIENT TO ALL
    socket.on('mouse', mouseMsg);
    function mouseMsg(data) {
        socket.broadcast.emit('mouse', data);
        // io.sockets.emit('mouse', data);
        console.log(data);
    }
}


// SERVER GET POST
// CREATING AN IN POINT
app.get('/api', (request, response) => { // ROUTING
    // send files to client
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data); // send data BACK TO CLIENT
    });

    // SENDING FILE TO CLIENTS
    //response.sendfile(path.join(_dirname, '...'));

});


// SENDING CAPTURE FROM P5JS OBJECT NOT POSSIBLE
/*
setInterval(() => {
    let captureServer;
    captureServer = createCapture(VIDEO);
    captureServer.size(320, 240);
    captureServer.loadPixels();
    const image64Server = captureServer.canvas.toDataURL(); // convert image into ASCII text to send it to database
    socket.emit('imageFromServer', captureServer);
}, 1000);
*/

// SENDING CAPTURE FROM OPENCV OBJECT
/*
setInterval(() => {
    const frame = wCap.read(); // returns a matrix that represents the img
    const imageCV = cv.imencode('.jpg', frame).toString('base64');
    socket.emit('image', imageCV);
}, 1000);
*/

// CLIENT SEND POST
// my application interface (api) for my clients to send data to me
app.post('/api', (request, response) => { // ROUTING
    // receiving files from client
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




