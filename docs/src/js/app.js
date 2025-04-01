let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando app...');
    initApp();
});



const initApp = async () => {
    try {
        showLoadingOverlay();
        APP_STATE.init();
        initializeComponents();
        
        const savedView = StorageService.loadViewPreference();
        changeView(savedView);

        // Initialize with empty results instead of attempting to fetch properties
        updateResults([]);
        updateMarkers([]);

        const params = new URLSearchParams(window.location.search);
        const propertyId = params.get('property');
        
        if (propertyId && propertyId !== 'null') {
            try {
                const property = await ApiService.getProperty(propertyId);
                if (property) {
                    setTimeout(() => {
                        PropertyModal.show(propertyId);
                    }, 1500);
                }
            } catch (error) {
                console.error('Error al cargar la propiedad:', error);
                NotificationService.error('No se pudo cargar la propiedad especificada');
            }
        }

        initialized = true;
    } catch (error) {
        console.error('Error al inicializar la app:', error);
        NotificationService.error('Error al inicializar la aplicación');
    } finally {
        hideLoadingOverlay();
    }
};

function initializeComponents() {
    PropertyMap.initializeMainMap();
    initializeFilters();
    initializeEventListeners();
    initializeUIComponents();
    initializeImageLoading();
}

function initializeFilters() {
    Object.entries(FilterService.filterDefinitions).forEach(([filterId, definition]) => {
        const select = document.getElementById(filterId);
        if (select) {
            select.innerHTML = definition.options.map(option => 
                `<option value="${option.value}">${option.label}</option>`
            ).join('');
            
            select.addEventListener('change', (e) => {
                updateFilter(filterId, e.target.value);
            });
        }
    });

    // Manejamos solo el evento submit del formulario
    const searchForm = document.querySelector('.search-container form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    // Removemos el listener del botón ya que el submit del form lo maneja
    // const searchButton = document.querySelector('.search-btn');
    // if (searchButton) {
    //     searchButton.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         applyFilters();
    //     });
    // }

    const clearAllBtn = document.querySelector('.clear-all-filters');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFilters);
    }

    document.getElementById('filterTags')?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-filter');
        if (removeBtn) {
            const filterType = removeBtn.dataset.filterType;
            if (filterType) {
                removeFilter(filterType);
            }
        }
    });
}

function initializeEventListeners() {
    window.addEventListener('resize', debounce(() => {
        PropertyMap.updateMap();
    }, 250));

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            PropertyMap.updateMap();
        }
    });
}

function initializeUIComponents() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

function initializeImageLoading() {
    document.addEventListener('load', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.classList.add('loaded');
        }
    }, true);
}

function updateFilter(filterType, value) {
    if (!value || value === '') {
        delete APP_STATE.activeFilters[filterType];
    } else {
        APP_STATE.activeFilters[filterType] = value;
    }
    // Removemos estas líneas
    // updateResults([]);
    // updateMarkers([]);
}

function removeFilter(filterType) {
    const select = document.getElementById(filterType);
    if (select) {
        select.value = '';
    }
    delete APP_STATE.activeFilters[filterType];
    // Removemos estas líneas
    // updateResults([]);
    // updateMarkers([]);
}

function clearAllFilters() {
    // Solo delega al FilterService
    FilterService.clearAllFilters();
}

async function applyFilters() {
    await FilterService.applyFilters();
}

