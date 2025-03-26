const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for development - restrict this in production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve generated files from root directory
app.use(express.static(__dirname));

// Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Mock search endpoint for testing
app.post("/search", (req, res) => {
  console.log("Search request received:", req.body);
  
  // Send a mock empty response for now
  res.json({
    total: 0,
    data: []
  });
});

// Property details endpoint
app.get("/search/properties/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Property request for ID: ${id}`);
  
  // Return a 404 if ID doesn't exist in your data
  res.status(404).json({ error: "Property not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
