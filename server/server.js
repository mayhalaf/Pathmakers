import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const FILE_PATHS = {
    users: 'data/users.json',
    cities: 'data/cities.json',
    flights: 'data/flights.json',
    hotels: 'data/hotels.json',
    attractions: 'data/attractions.json'
};

// **Helper Functions for File Operations**
const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

const writeJsonFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
    }
};

// **User Routes**
app.get('/users', async (req, res) => {
    const users = await readJsonFile(FILE_PATHS.users);
    res.json(users);
});
app.get('/user', async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);

        // Simulating a logged-in user (You may replace this logic with authentication)
        const user = users.length > 0 ? users[0] : null;

        if (user) {
            res.json({
                username: user.username,
                profileImage: user.profileImage || null, // Add a profile image if available
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user data' });
    }
});


app.post('/users', async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);
        const { id, username, email, password } = req.body;

        // Check if username or email already exists
        if (users.some(user => user.username === username || user.email === email)) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }

        // Add the new user
        const newUser = { id, username, email, password };
        users.push(newUser);
        await writeJsonFile(FILE_PATHS.users, users);

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});



app.get("/user", async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);

        // Simulating an active logged-in user (fetch first user for now)
        const user = users.length > 0 ? users[0] : null;

        if (user) {
            res.json({
                username: user.username,
                email: user.email,
                profileImage: user.profileImage || null,
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user data" });
    }
});


app.delete('/users/:id', async (req, res) => {
    const users = await readJsonFile(FILE_PATHS.users);
    const { id } = req.params;

    const updatedUsers = users.filter(user => user.id !== parseInt(id));
    if (users.length === updatedUsers.length) return res.status(404).json({ error: 'User not found' });

    await writeJsonFile(FILE_PATHS.users, updatedUsers);
    res.json({ message: `User with ID ${id} deleted successfully.` });
});

// **Login Route**
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await readJsonFile(FILE_PATHS.users);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({
            message: `Welcome ${user.username}!`,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage || null // Include profile image if available
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid authentication' });
    }
});


// **City Routes**
app.get('/cities', async (req, res) => {
    const cities = await readJsonFile(FILE_PATHS.cities);
    res.json(cities);
});

app.get('/validateCity/:city', async (req, res) => {
    const { city } = req.params;
    const cities = await readJsonFile(FILE_PATHS.cities);

    cities.includes(city)
        ? res.json({ message: `Destination ${city} is valid.` })
        : res.status(404).json({ error: `Destination ${city} is not valid.` });
});

// **Flights Routes**
app.get('/flights/:city', async (req, res) => {
    const { city } = req.params;
    const flights = await readJsonFile(FILE_PATHS.flights);

    const flightInfo = flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase());
    flightInfo.length > 0
        ? res.json(flightInfo)
        : res.status(404).json({ error: `No flights found for ${city}.` });
});

// **Hotel Routes**
app.get('/validateHotel/:city', async (req, res) => {
    const { city } = req.params;
    const hotels = await readJsonFile(FILE_PATHS.hotels);

    const cityHotels = hotels.find(h => h.city.toLowerCase() === city.toLowerCase());
    cityHotels
        ? res.json(cityHotels.hotels)
        : res.status(404).json({ error: `No hotels found for ${city}.` });
});

// **Attractions Routes**
app.get('/attractions/:city', async (req, res) => {
    const { city } = req.params;
    const attractions = await readJsonFile(FILE_PATHS.attractions);

    const cityAttractions = attractions.find(a => a.city.toLowerCase() === city.toLowerCase());
    cityAttractions
        ? res.json(cityAttractions.attractions)
        : res.status(404).json({ error: `No attractions found for ${city}.` });
});

// **Enhanced Attractions Route**
app.get('/attractions', async (req, res) => {
    try {
        const attractions = await readJsonFile(FILE_PATHS.attractions);
        res.json(attractions);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch attractions' });
    }
});

// **Enhanced Flights Route**
app.get('/flights', async (req, res) => {
    try {
        const flights = await readJsonFile(FILE_PATHS.flights);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch flights' });
    }
});

// **Enhanced Hotels Route**
app.get('/hotels', async (req, res) => {
    try {
        const hotels = await readJsonFile(FILE_PATHS.hotels);
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch hotels' });
    }
});

// **Enhanced Cities Route**
app.get('/all-cities', async (req, res) => {
    try {
        const cities = await readJsonFile(FILE_PATHS.cities);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch cities' });
    }
});

// **Start the Server**
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
app.get("/payment-options", async (req, res) => {
    res.json([
        { id: 1, type: "Credit Card", accepted: true },
        { id: 2, type: "PayPal", accepted: true },
        { id: 3, type: "Bitcoin", accepted: false }
    ]);
});

app.get("/transportation", async (req, res) => {
    res.json([
        { id: 1, method: "Car Rental", available: true },
        { id: 2, method: "Train", available: true },
        { id: 3, method: "Bike Rental", available: false }
    ]);
});
