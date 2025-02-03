import express from "express";
import fs from "fs";
import cors from "cors";

// const app = express();
// const express = require('express');
// const cors = require('cors');

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4000", "http://127.0.0.1:5173"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

const FILE_PATHS = {
    users: "data/users.json",
    cities: "data/cities.json",
    flights: "data/flights.json",
    hotels: "data/hotels.json",
    attractions: "data/attractions.json"
};

const readJsonFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            await fs.promises.writeFile(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = await fs.promises.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJsonFile = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {}
};

const dataPath = "./data";
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

const ensureFileExists = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

ensureFileExists(FILE_PATHS.users);

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

app.get("/users", async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);

        res.status(200).json({ message: "ok", users });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const users = await readJsonFile(FILE_PATHS.users);
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({ 
            message: `Welcome ${user.username}!`,
            user: { id: user.id, username: user.username, email: user.email, profileImage: user.profileImage || null }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during login" });
    }
});

const initializeUserData = () => {
    if (!fs.existsSync(FILE_PATHS.users)) {
        const initialUsers = [{ id: 1, username: "admin", email: "admin@example.com", password: "admin123", profileImage: null }];
        fs.writeFileSync(FILE_PATHS.users, JSON.stringify(initialUsers, null, 2));
    }
};

initializeUserData();

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

app.get("/cities", async (req, res) => {
    const cities = await readJsonFile(FILE_PATHS.cities);
    res.json(cities);
});

app.get("/flights/:city", async (req, res) => {
    const { city } = req.params;
    const flights = await readJsonFile(FILE_PATHS.flights);
    res.json(flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase()));
});

app.get("/validateHotel/:city", async (req, res) => {
    const { city } = req.params;
    const hotels = await readJsonFile(FILE_PATHS.hotels);
    res.json(hotels.find(h => h.city.toLowerCase() === city.toLowerCase())?.hotels || []);
});

app.get("/attractions/:city", async (req, res) => {
    const { city } = req.params;
    const attractions = await readJsonFile(FILE_PATHS.attractions);
    res.json(attractions.find(a => a.city.toLowerCase() === city.toLowerCase())?.attractions || []);
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
