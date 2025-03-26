// src/js/services/apiService.js

// Update this to match your actual API URL
// For local development use:
const API_BASE_URL = 'http://localhost:3000';
// For deployment use your Heroku URL:
// const API_BASE_URL = 'https://mls-search-interface-6528ddc13a39.herokuapp.com';

const ApiService = {
    /**
     * Searches properties based on provided filters
     * @param {Object} filters - Search filter object
     * @returns {Promise<{total: number, properties: Array}>}
     */
    async searchProperties(filters = {}) {
        try {
            console.log(`Fetching from ${API_BASE_URL}/search`);
            console.log('With filters:', filters);
    
            // Create a copy of filters for possible modifications
            const apiFilters = { ...filters };
            
            const response = await fetch(`${API_BASE_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiFilters)
            });
    
            if (!response.ok) {
                console.error(`HTTP Error: ${response.status} ${response.statusText}`);
                throw new Error(`Error searching properties: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Response data:', data);
            
            // Ensure consistent response format
            return {
                total: data.total || 0,
                properties: data.data || []
            };
        } catch (error) {
            console.error('API search error:', error);
            // Return empty result instead of throwing to prevent UI from breaking
            return {
                total: 0,
                properties: []
            };
        }
    },

    /**
     * Gets a specific property by ID
     * @param {string} id - Property ID
     * @returns {Promise<Object>}
     */
    async getProperty(id) {
        try {
            // Make sure your endpoint format matches what your server expects
            const response = await fetch(`${API_BASE_URL}/search/properties/${id}`);
            
            if (!response.ok) {
                console.warn(`Property not found: ${id}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching property:', error);
            return null;
        }
    }
};

// Export for global use
window.ApiService = ApiService;
