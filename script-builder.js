const fs = require('fs');
const path = require('path');

// Rutas posibles para los archivos necesarios
const possiblePaths = {
  js: ['./mls-interface.js', './public/mls-interface.js'],
  css: ['./mls-interface.css', './public/mls-interface.css'],
  html: ['./index.html', './public/index.html']
};

// Función para buscar un archivo en múltiples rutas
function findFile(paths) {
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      console.log(`Encontrado: ${filePath}`);
      return filePath;
    }
  }
  return null;
}

// Buscar los archivos necesarios
const jsPath = findFile(possiblePaths.js);
const cssPath = findFile(possiblePaths.css);
const htmlPath = findFile(possiblePaths.html);

// Verificar si se encontraron los archivos
if (!jsPath) {
  console.error('No se encontró el archivo JS. Ejecuta primero node build.js');
  process.exit(1);
}

// Leer contenidos de los archivos
const jsContent = fs.readFileSync(jsPath, 'utf8');
const cssContent = cssPath ? fs.readFileSync(cssPath, 'utf8') : '';

// HTML plantilla simplificada si no se encuentra el archivo
const htmlTemplate = htmlPath ? fs.readFileSync(htmlPath, 'utf8') : `
<!DOCTYPE html>
<html>
<body>
    <div class="split-view-container">
        <!-- Left Panel -->
        <div class="left-panel">
            <!-- Search Container -->
            <div class="search-container glass-morphism">
                <!-- Contenido básico del buscador -->
                <div class="mls-search-section">
                    <div class="filter-group">
                        <label for="mlsSearch">Search by MLS ID</label>
                        <div class="mls-search-container">
                            <i class="fas fa-search mls-search-icon"></i>
                            <input type="text" id="mlsSearch" class="mls-search-input" placeholder="Enter Property ID...">
                        </div>
                    </div>
                </div>

                <form class="basic-filters" onsubmit="event.preventDefault(); FilterService.applyFilters();">
                    <!-- Filters básicos -->
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="propertyType">Property Type</label>
                            <select id="propertyType" class="filter-select"></select>
                        </div>
                        <div class="filter-group">
                            <label for="location">Location</label>
                            <select id="location" class="filter-select"></select>
                        </div>
                        <div class="filter-group price-range-group">
                            <label for="priceRange">Price Range</label>
                            <div class="price-select-container">
                                <select id="priceRange" class="filter-select"></select>
                            </div>
                        </div>
                    </div>

                    <div class="search-buttons">
                        <button type="submit" class="search-btn">
                            <i class="fas fa-search"></i> Search
                        </button>
                        <button type="button" class="clear-all-filters" onclick="FilterService.clearAllFilters()">
                            <i class="fas fa-times"></i> Clear All
                        </button>
                    </div>
                </form>
            </div>

            <div id="activeFilters" class="active-filters glass-morphism" style="display: none;">
                <h6>Active Filters</h6>
                <div id="filterTags" class="filter-tags"></div>
            </div>

            <div class="view-controls-container glass-morphism">
                <div class="btn-group">
                    <button class="btn btn-outline-primary" onclick="changeView('list')">
                        <i class="fas fa-list"></i> List
                    </button>
                    <button class="btn btn-outline-primary active" onclick="changeView('grid')">
                        <i class="fas fa-th"></i> Grid
                    </button>
                </div>
                <div class="results-count">
                    <span id="resultsCount">0</span> properties found
                </div>
            </div>

            <div id="propertiesList" class="properties-container grid-layout"></div>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">
            <div id="map" class="map-container glass-morphism"></div>
            <div id="selectedProperty" class="selected-property glass-morphism"></div>
        </div>
    </div>

    <!-- Modales -->
    <div id="propertyModal" class="modal fade modal-property" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content glass-morphism">
                <div id="propertyModalContent" class="modal-body p-0"></div>
            </div>
        </div>
    </div>

    <div id="priceSliderModal" class="price-slider-modal">
        <div class="price-slider-content">
            <div class="price-slider-header">
                <h3>Set Price Range</h3>
                <button type="button" class="close-slider" onclick="FilterService.togglePriceSlider()">×</button>
            </div>
            <div class="price-range-container">
                <div class="price-range-inputs">
                    <div class="price-input-group">
                        <label for="minPrice">Min Price</label>
                        <input type="text" id="minPrice" class="price-input">
                    </div>
                    <div class="price-input-group">
                        <label for="maxPrice">Max Price</label>
                        <input type="text" id="maxPrice" class="price-input">
                    </div>
                </div>
                <div id="priceSlider" class="price-slider"></div>
            </div>
            <div class="price-slider-actions">
                <button type="button" class="apply-price-range" onclick="FilterService.applyPriceRange()">
                    Apply Range
                </button>
            </div>
        </div>
    </div>

    <div class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
</body>
</html>
`;

// Crear el script final
const finalScript = `
(function() {
  // Crear y añadir el CSS
  function addStyles() {
    const style = document.createElement('style');
    style.id = 'mls-interface-styles';
    style.textContent = ${JSON.stringify(cssContent)};
    document.head.appendChild(style);
    
    // Añadir también los estilos externos necesarios
    const externalStyles = [
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.css',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap'
    ];
    
    externalStyles.forEach(url => {
      if (!document.querySelector(\`link[href="\${url}"]\`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }
  
  // Cargar scripts externos necesarios
  function loadScripts(callback) {
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.js'
    ];
    
    let loaded = 0;
    const totalScripts = scripts.length;
    
    function checkAllLoaded() {
      loaded++;
      if (loaded === totalScripts) callback();
    }
    
    scripts.forEach(url => {
      if (!document.querySelector(\`script[src="\${url}"]\`)) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = checkAllLoaded;
        document.body.appendChild(script);
      } else {
        checkAllLoaded();
      }
    });
    
    // Si no hay scripts que cargar
    if (totalScripts === 0) callback();
  }
  
  // Inyectar el HTML en el elemento con id específico
  function injectHTML() {
    // Buscar el contenedor o crear uno
    let container = document.getElementById('mls-search-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mls-search-container';
      document.body.appendChild(container);
    }
    
    // Extraer solo el body content del HTML template
    const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/i.exec(${JSON.stringify(htmlTemplate)});
    const bodyContent = bodyMatch ? bodyMatch[1] : '';
    
    container.innerHTML = bodyContent;
  }
  
  // Inicializar la aplicación
  function initializeApp() {
    // Insertar el código JS de la aplicación
    const script = document.createElement('script');
    script.id = 'mls-interface-script';
    script.textContent = ${JSON.stringify(jsContent)};
    document.body.appendChild(script);
  }
  
  // Ejecutar todo en secuencia
  function initialize() {
    addStyles();
    loadScripts(() => {
      injectHTML();
      initializeApp();
    });
  }
  
  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
`;

// Guardar el script final
fs.writeFileSync('mlssearchinterface.js', finalScript);
console.log('Script final generado: mlssearchinterface.js');