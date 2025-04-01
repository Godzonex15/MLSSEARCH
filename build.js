/**
 * Script para combinar archivos JS y CSS en archivos únicos para el proyecto MLS
 * 
 * Uso: node build.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const jsSourceDir = './public/src/js';  // Ajustado para la estructura real del proyecto
const cssSourceDir = './public/src/css'; // Ajustado para la estructura real del proyecto
const outputDir = './dist';
const outputJsFile = path.join(outputDir, 'mls-interface.js');
const outputCssFile = path.join(outputDir, 'mls-interface.css');

// Orden de los archivos JS (ajustado según la estructura de tu proyecto)
const jsFileOrder = [
  // Utilidades y configuración
  'config.js',
  'utils/formatters.js',
  'utils/domHelpers.js',
  
  // Servicios
  'services/storageService.js',
  'services/notificationService.js',
  'services/apiService.js',
  'services/filterService.js',
  'services/shareService.js',
  'services/mapService.js',
  'services/propertyService.js',
  'services/analyticsService.js',
  'services/i18nService.js',
  'services/searchService.js',
  
  // Estado de la aplicación
  'state.js',
  
  // Componentes
  'components/propertyCard.js',
  'components/propertyModal.js',
  'components/propertyGallery.js',
  'components/propertyMap.js',
  
  // Inicialización
  'app.js'
];

// Orden de los archivos CSS
const cssFileOrder = [
  'utilities.css',
  'animations.css',
  'main.css', 
  'components/base.css',
  'components/search-filters.css',
  'components/property-card.css',
  'components/layout.css',
  'components/map.css',
  'components/property-preview.css',
  'modal.css',
  'compare.css'
];

// Asegurar que existe el directorio de salida
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directorio creado: ${directory}`);
  }
}

// Función para encontrar rutas de archivos existentes
function findExistingFiles() {
  console.log('Buscando archivos JS y CSS...');
  
  // Buscar archivos JS
  const jsFiles = [];
  for (const file of jsFileOrder) {
    const standardPath = path.join(jsSourceDir, file);
    if (fs.existsSync(standardPath)) {
      jsFiles.push({ name: file, path: standardPath });
      continue;
    }
    
    // Intentar encontrar el archivo sin la estructura de carpetas src/js
    const rootPath = `./${file}`;
    if (fs.existsSync(rootPath)) {
      jsFiles.push({ name: file, path: rootPath });
      continue;
    }
    
    // Buscar en carpeta public directamente
    const publicPath = `./public/${file}`;
    if (fs.existsSync(publicPath)) {
      jsFiles.push({ name: file, path: publicPath });
      continue;
    }
    
    // Buscar en la raíz sin prefijos
    if (file.includes('/')) {
      const segments = file.split('/');
      const filename = segments[segments.length - 1];
      const directPath = `./${filename}`;
      if (fs.existsSync(directPath)) {
        jsFiles.push({ name: file, path: directPath });
        continue;
      }
    }
    
    console.warn(`No se encontró el archivo JS: ${file}`);
  }
  
  // Buscar archivos CSS
  const cssFiles = [];
  for (const file of cssFileOrder) {
    const standardPath = path.join(cssSourceDir, file);
    if (fs.existsSync(standardPath)) {
      cssFiles.push({ name: file, path: standardPath });
      continue;
    }
    
    // Intentar encontrar el archivo sin la estructura de carpetas
    const rootPath = `./${file}`;
    if (fs.existsSync(rootPath)) {
      cssFiles.push({ name: file, path: rootPath });
      continue;
    }
    
    // Buscar en carpeta public directamente
    const publicPath = `./public/${file}`;
    if (fs.existsSync(publicPath)) {
      cssFiles.push({ name: file, path: publicPath });
      continue;
    }
    
    // Buscar versiones alternativas comunes
    const simpleName = file.replace('components/', '');
    const altPath = `./public/src/css/${simpleName}`;
    if (fs.existsSync(altPath)) {
      cssFiles.push({ name: file, path: altPath });
      continue;
    }
    
    console.warn(`No se encontró el archivo CSS: ${file}`);
  }
  
  return { jsFiles, cssFiles };
}

// Función para escanear directorios y encontrar archivos
function scanDirectoryForFiles(dir, extension) {
  console.log(`Escaneando ${dir} para archivos ${extension}...`);
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`El directorio ${dir} no existe.`);
    return files;
  }
  
  function scan(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && fullPath.endsWith(extension)) {
        // Crear un nombre relativo para el archivo
        const relativePath = path.relative(dir, fullPath);
        files.push({ name: relativePath, path: fullPath });
      }
    }
  }
  
  scan(dir);
  return files;
}

// Función para leer todos los archivos JS y combinarlos
async function buildJs(jsFiles) {
  console.log('Construyendo archivo mls-interface.js...');
  
  // Encabezado del archivo final
  let combinedContent = `/**
 * MLS Interface - Versión combinada generada automáticamente
 * Fecha: ${new Date().toLocaleString()}
 * 
 * Este archivo fue generado a partir de los módulos JS del proyecto
 * No edites este archivo directamente, modifica los módulos originales.
 */

