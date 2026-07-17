const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "nestlyDB";

const client = new MongoClient(MONGO_URI);
let db = null;

async function connectDB() {
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB - database: " + DB_NAME);

  const listingsCount = await db.collection("listings").countDocuments();

  if (listingsCount === 0) {
    const sampleListings = [
      {
        title: "Maple Court Bungalow",
        location: "Rowanwood",
        price: 385000,
        beds: 3,
        baths: 2,
        sqft: 1450,
        lat: 26.9124,
        lng: 75.7873,
        description: "A single-storey bungalow on a quiet cul-de-sac with a renovated kitchen.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "The Elmhurst Loft",
        location: "Elm District",
        price: 612000,
        beds: 2,
        baths: 2,
        sqft: 1180,
        lat: 26.9200,
        lng: 75.8000,
        description: "Converted warehouse loft with exposed brick and 11-foot ceilings.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "Birchwood Family Home",
        location: "Rowanwood",
        price: 745000,
        beds: 4,
        baths: 3,
        sqft: 2400,
        lat: 26.9050,
        lng: 75.7900,
        description: "Two-storey home with a finished basement and double garage.",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "Harborview Apartment",
        location: "Old Harbor",
        price: 528000,
        beds: 2,
        baths: 1,
        sqft: 980,
        lat: 26.9300,
        lng: 75.8100,
        description: "Top-floor apartment with a partial water view and in-unit laundry.",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "Cedarbrook Cottage",
        location: "Elm District",
        price: 299000,
        beds: 1,
        baths: 1,
        sqft: 720,
        lat: 26.9180,
        lng: 75.7950,
        description: "A compact starter home with a wood-burning stove and small garden.",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "Sycamore Grove Villa",
        location: "Old Harbor",
        price: 899000,
        beds: 5,
        baths: 4,
        sqft: 3100,
        lat: 26.9350,
        lng: 75.8050,
        description: "A grand villa with a private pool and gated driveway.",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=500&q=60"
      }
    ];

    await db.collection("listings").insertMany(sampleListings);
    console.log("Sample listings added to MongoDB.");
  }

  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected yet. Call connectDB() first.");
  }
  return db;
}

module.exports = { connectDB, getDB };
