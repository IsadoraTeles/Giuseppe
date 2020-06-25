// console.log("hi")

// a database is for persistance with information save (I DONT NEED THAT)
// to share information with clients
// using NeDB (very light)

// SERVER CODE


const express = require('express');
const Datastore = require('nedb'); // creating a database on NeDB

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data); // send data
    });
});


// CLIENT SEND POST
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
}); // my application interface for my clients to send data to me

//const port = process.env.PORT || 3000;


