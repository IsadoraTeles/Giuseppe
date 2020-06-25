let capture;
var w = 320;
var h = 240;

let lat, lon;
var myLat = 0;
var myLon = 0;

function setup() {
    //noCanvas();
    //createCanvas(320, 240);
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('capture ready.')
    });
    // from client
    capture.size(w, h);
    createCanvas(w, h);
    capture.hide();

    ///////

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

function drawCircle(pos) {
    ellipse(pos.x, pos.y, 20, 20);
}

var targetColor = [255, 0, 0];
function draw() {

    capture.loadPixels();
    var sampling = true;
    var sumPosition = createVector(0, 0);
    if (capture.pixels.length > 0) { // don't forget this!

        var w = capture.width,
            h = capture.height;
        var i = 0;
        var pixels = capture.pixels;
        var thresholdAmount = 206.55;

        var total = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var diff =
                    Math.abs(pixels[i + 0] - targetColor[0]) +
                    Math.abs(pixels[i + 1] - targetColor[1]) +
                    Math.abs(pixels[i + 2] - targetColor[2]);
                var outputValue = 0;
                if (diff < thresholdAmount) {
                    outputValue = 255;
                    sumPosition.x += x;
                    sumPosition.y += y;
                    total++;
                }
                pixels[i++] = outputValue; // set red
                pixels[i++] = outputValue; // set green
                pixels[i++] = outputValue; // set blue
                i++; // skip alpha
            }
        }

        sumPosition.div(total);

    }
    if (!sampling) {
        capture.updatePixels();
    }

    myLat = lat;
    myLat = map(myLat, -90, 90, 0, h);
    myLon = lon;
    myLon = map(myLon, -180, 180, 0, w);
    ellipse(myLon, myLat, 10, 10);

    image(capture, 0, 0, w, h);

    fill(targetColor);
    stroke(targetColor);
    drawCircle(sumPosition);
}
