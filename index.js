const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import or define mock data generator
const generateMockProperties = (count = 10) => {
    const propertyTypes = ['Houses', 'Condos', 'Land', 'Apartments'];
    const locations = ['La Paz City', 'El Centenario', 'San Pedro', 'La Ventana'];
    const features = ['Ocean View', 'Beachfront', 'Pool', 'Garage', 'Furnished', 'Gated'];
    
    return Array.from({ length: count }, (_, i) => {
        const id = `prop-${1000 + i}`;
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const price = Math.floor(Math.random() * 900000) + 100000;
        const beds = Math.floor(Math.random() * 5) + 1;
        const baths = Math.floor(Math.random() * 4) + 1;
        const sqft = Math.floor(Math.random() * 2000) + 500;
        
        // Generate random latitude and longitude near La Paz
        const latitude = 24.1426 + (Math.random() - 0.5) * 0.05;
        const longitude = -110.3127 + (Math.random() - 0.5) * 0.05;
        
        // Random features
        const randomFeatures = {};
        features.forEach(feature => {
            randomFeatures[feature] = Math.random() > 0.5;
        });
        
        return {
            id,
            propertytypelabel: propertyType,
            mlsareamajor: location,
            subdivisionname: `${location} Subdivision ${i % 3 + 1}`,
            streetadditionalinfo: `Beautiful ${propertyType.slice(0, -1)} in ${location}`,
            currentpricepublic: price,
            bedstotal: beds,
            bathroomstotaldecimal: baths,
            buildingareatotal: sqft,
            latitude,
            longitude,
            unparsedaddress: `${1000 + i} Main St, ${location}`,
            publicremarks: `Wonderful ${propertyType.slice(0, -1)} with ${beds} bedrooms and ${baths} bathrooms in the heart of ${location}. Great opportunity!`,
            yearbuilt: 2010 + Math.floor(Math.random() * 14),
            photos: [
                {
                    Uri300: 'https://via.placeholder.com/300x200?text=Property+Image',
                    Uri800: 'https://via.placeholder.com/800x600?text=Property+Image',
                    Uri1600: 'https://via.placeholder.com/1600x1200?text=Property+Image'
                }
            ],
            interiorfeatures: JSON.stringify({
                'Furnished': randomFeatures.Furnished,
                'Air Conditioning': Math.random() > 0.3,
                'Ceiling Fan': Math.random() > 0.4
            }),
            exteriorfeatures: JSON.stringify({
                'Ocean View': randomFeatures['Ocean View'],
                'Beachfront': randomFeatures.Beachfront,
                'Pool': randomFeatures.Pool,
                'Garage': randomFeatures.Garage,
                'Gated': randomFeatures.Gated
            }),
            majorchangetype: Math.random() > 0.8 ? 'New Listing' : 'Price Change'
        };
    });
};

// Generate some mock properties
const MOCK_PROPERTIES = generateMockProperties(20);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for development
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

// Search endpoint that uses mock data
app.post("/search", (req, res) => {
  console.log("Search request received:", req.body);
  const filters = req.body;
  
  // Apply simple filtering to mock data
  let filteredProperties = [...MOCK_PROPERTIES];
  
  // Filter by property type
  if (filters.propertyType) {
    filteredProperties = filteredProperties.filter(property => 
      property.propertytypelabel === filters.propertyType
    );
  }
  
  // Filter by location
  if (filters.location) {
    filteredProperties = filteredProperties.filter(property => 
      property.mlsareamajor === filters.location
    );
  }
  
  // Filter by price range
  if (filters.priceRange) {
    const [minStr, maxStr] = filters.priceRange.split('-');
    const min = parseInt(minStr);
    const max = maxStr ? parseInt(maxStr) : Infinity;
    
    filteredProperties = filteredProperties.filter(property => {
      const price = parseInt(property.currentpricepublic);
      return price >= min && price <= max;
    });
  }
  
  // Return filtered results
  res.json({
    total: filteredProperties.length,
    data: filteredProperties
  });
});

// Property details endpoint
app.get("/search/properties/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Property request for ID: ${id}`);
  
  // Find the property in our mock data
  const property = MOCK_PROPERTIES.find(prop => prop.id === id);
  
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
