let capture;

function setup() {
    //noCanvas();
    createCanvas(320, 240);
    capture = createCapture(VIDEO); // from client
    capture.size(320, 240);
    capture.hide();

    ///////

    let lat, lon;
    const button = document.getElementById('submit');
    button.addEventListener('click', async event => {
        const mood = document.getElementById('mood').value;
        capture.loadPixels();
        const image64 = capture.canvas.toDataURL(); // convert image into ASCII text to send it to database
        const data = { lat, lon, mood, image64 };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch('/api', options);
        const json = await response.json();
        console.log(json);
    });

    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat, lon);
            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = lon;
        });
    } else {
        console.log('geolocation not available');
    }
}

function draw() {
    background(255, 0, 0);
    image(capture, 0, 0, 320, 240);
}