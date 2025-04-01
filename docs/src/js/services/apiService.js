// src/js/services/apiService.js
//const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://mls-search-interface-6528ddc13a39.herokuapp.com/search';

const ApiService = {
    /**
     * Busca propiedades según los filtros proporcionados
     * @param {Object} filters - Objeto con los filtros de búsqueda
     * @returns {Promise<{total: number, properties: Array}>}
     */
    async searchProperties(filters = {}) {
        try {
            console.log(`fetching this - ${API_BASE_URL}`);
            console.log('with filters:');
            console.log(filters);
    
            // Crear una copia de los filtros para modificarla si es necesario
            const apiFilters = { ...filters };
            
            // Asegurarnos que los valores de ubicación sean exactamente como los espera el backend
            // Mapa de corrección de ubicaciones
            const locationMap = {
                "El Centenario": "El Centenario",
                "La Paz City": "La Paz City",
                "La Ventana": "La Ventana",
                "San Pedro": "San Pedro",
                // Agrega más mapeos según sea necesario
            };
            
            // Corregir la ubicación si existe en nuestro mapa
            if (apiFilters.location && locationMap[apiFilters.location]) {
                console.log(`Normalizando ubicación de "${apiFilters.location}" a "${locationMap[apiFilters.location]}"`);
            }
            
            // Limpiar arrays de ubicación
            if (apiFilters.locationArray) {
                delete apiFilters.locationArray;
            }
            
            // Convertir los filtros de checkboxes a booleanos si es necesario
            // Algunos APIs esperan true/false en lugar de valores de texto
            if (apiFilters.virtualTour === 'virtualTour') {
                apiFilters.virtualTour = true;
            }
            
            // Hacer lo mismo para otros checkboxes si es necesario
            ['openHouse', 'beachfront', 'oceanView', 'pool', 'cfe', 
             'furnished', 'garage', 'gated', 'petFriendly', 
             'newListing', 'priceReduced'].forEach(checkbox => {
                if (apiFilters[checkbox] === checkbox) {
                    apiFilters[checkbox] = true;
                }
            });
    
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiFilters)
            });
    
            if (!response.ok) {
                console.error(`Error en la respuesta HTTP: ${response.status} ${response.statusText}`);
                throw new Error('Error al buscar propiedades');
            }
    
            const data = await response.json();
            console.log('return data is:');
            console.log(data.data);
            return {
                total: data.total || 0,
                properties: data.data || []
            };
        } catch (error) {
            console.error('Error en la búsqueda de propiedades:', error);
            throw error;
        }
    },

    /**
     * Obtiene una propiedad específica por su ID
     * @param {string} id - ID de la propiedad
     * @returns {Promise<Object>}
     */
    async getProperty(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`);
            
            if (!response.ok) {
                throw new Error('Propiedad no encontrada');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener la propiedad:', error);
            throw error;
        }
    }
};

// Exportar para uso global
window.ApiService = ApiService;