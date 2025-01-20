import express from 'express';
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());  // Middleware לפרסינג של בקשות JSON

// פונקציה לקרוא קובץ JSON
const getFileData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        console.log(`Data from ${filePath}:`, data); // הדפסת תוכן הקובץ
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        throw new Error(`Unable to read file: ${filePath}`);
    }
};

// פונקציות לקרוא את הנתונים
const getUsers = async () => getFileData('data/users.json');
const getCities = async () => getFileData('data/cities.json');
const getFlights = async () => getFileData('data/flights.json');
const getHotels = async () => getFileData('data/hotels.json'); 
const getAttractions = async () => getFileData('data/attractions.json');


// Route לקרוא את כל המשתמשים
app.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route לאימות משתמש
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.json({ message: `Welcome ${user.username}!` });
        } else {
            res.status(401).json({ error: 'Invalid authentication' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error during login process' });
    }
});

// Route לקרוא את הערים
app.get('/cities', async (req, res) => {
    try {
        const cities = await getCities();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch cities' });
    }
});

// Route לאימות עיר
app.get('/validateCity/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const cities = await getCities();

        if (cities.some(c => c.toLowerCase() === city.toLowerCase())) {
            res.json({ message: `Destination ${city} is valid.` });
        } else {
            res.status(404).json({ error: `Destination ${city} is not valid.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to validate city' });
    }
});

// Route לקרוא טיסות לעיר מסוימת
app.get('/flights/:city', async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`Fetching flights for: ${city}`);

        const flights = await getFlights();
        console.log('Flights data:', flights);

        if (!flights || flights.length === 0) {
            console.error('No flight data available.');
            return res.status(500).json({ error: 'No flight data available.' });
        }

        const flightInfo = flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase());

        if (flightInfo.length > 0) {
            console.log(`Flights found for ${city}:`, flightInfo);
            res.json(flightInfo);
        } else {
            console.warn(`No flights found for ${city}.`);
            res.status(404).json({ error: `No flights found for ${city}.` });
        }
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ error: 'Unable to fetch flight information' });
    }
});

app.get('/validateHotel/:city', async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`Searching hotels in: ${city}`);

        const hotels = await getHotels(); // משתמש בפונקציה שכבר הגדרנו למעלה

        if (!hotels || hotels.length === 0) {
            console.error('No hotel data available.');
            return res.status(500).json({ error: 'No hotel data available.' });
        }

        // חיפוש המלונות בעיר
        const cityHotels = hotels.find(h => h.city.toLowerCase() === city.toLowerCase());

        if (cityHotels) {
            console.log(`Hotels found for ${city}:`, cityHotels.hotels);
            return res.json(cityHotels.hotels);
        } else {
            console.warn(`No hotels found for ${city}.`);
            return res.status(404).json({ error: `No hotels found for ${city}.` });
        }
    } catch (error) {
        console.error('Error processing hotel request:', error);
        res.status(500).json({ error: 'Unable to process hotel information' });
    }
});




// נוסיף route חדש לקבלת אטרקציות לפי עיר
app.get('/attractions/:city', async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`Searching attractions in: ${city}`);

        const attractions = await getAttractions();

        if (!attractions || !attractions.attractions || attractions.attractions.length === 0) {
            console.error('No attractions data available.');
            return res.status(500).json({ error: 'No attractions data available.' });
        }

        // חיפוש האטרקציות בעיר
        const cityAttractions = attractions.attractions.find(
            a => a.city.toLowerCase() === city.toLowerCase()
        );

        if (cityAttractions) {
            console.log(`Attractions found for ${city}:`, cityAttractions.attractions);
            return res.json(cityAttractions.attractions);
        } else {
            console.warn(`No attractions found for ${city}.`);
            return res.status(404).json({ error: `No attractions found for ${city}.` });
        }
    } catch (error) {
        console.error('Error processing attractions request:', error);
        res.status(500).json({ error: 'Unable to process attractions information' });
    }
});

// הפעלת השרת
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