function updateResults(properties) {
    // Guardar propiedades en el estado global
    APP_STATE.properties = properties;
    
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = properties.length;
    }

    const container = document.getElementById('propertiesList');
    if (container) {
        container.innerHTML = '';
        
        if (properties.length === 0) {
            // Consistent message for when no properties are showing
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Use los filtros y presione el botón "Search"</h3>
                    <p>Seleccione los filtros deseados y haga clic en Search para ver propiedades</p>
                </div>
            `;
        } else {
            container.innerHTML = properties.map(property => 
                PropertyCard.render(property, APP_STATE.currentView)
            ).join('');
        }
    }
}

// Make sure this runs once when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // This will show the empty state message
    updateResults([]);
    
    // Also make sure the map is empty
    if (typeof updateMarkers === 'function') {
        updateMarkers([]);
    }
});

function updateMarkers(properties) {
    if (PropertyMap && properties) {
        PropertyMap.addMarkers(properties, (propertyId) => {
            APP_STATE.setSelectedProperty(propertyId);
        });
    }
}

function updateFilterTags() {
    const container = document.getElementById('filterTags');
    if (!container) return;

    const tags = Object.entries(APP_STATE.activeFilters)
        .filter(([_, value]) => value)
        .map(([type, value]) => {
            let displayValue = value;
            
            switch(type) {
                case 'priceRange':
                    const [min, max] = value.split('-');
                    displayValue = max ? 
                        `${Formatters.formatPrice(min)} - ${Formatters.formatPrice(max)}` : 
                        `${Formatters.formatPrice(min)}+`;
                    break;
                case 'bedrooms':
                case 'bathrooms':
                    displayValue = `${value}+`;
                    break;
            }

            const filterNames = {
                propertyType: 'Type',
                location: 'Location',
                priceRange: 'Price',
                bedrooms: 'Beds',
                bathrooms: 'Baths'
            };

            return `
                <span class="filter-tag">
                    ${filterNames[type] || type}: ${displayValue}
                    <button class="remove-filter" data-filter-type="${type}">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `;
        }).join('');

    container.innerHTML = tags;

    const activeFilters = document.getElementById('activeFilters');
    if (activeFilters) {
        activeFilters.style.display = Object.keys(APP_STATE.activeFilters).length > 0 ? 'block' : 'none';
    }
}

function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advancedFilters');
    const toggleBtn = document.querySelector('.advanced-filters-toggle i.fa-chevron-down, .advanced-filters-toggle i.fa-chevron-up');
    
    if (advancedFilters.style.display === 'none') {
        advancedFilters.style.display = 'block';
        toggleBtn.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        advancedFilters.style.display = 'none';
        toggleBtn.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

function changeView(viewType) {
    if (viewType !== 'list' && viewType !== 'grid') return;
    
    APP_STATE.setView(viewType);
    StorageService.saveViewPreference(viewType);
    
    const container = document.getElementById('propertiesList');
    if (container) {
        container.className = `properties-container ${viewType}-layout`;
    }

    document.querySelectorAll('.view-controls-container .btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(viewType));
    });
}

function showLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.offsetHeight;
        overlay.classList.add('visible');
    }
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function checkAndShowProperty() {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('property');
    
    if (propertyId && propertyId !== 'null') {
        try {
            const property = await ApiService.getProperty(propertyId);
            if (property) {
                PropertyModal.show(propertyId);
            }
        } catch (error) {
            console.error('Error al cargar la propiedad:', error);
            NotificationService.error('No se encontró la propiedad');
        }
    }
}

window.addEventListener('message', async function(event) {
    if (event.data.action === 'showProperty') {
        const propertyId = event.data.propertyId;
        
        try {
            const property = await ApiService.getProperty(propertyId);
            if (property) {
                PropertyModal.show(propertyId);
                
                if (event.data.filters) {
                    FilterService.setFilters(event.data.filters);
                }
            }
        } catch (error) {
            console.error('Error al cargar la propiedad:', error);
        }
    }
});

window.addEventListener('load', function() {
    if (window !== window.top) {
        setTimeout(() => {
            window.parent.postMessage({ 
                type: 'appReady',
                status: 'ready'
            }, '*');
            
            checkAndShowProperty();
        }, 1000);
    }
});

window.showPropertyDetails = async (propertyId) => {
    try {
        // Buscar la propiedad en los datos actuales
        if (APP_STATE.properties && Array.isArray(APP_STATE.properties)) {
            const property = APP_STATE.properties.find(p => p.id === propertyId);
            
            if (property) {
                console.log('Propiedad encontrada:', property);
                PropertyModal.showWithData(property);
                return;
            }
        }
        
        // Si no encontramos la propiedad, mostramos un error
        console.error('No se pudo encontrar la propiedad');
        NotificationService.error('Error al cargar la propiedad');
    } catch (error) {
        console.error('Error al cargar la propiedad:', error);
        NotificationService.error('Error al cargar la propiedad');
    }
};

window.scheduleViewing = (propertyId) => PropertyModal.scheduleViewing(propertyId);
window.contactAgent = (propertyId) => PropertyModal.contactAgent(propertyId);
window.changeView = changeView;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.clearAllFilters = clearAllFilters;
window.removeFilter = removeFilter;
window.applyFilters = applyFilters;

// Función de depuración para analizar propiedades
window.debugProperties = async function() {
    try {
        const response = await fetch('https://mls-search-interface-6528ddc13a39.herokuapp.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filters: {} })
        });
        
        const data = await response.json();
        const properties = data.data || data.properties || [];
        
        // Extrae todos los tipos de propiedades únicos
        const propertyTypes = [...new Set(properties.map(p => p.propertytypelabel))];
        console.log('Tipos de propiedades disponibles:', propertyTypes);
        
        // Extrae todas las ubicaciones únicas
        const locations = [...new Set(properties.map(p => p.mlsareamajor))];
        console.log('Ubicaciones disponibles:', locations);
        
        // Probar filtros populares
        const housesCount = properties.filter(p => p.propertytypelabel === 'Houses').length;
        console.log(`Hay ${housesCount} propiedades con propertytypelabel = 'Houses'`);
        
        const condosCount = properties.filter(p => p.propertytypelabel === 'Condos').length;
        console.log(`Hay ${condosCount} propiedades con propertytypelabel = 'Condos'`);
        
        // Ver algunos ejemplos de cada tipo
        if (housesCount > 0) {
            console.log('Ejemplo de House:', properties.find(p => p.propertytypelabel === 'Houses'));
        }
        
        if (condosCount > 0) {
            console.log('Ejemplo de Condo:', properties.find(p => p.propertytypelabel === 'Condos'));
        }
        
        return { propertyTypes, locations };
    } catch (error) {
        console.error('Error en depuración:', error);
    }
};