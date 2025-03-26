// mockData.js - Add this to your project for testing

// A function to generate mock property data
function generateMockProperties(count = 10) {
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
}

// Export if in Node environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateMockProperties };
}

// Make it available in browser context
if (typeof window !== 'undefined') {
    window.generateMockProperties = generateMockProperties;
}
