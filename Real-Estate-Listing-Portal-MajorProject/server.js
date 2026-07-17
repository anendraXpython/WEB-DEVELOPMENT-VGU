const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { ObjectId } = require("mongodb");
const { connectDB, getDB } = require("./database.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public")); 

function distanceInKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


app.post("/api/login", async (req, res) => {
  try {
    const db = getDB();
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const existingUser = await db.collection("users").findOne({ username: username });

    if (existingUser) {
      if (existingUser.email !== email) {
        return res.status(400).json({ error: "That name is already registered with a different email." });
      }
    } else {
      await db.collection("users").insertOne({
        username: username,
        email: email,
        createdAt: new Date()
      });
    }

    res.json({ success: true, username: username });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ error: "Something went wrong while logging in." });
  }
});


app.get("/api/listings", async (req, res) => {
  const db = getDB();
  const { location, minPrice, maxPrice, beds } = req.query;

  const filter = {};

  if (location) {
    filter.location = { $regex: location, $options: "i" }; // case-insensitive match
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (beds) {
    filter.beds = { $gte: Number(beds) };
  }

  const listings = await db.collection("listings").find(filter).toArray();
  res.json(listings);
});


app.get("/api/listings/near", async (req, res) => {
  const db = getDB();
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radiusKm) || 5;

  const allListings = await db.collection("listings").find({}).toArray();

  const nearby = allListings
    .map((item) => {
      const distance = distanceInKm(lat, lng, item.lat, item.lng);
      return Object.assign({}, item, { distanceKm: Number(distance.toFixed(2)) });
    })
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(nearby);
});


app.get("/api/listings/:id", async (req, res) => {
  try {
    const db = getDB();
    const listing = await db.collection("listings").findOne({ _id: new ObjectId(req.params.id) });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: "Invalid listing id" });
  }
});


app.post("/api/contact", async (req, res) => {
  const db = getDB();
  const { listingId, name, email, message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const result = await db.collection("messages").insertOne({
    listingId: listingId || null,
    name: name || "",
    email: email || "",
    message: message,
    createdAt: new Date()
  });

  res.json({ success: true, id: result.insertedId });
});

app.get("/api/messages", async (req, res) => {
  const db = getDB();
  const messages = await db.collection("messages").find({}).sort({ createdAt: -1 }).toArray();
  res.json(messages);
});



app.post("/api/calculations", async (req, res) => {
  const db = getDB();
  const { username, listingId, listingTitle, price, rate, years, monthlyPayment, totalPayable } = req.body;

  const result = await db.collection("calculations").insertOne({
    username: username || "guest",
    listingId: listingId || null,
    listingTitle: listingTitle || null,
    price: price,
    rate: rate,
    years: years,
    monthlyPayment: monthlyPayment,
    totalPayable: totalPayable,
    createdAt: new Date()
  });

  res.json({ success: true, id: result.insertedId });
});

app.get("/api/calculations", async (req, res) => {
  const db = getDB();
  const calculations = await db.collection("calculations").find({}).sort({ createdAt: -1 }).toArray();
  res.json(calculations);
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", async (data) => {
    const db = getDB();
    await db.collection("messages").insertOne({
      listingId: data.listingId || null,
      name: data.name || "Buyer",
      email: "",
      message: data.text,
      createdAt: new Date()
    });

    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


const PORT = 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Nestly server running at http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.log("");
    console.log("Could not connect to MongoDB.");
    console.log("Make sure MongoDB Community Server is installed and running");
    console.log("(MongoDB Compass alone is only the viewer, not the database engine).");
    console.log("Error details:", error.message);
  });
