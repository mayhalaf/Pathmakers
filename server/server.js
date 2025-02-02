import express from "express";
import fs from "fs";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser"; // ✅ Needed for handling session cookies
import FileStorePkg from "session-file-store"; // ✅ Correct import for session-file-store

const FileStore = FileStorePkg(session); // ✅ Correct initialization
const app = express();

/* ---------------------- ✅ Correct Middleware Order ---------------------- */

// ✅ 1. CORS must be first to allow frontend requests with credentials
// In your server code (Express)
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"], // Add all possible frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: "./sessions",
        retries: 3,
        ttl: 86400
    }),
    cookie: {
        secure: false, // Keep false for development
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
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
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`File ${filePath} does not exist. Creating empty file.`);
            await fs.promises.writeFile(filePath, JSON.stringify([], null, 2));
            return [];
        }

        const data = await fs.promises.readFile(filePath, "utf8");
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
// Check if data directory exists, if not create it
const dataPath = "./data";
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

// Add this check in your server.js
const ensureFileExists = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

ensureFileExists(FILE_PATHS.users);
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
    
    console.log("Login attempt for username:", username);
    
    if (!username || !password) {
        console.log("Missing username or password");
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const users = await readJsonFile(FILE_PATHS.users);
        console.log("Found users:", users.length);
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            console.log("Invalid credentials for username:", username);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("User found:", user.username);

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage || null
        };

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Session save failed" });
            }
            
            console.log("Session saved successfully");
            res.json({ 
                message: `Welcome ${user.username}!`,
                user: req.session.user 
            });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

// **Get User Session**
app.get("/user", (req, res) => {
    console.log("🔥 Checking Session Data:", req.session);
    console.log("🔑 Session ID:", req.sessionID);
    console.log("🔍 Cookies Received:", req.cookies);

    // Check if the session exists in the session store
    fs.readdir("./sessions", (err, files) => {
        if (err) {
            console.error("⚠️ Error reading session store:", err);
        } else {
            console.log("📂 Stored Sessions:", files);
        }
    });

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
// At the top of your file, after FILE_PATHS definition
const initializeUserData = () => {
    if (!fs.existsSync(FILE_PATHS.users)) {
        const initialUsers = [
            {
                id: 1,
                username: "admin",
                email: "admin@example.com",
                password: "admin123",
                profileImage: null
            }
        ];
        fs.writeFileSync(FILE_PATHS.users, JSON.stringify(initialUsers, null, 2));
    }
};

// Call this after creating the data directory
initializeUserData();
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
