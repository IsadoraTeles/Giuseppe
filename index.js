// console.log("hi")

// SERVER CODE


const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

app.post('/api', (request, response)=>{
    console.log(request);
}); // my application interface for my clients to send data to me

const port = process.env.PORT || 3000;


