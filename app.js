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
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', './views');


// Routes
app.get('/', (req, res) => {
    getWeather("Chingola", res);
});

app.post('/', (req, res) => {
    const city = req.body.city;
    getWeather(city, res);
});

// Helper function to fetch weather and render HTML
function getWeather(city, res) {
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

                res.render('index', { city, tempr, wethd, imageURL });
            } catch (e) {
                res.send(`<h3 style="text-align:center;">Error fetching weather. Try again.</h3>`);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
