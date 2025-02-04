import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATHS = {
    users: "data/users.json",
    cities: "data/cities.json",
    flights: "data/flights.json",
    hotels: "data/hotels.json",
    attractions: "data/attractions.json"
};

const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

const readJsonFile = async (filePath) => {
    try {
        if (!(await fileExists(filePath))) {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJsonFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {}
};

const ensureFileExists = async (filePath) => {
    if (!(await fileExists(filePath))) {
        await fs.writeFile(filePath, JSON.stringify([]));
    }
};

await ensureFileExists(FILE_PATHS.users);

app.get("/users", async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving users" });
    }
});

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
app.post("/logout", (req, res) => {
    res.clearCookie("session"); // Adjust based on your auth method
    res.json({ message: "Logged out successfully" });
});

app.delete("/users/:id", async (req, res) => {
    try {
        const users = await readJsonFile(FILE_PATHS.users);
        const { id } = req.params;
        const updatedUsers = users.filter(user => user.id !== parseInt(id));

        if (users.length === updatedUsers.length) {
            return res.status(404).json({ error: "User not found" });
        }

        await writeJsonFile(FILE_PATHS.users, updatedUsers);
        res.json({ message: `User with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

app.get("/cities", async (req, res) => {
    const cities = await readJsonFile(FILE_PATHS.cities);
    res.json(cities);
});

app.get("/flights/:city", async (req, res) => {
    try {
        const { city } = req.params;
        const flights = await readJsonFile(FILE_PATHS.flights);

        if (!flights || flights.length === 0) {
            return res.status(404).json({ error: "Flights data not found" });
        }

        const filteredFlights = flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase());
        
        if (filteredFlights.length === 0) {
            return res.status(404).json({ error: `No flights found for city: ${city}` });
        }

        res.json(filteredFlights);
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/hotels/:city', async (req, res) => {
    const { city } = req.params;
    try {
        const hotelsData = await readJsonFile(FILE_PATHS.hotels);
        const cityHotels = hotelsData.find(cityData => cityData.city.toLowerCase() === city.toLowerCase());
        if (cityHotels) {
            res.json(cityHotels.hotels);
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching hotels' });
    }
});

app.get('/attractions/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const attractionsData = await readJsonFile(FILE_PATHS.attractions);
        const attractionsInCity = attractionsData.find(cityData => cityData.city === city);

        if (attractionsInCity) {
            res.json(attractionsInCity.attractions);
        } else {
            res.status(500).send('Error fetching attractions');
        }
    } catch (error) {
        console.error("Error fetching attractions:", error);
        res.status(500).json({ error: "Server error" });
    }
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




















// import express from "express";
// import fs from "fs/promises";
// import cors from "cors";

// const app = express();

// app.use(cors());
// app.use(express.json());

// const FILE_PATHS = {
//     users: "data/users.json",
//     cities: "data/cities.json",
//     flights: "data/flights.json",
//     hotels: "data/hotels.json",
//     attractions: "data/attractions.json"
// };

// const fileExists = async (filePath) => {
//     try {
//         await fs.access(filePath);
//         return true;
//     } catch {
//         return false;
//     }
// };

// const readJsonFile = async (filePath) => {
//     try {
//         if (!(await fileExists(filePath))) {
//             await fs.writeFile(filePath, JSON.stringify([], null, 2));
//             return [];
//         }
//         const data = await fs.readFile(filePath, "utf8");
//         return JSON.parse(data);
//     } catch (error) {
//         return [];
//     }
// };

// const writeJsonFile = async (filePath, data) => {
//     try {
//         await fs.writeFile(filePath, JSON.stringify(data, null, 2));
//     } catch (error) {}
// };

// const ensureFileExists = async (filePath) => {
//     if (!(await fileExists(filePath))) {
//         await fs.writeFile(filePath, JSON.stringify([]));
//     }
// };

// await ensureFileExists(FILE_PATHS.users);

// app.get("/users", async (req, res) => {
//     try {
//         const users = await readJsonFile(FILE_PATHS.users);
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: "Error retrieving users" });
//     }
// });

// app.post("/users", async (req, res) => {
//     try {
//         const users = await readJsonFile(FILE_PATHS.users);
//         const { id, username, email, password } = req.body;

//         if (users.some(user => user.username === username || user.email === email)) {
//             return res.status(400).json({ error: "Username or email already taken" });
//         }

//         const newUser = { id, username, email, password };
//         users.push(newUser);
//         await writeJsonFile(FILE_PATHS.users, users);

//         res.status(201).json({ message: "User registered successfully", user: newUser });
//     } catch (error) {
//         res.status(500).json({ error: "Error registering user" });
//     }
// });

// app.post("/login", async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         return res.status(400).json({ error: "Username and password are required" });
//     }

//     try {
//         const users = await readJsonFile(FILE_PATHS.users);
//         const user = users.find(u => u.username === username && u.password === password);

//         if (!user) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         res.json({ 
//             message: `Welcome ${user.username}!`,
//             user: { id: user.id, username: user.username, email: user.email, profileImage: user.profileImage || null }
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Server error during login" });
//     }
// });

// app.delete("/users/:id", async (req, res) => {
//     try {
//         const users = await readJsonFile(FILE_PATHS.users);
//         const { id } = req.params;
//         const updatedUsers = users.filter(user => user.id !== parseInt(id));

//         if (users.length === updatedUsers.length) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         await writeJsonFile(FILE_PATHS.users, updatedUsers);
//         res.json({ message: `User with ID ${id} deleted successfully.` });
//     } catch (error) {
//         res.status(500).json({ error: "Error deleting user" });
//     }
// });



// app.get("/cities", async (req, res) => {
//     const cities = await readJsonFile(FILE_PATHS.cities);
//     res.json(cities);
// });

// app.get("/flights/:city", async (req, res) => {
//     const { city } = req.params;
//     const flights = await readJsonFile(FILE_PATHS.flights);
//     res.json(flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase()));
// });
// app.get("/flights/:city", async (req, res) => {
//     try {
//         const { city } = req.params;
//         const flights = await readJsonFile(FILE_PATHS.flights);

//         if (!flights || flights.length === 0) {
//             return res.status(404).json({ error: "Flights data not found" });
//         }

//         const filteredFlights = flights.filter(flight => flight.city.toLowerCase() === city.toLowerCase());
        
//         if (filteredFlights.length === 0) {
//             return res.status(404).json({ error: `No flights found for city: ${city}` });
//         }

//         res.json(filteredFlights);
//     } catch (error) {
//         console.error("Error fetching flights:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });
// app.get('/hotels/:city', (req, res) => {
//     const { city } = req.params;
//     // שלוף את המלונות עבור העיר
//     const hotelsInCity = hotelsData.find(cityData => cityData.city === city);
//     if (hotelsInCity) {
//       res.json(hotelsInCity.hotels);
//     } else {
//       res.status(404).send('City not found');
//     }
//   });
//   app.get('/attractions/:city', (req, res) => {
//     const { city } = req.params;
//     // שלוף את האטרקציות עבור העיר
//     const attractionsInCity = attractionsData.find(cityData => cityData.city === city);
//     if (attractionsInCity) {
//       res.json(attractionsInCity.attractions);
//     } else {
//       res.status(500).send('Error fetching attractions');
//     }
//   });
      
// app.get("/validateHotel/:city", async (req, res) => {
//     try {
//         const { city } = req.params;
//         const hotelsData = await readJsonFile(FILE_PATHS.hotels);

//         if (!hotelsData || hotelsData.length === 0) {
//             return res.status(404).json({ error: "Hotel data not found" });
//         }

//         const cityHotels = hotelsData.find(h => h.city.toLowerCase() === city.toLowerCase());

//         if (!cityHotels) {
//             return res.status(404).json({ error: `No hotels found for city: ${city}` });
//         }

//         res.json(cityHotels.hotels || []);
//     } catch (error) {
//         console.error("Error fetching hotels:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// app.get("/attractions/:city", async (req, res) => {
//     try {
//         const { city } = req.params;
//         const attractionsData = await readJsonFile(FILE_PATHS.attractions);

//         if (!attractionsData || attractionsData.length === 0) {
//             return res.status(404).json({ error: "Attractions data not found" });
//         }

//         const cityAttractions = attractionsData.find(a => a.city.toLowerCase() === city.toLowerCase());

//         if (!cityAttractions) {
//             return res.status(404).json({ error: `No attractions found for city: ${city}` });
//         }

//         res.json(cityAttractions.attractions || []);
//     } catch (error) {
//         console.error("Error fetching attractions:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// // app.get("/validateHotel/:city", async (req, res) => {
// //     const { city } = req.params;
// //     const hotels = await readJsonFile(FILE_PATHS.hotels);
// //     res.json(hotels.find(h => h.city.toLowerCase() === city.toLowerCase())?.hotels || []);
// // });

// app.get("/attractions/:city", async (req, res) => {
//     const { city } = req.params;
//     const attractions = await readJsonFile(FILE_PATHS.attractions);
//     res.json(attractions.find(a => a.city.toLowerCase() === city.toLowerCase())?.attractions || []);
// });

// app.get("/payment-options", async (req, res) => {
//     res.json([
//         { id: 1, type: "Credit Card", accepted: true },
//         { id: 2, type: "PayPal", accepted: true },
//         { id: 3, type: "Bitcoin", accepted: false }
//     ]);
// });

// app.get("/transportation", async (req, res) => {
//     res.json([
//         { id: 1, method: "Car Rental", available: true },
//         { id: 2, method: "Train", available: true },
//         { id: 3, method: "Bike Rental", available: false }
//     ]);
// });


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