// Asegurarse de que todas las funciones estén disponibles globalmente
(function(window, document) {
  'use strict';

`;

  // Procesar archivos en orden
  for (const file of jsFiles) {
    console.log(`Procesando JS: ${file.path}`);
    
    // Leer contenido del archivo
    let content = fs.readFileSync(file.path, 'utf8');
    
    // Reemplazar exports e imports
    content = content.replace(/export\s+const\s+([A-Za-z0-9_]+)/g, 'const $1');
    content = content.replace(/export\s+default\s+([A-Za-z0-9_]+)/g, 'const $1');
    content = content.replace(/window\.([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+)/g, 'window.$1 = $2');
    
    // Comentar cualquier import no capturado
    content = content.replace(/import\s.*/g, '// $&');
    
    // Añadir comentario de inicio de sección
    combinedContent += `\n// =========== INICIO: ${file.name} ===========\n\n`;
    combinedContent += content;
    combinedContent += `\n// =========== FIN: ${file.name} ===========\n`;
  }
  
  // Añadir sección de exportaciones globales
  combinedContent += `
// =========== Exportaciones Globales ===========
window.APP_STATE = APP_STATE || {};
window.PropertyCard = PropertyCard || {};
window.PropertyModal = PropertyModal || {};
window.PropertyGallery = PropertyGallery || {};
window.PropertyMap = PropertyMap || {};
window.ApiService = ApiService || {};
window.FilterService = FilterService || {};
window.NotificationService = NotificationService || {};
window.ShareService = ShareService || {};
window.StorageService = StorageService || {};
window.Formatters = Formatters || {};
window.DOMHelpers = DOMHelpers || {};
`;
  
  // Cerrar IIFE y añadir inicialización
  combinedContent += `
  // Inicializar cuando el documento está cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('MLS Interface inicializado.');
      if (typeof initApp === 'function') {
        initApp();
      }
    });
  } else {
    console.log('MLS Interface inicializado inmediatamente.');
    if (typeof initApp === 'function') {
      initApp();
    }
  }
})(window, document);
`;

  // Escribir archivo final
  ensureDirectoryExists(outputDir);
  fs.writeFileSync(outputJsFile, combinedContent);
  console.log(`✅ Archivo mls-interface.js creado correctamente en ${outputJsFile}.`);
}

