// console.log("hi")

// a database is for persistance with information save (I DONT NEED THAT)
// to share information with clients
// using NeDB (very light)

// SERVER SIDE CODE

const express = require('express');
const Datastore = require('nedb'); // creating a database on NeDB

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

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


