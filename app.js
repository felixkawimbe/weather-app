// Import the Express module using ES module syntax
import express from 'express';
import * as https from 'https';

const app = express();
const port = 3000;

// Enable parsing URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Function to render the HTML page
function renderPage(city, tempr, wethd, imageURL) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Weather Info</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background-color: #f0f8ff;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .weather-box {
                width: 100%;
                max-width: 400px;
                padding: 30px;
                background-color: #ffffff;
                border-radius: 15px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .weather-icon {
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="weather-box">
            <form action="/" method="post" class="mb-4">
                <div class="input-group">
                    <input type="text" name="city" class="form-control" placeholder="Enter your city" required>
                    <button class="btn btn-primary" type="submit">Go</button>
                </div>
            </form>
            <p class="fw-bold">The temperature in ${city} is: ${tempr}°C</p>
            <h5 class="text-muted">Weather description: ${wethd}</h5>
            <img src="${imageURL}" alt="Weather Icon" class="weather-icon">
        </div>
    </body>
    </html>`;
}

// GET route for default city
app.get("/", function (req, res) {
    const city = "Chingola";
    const apiKey = "c540d5739e3f502bbd9118e07c6d2848";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weather = JSON.parse(data);
            const tempr = weather.main.temp;
            const wethd = weather.weather[0].description;
            const icon = weather.weather[0].icon;
            const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            res.send(renderPage(city, tempr, wethd, imageURL));
        });
    });
});

// POST route for user-entered city
app.post("/", function (req, res) {
    const city = req.body.city;
    const apiKey = "c540d5739e3f502bbd9118e07c6d2848";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    https.get(url, function (response) {
        response.on("data", function (data) {
            try {
                const weather = JSON.parse(data);

                if (weather.cod !== 200) {
                    return res.send(`<h3 style="text-align:center;">City not found. Please go back and try again.</h3>`);
                }

                const tempr = weather.main.temp;
                const wethd = weather.weather[0].description;
                const icon = weather.weather[0].icon;
                const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                res.send(renderPage(city, tempr, wethd, imageURL));
            } catch (error) {
                res.send(`<h3 style="text-align:center;">Error processing request. Try again.</h3>`);
            }
        });
    });
});

// Start the Express server
app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});