// Función para construir CSS
async function buildCss(cssFiles) {
  console.log('Construyendo archivo mls-interface.css...');
  
  // Encabezado del archivo CSS final
  let combinedCss = `/**
 * MLS Interface CSS - Versión combinada generada automáticamente
 * Fecha: ${new Date().toLocaleString()}
 * 
 * Este archivo fue generado a partir de los módulos CSS del proyecto
 * No edites este archivo directamente, modifica los módulos originales.
 */

`;

  // Procesar archivos CSS en orden
  for (const file of cssFiles) {
    console.log(`Procesando CSS: ${file.path}`);
    
    // Leer contenido del archivo
    let content = fs.readFileSync(file.path, 'utf8');
    
    // Reemplazar importaciones CSS si existen
    content = content.replace(/@import\s+url\(['"].*?['"]\);?/g, '/* Importación procesada */');
    
    // Añadir comentario de inicio de sección
    combinedCss += `\n/* =========== INICIO: ${file.name} =========== */\n\n`;
    combinedCss += content;
    combinedCss += `\n/* =========== FIN: ${file.name} =========== */\n`;
  }
  
  // Escribir archivo CSS final
  ensureDirectoryExists(outputDir);
  fs.writeFileSync(outputCssFile, combinedCss);
  console.log(`✅ Archivo mls-interface.css creado correctamente en ${outputCssFile}.`);
}

// Ejecutar proceso de construcción
async function build() {
  console.log('Iniciando proceso de construcción...');
  
  try {
    // Buscar en rutas estándar
    let { jsFiles, cssFiles } = findExistingFiles();
    
    // Si no se encontraron suficientes archivos, buscar en las carpetas del proyecto
    if (jsFiles.length === 0) {
      console.log('Buscando archivos JS en otras ubicaciones...');
      
      // Buscar en ubicaciones alternativas
      const jsLocations = [
        './js',
        './src/js',
        './public/js',
        './public/src/js',
        '.'
      ];
      
      for (const location of jsLocations) {
        if (fs.existsSync(location)) {
          const foundFiles = scanDirectoryForFiles(location, '.js');
          if (foundFiles.length > 0) {
            jsFiles = foundFiles;
            console.log(`Encontrados ${foundFiles.length} archivos JS en ${location}`);
            break;
          }
        }
      }
    }
    
    if (cssFiles.length === 0) {
      console.log('Buscando archivos CSS en otras ubicaciones...');
      
      // Buscar en ubicaciones alternativas
      const cssLocations = [
        './css',
        './src/css',
        './public/css',
        './public/src/css',
        '.'
      ];
      
      for (const location of cssLocations) {
        if (fs.existsSync(location)) {
          const foundFiles = scanDirectoryForFiles(location, '.css');
          if (foundFiles.length > 0) {
            cssFiles = foundFiles;
            console.log(`Encontrados ${foundFiles.length} archivos CSS en ${location}`);
            break;
          }
        }
      }
    }
    
    if (jsFiles.length === 0) {
      console.warn('⚠️ No se encontraron archivos JS para procesar.');
      // Crear un archivo JS mínimo
      jsFiles = [{ 
        name: 'placeholder.js', 
        path: null, 
        content: '// Placeholder JS file\nconsole.log("MLS Interface JS loaded");' 
      }];
    }
    
    if (cssFiles.length === 0) {
      console.warn('⚠️ No se encontraron archivos CSS para procesar.');
      // Crear un archivo CSS mínimo
      cssFiles = [{ 
        name: 'placeholder.css', 
        path: null, 
        content: '/* Placeholder CSS file */\n/* Add your styles here */'
      }];
    }
    
    await buildJs(jsFiles);
    await buildCss(cssFiles);
    
    // Crear archivo HTML básico de ejemplo
    const htmlPath = path.join(outputDir, 'index.html');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real Estate Explorer - Baja Sur Realtors</title>
    
    <!-- Bootstrap desde CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.css">
    
    <!-- Fuentes -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- CSS principal generado -->
    <link rel="stylesheet" href="mls-interface.css">
</head>
<body>
    <div class="split-view-container">
        <!-- Left Panel -->
        <div class="left-panel">
            <!-- Search Container -->
            <div class="search-container glass-morphism">
                <!-- MLS Search Section -->
                <div class="mls-search-section">
                    <div class="filter-group">
                        <label for="mlsSearch">Search by MLS ID</label>
                        <div class="mls-search-container">
                            <i class="fas fa-search mls-search-icon"></i>
                            <input type="text" 
                                   id="mlsSearch" 
                                   class="mls-search-input" 
                                   placeholder="Enter Property ID..."
                                   aria-label="Search by Property ID">
                        </div>
                    </div>
                </div>
            
                <!-- Basic Filters Form -->
                <form class="basic-filters" onsubmit="event.preventDefault(); FilterService.applyFilters();">
                    <div class="filter-row">
                        <!-- Property Type Filter -->
                        <div class="filter-group">
                            <label for="propertyType">Property Type</label>
                            <select id="propertyType" class="filter-select">
                                <!-- Options filled by JavaScript -->
                            </select>
                        </div>
            
                        <!-- Location Filter -->
                        <div class="filter-group">
                            <label for="location">Location</label>
                            <select id="location" class="filter-select">
                                <!-- Options filled by JavaScript -->
                            </select>
                        </div>
            
                        <!-- Enhanced Price Range Filter -->
                        <div class="filter-group price-range-group">
                            <label for="priceRange">Price Range</label>
                            <div class="price-select-container">
                                <select id="priceRange" class="filter-select">
                                    <!-- Options filled by JavaScript -->
                                </select>
                                <button type="button" 
                                        class="price-slider-toggle" 
                                        onclick="FilterService.togglePriceSlider()"
                                        aria-label="Show price range slider">
                                    <i class="fas fa-sliders-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
            
                    <!-- Search and Clear Buttons -->
                    <div class="search-buttons">
                        <button type="submit" class="search-btn">
                            <i class="fas fa-search"></i> Search
                        </button>
                        <button type="button" class="clear-all-filters" onclick="FilterService.clearAllFilters()">
                            <i class="fas fa-times"></i> Clear All
                        </button>
                    </div>
                </form>
            
                <!-- Advanced Filters Toggle -->
                <div class="advanced-filters-toggle">
                    <button type="button" 
                            class="toggle-btn" 
                            onclick="FilterService.toggleAdvancedFilters()">
                        <i class="fas fa-sliders-h"></i> Advanced Filters
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            
                <!-- Advanced Filters Section -->
                <div id="advancedFilters" class="advanced-filters">
                    <!-- ... contenido de filtros avanzados ... -->
                </div>
            </div>

            <!-- Active Filters Display -->
            <div id="activeFilters" class="active-filters glass-morphism" style="display: none;">
                <h6>Active Filters</h6>
                <div id="filterTags" class="filter-tags"></div>
            </div>

            <!-- View Controls -->
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

            <!-- Properties List Container -->
            <div id="propertiesList" class="properties-container grid-layout"></div>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">
            <div id="map" class="map-container glass-morphism"></div>
            <div id="selectedProperty" class="selected-property glass-morphism"></div>
        </div>
    </div>

    <!-- Price Range Slider Modal -->
    <div id="priceSliderModal" class="price-slider-modal">
        <!-- ... contenido modal de precio ... -->
    </div>

    <!-- Property Modal -->
    <div id="propertyModal" class="modal fade modal-property" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content glass-morphism">
                <div id="propertyModalContent" class="modal-body p-0">
                    <!-- Modal content will be dynamically inserted here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.3/nouislider.min.js"></script>
    
    <!-- Script principal generado -->
    <script src="mls-interface.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ Archivo de ejemplo index.html creado en ${htmlPath}.`);
    
    console.log('Proceso de construcción completado exitosamente.');
  } catch (error) {
    console.error('Error durante el proceso de construcción:', error);
  }
}

build();