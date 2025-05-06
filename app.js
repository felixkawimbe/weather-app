import express from 'express';
import * as https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the static HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST for weather data
app.post('/', (req, res) => {
    const city = req.body.city;
    const apiKey = "c540d5739e3f502bbd9118e07c6d2848";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    https.get(url, (response) => {
        response.on("data", (data) => {
            try {
                const weather = JSON.parse(data);
                if (weather.cod !== 200) {
                    return res.send(`<h3 style="text-align:center;">City not found. Try again.</h3>`);
                }
                const tempr = weather.main.temp;
                const wethd = weather.weather[0].description;
                const icon = weather.weather[0].icon;
                const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                // Send HTML with weather results OR update via client-side JS
                res.send(`
                    <h2>The temperature in ${city} is ${tempr}°C</h2>
                    <h4>${wethd}</h4>
                    <img src="${imageURL}" />
                    <br><a href="/">Back</a>
                `);
            } catch (e) {
                res.send(`<h3>Error fetching weather. Try again.</h3>`);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
