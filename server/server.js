import express from "express";
import { promises as fs } from "fs";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser"; // ✅ Needed for handling session cookies
import FileStorePkg from "session-file-store"; // ✅ Correct import for session-file-store

const FileStore = FileStorePkg(session); // ✅ Correct initialization
const app = express();

/* ---------------------- ✅ Correct Middleware Order ---------------------- */

// ✅ 1. CORS must be first to allow frontend requests with credentials
app.use(cors({
    origin: "http://localhost:5173", // ✅ Match frontend
    credentials: true, // ✅ Allow cookies (sessions)
}));

// ✅ 2. Parse cookies before using session middleware
app.use(cookieParser());

// ✅ 3. Initialize session storage with a persistent file store
app.use(session({
    secret: "your_secret_key", // ⚠️ Change in production
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: "./sessions", // ✅ Ensure session persistence
        retries: 3,
        ttl: 86400 // ✅ Keep sessions for 1 day
    }),
    cookie: {
        secure: false, // ❌ Set to true ONLY if using HTTPS
        httpOnly: true,
        sameSite: "lax"
    }
}));

// ✅ 4. Parse incoming JSON requests
app.use(express.json());

/* ---------------------- ✅ File Paths ---------------------- */
const FILE_PATHS = {
    users: "data/users.json",
    cities: "data/cities.json",
    flights: "data/flights.json",
    hotels: "data/hotels.json",
    attractions: "data/attractions.json"
};

/* ---------------------- ✅ Helper Functions ---------------------- */
const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, "utf8");
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

/* ---------------------- ✅ Authentication Routes ---------------------- */

// **Register User**
app.post("/users", async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);
        const { id, username, email, password } = req.body;

        if (users.some(user => user.username === username || user.email === email)) {
            return res.status(400).json({ error: "Username or email already taken" });
        }

        const newUser = { id, username, email, password };
        users.push(newUser);
        await writeJsonFile(FILE_PATHS.users, users);

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// **Login Route**
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const users = await readJsonFile(FILE_PATHS.users);

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage || null
        };

        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Session save failed" });
            }
            console.log("🔥 Session after login:", req.session);
            res.json({ message: `Welcome ${user.username}!`, user: req.session.user });
        });
    } else {
        res.status(401).json({ error: "Invalid authentication" });
    }
});

// **Get User Session**
app.get("/user", (req, res) => {
    console.log("🔥 Checking Session Data:", req.session);
    console.log("🔑 Session ID:", req.sessionID);
    console.log("🔍 Cookies Received:", req.cookies);

    if (!req.session || !req.session.user) {
        console.log("❌ No active user session detected.");
        return res.status(401).json({ error: "User not logged in" });
    }

    console.log("✅ User session found:", req.session.user);
    res.json(req.session.user);
});


// **Logout Route**
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie("connect.sid", { path: "/" }); // ✅ Ensure session cookie is deleted
        res.json({ message: "Logged out successfully" });
    });
});

/* ---------------------- ✅ Additional Routes ---------------------- */

// **Delete User**
app.delete("/users/:id", async (req, res) => {
    const users = await readJsonFile(FILE_PATHS.users);
    const { id } = req.params;

    const updatedUsers = users.filter(user => user.id !== parseInt(id));
    if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: "User not found" });
    }

    await writeJsonFile(FILE_PATHS.users, updatedUsers);
    res.json({ message: `User with ID ${id} deleted successfully.` });
});

// **City Routes**
app.get("/cities", async (req, res) => {
    const cities = await readJsonFile(FILE_PATHS.cities);
    res.json(cities);
});

// **Flights Routes**
app.get("/flights/:city", async (req, res) => {
    const { city } = req.params;
    const flights = await readJsonFile(FILE_PATHS.flights);

    const flightInfo = flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase());
    flightInfo.length > 0
        ? res.json(flightInfo)
        : res.status(404).json({ error: `No flights found for ${city}.` });
});

// **Hotel Routes**
app.get("/validateHotel/:city", async (req, res) => {
    const { city } = req.params;
    const hotels = await readJsonFile(FILE_PATHS.hotels);

    const cityHotels = hotels.find(h => h.city.toLowerCase() === city.toLowerCase());
    cityHotels
        ? res.json(cityHotels.hotels)
        : res.status(404).json({ error: `No hotels found for ${city}.` });
});

// **Attractions Routes**
app.get("/attractions/:city", async (req, res) => {
    const { city } = req.params;
    const attractions = await readJsonFile(FILE_PATHS.attractions);

    const cityAttractions = attractions.find(a => a.city.toLowerCase() === city.toLowerCase());
    cityAttractions
        ? res.json(cityAttractions.attractions)
        : res.status(404).json({ error: `No attractions found for ${city}.` });
});

// **Extra Routes**
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

/* ---------------------- ✅ Start the Server ---------------------- */
app.listen(4000, () => {
    console.log("✅ Server is running on http://localhost:4000");
});
