/**
 * Script modificado para combinar archivos JS y CSS en archivos únicos para el proyecto MLS
 * Actualiza directamente el index.html original en la carpeta public
 * 
 * Uso: node build.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const outputDir = './';
const srcDir = './src'; // Directorio src para JS y CSS
const publicDir = './public'; // Directorio public donde está el index.html
const outputJsFile = path.join(outputDir, 'mls-interface.js');
const outputCssFile = path.join(outputDir, 'mls-interface.css');

// Buscar el index.html en varias ubicaciones posibles
function findIndexHtml() {
  const possiblePaths = [
    path.join(publicDir, 'index.html'),
    path.join(srcDir, 'index.html'),
    './index.html',
    path.join(publicDir, 'src', 'index.html'),
    path.join(srcDir, 'public', 'index.html')
  ];
  
  for (const indexPath of possiblePaths) {
    if (fs.existsSync(indexPath)) {
      console.log(`Index.html encontrado en: ${indexPath}`);
      return indexPath;
    }
  }
  
  console.warn('⚠️ No se encontró el archivo index.html original.');
  return null;
}

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
    // Intentar varias rutas posibles
    const possiblePaths = [
      path.join(srcDir, 'js', file),
      path.join(publicDir, 'src/js', file),
      `./${file}`,
      path.join(publicDir, file),
      `./js/${file}`
    ];
    
    let found = false;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        jsFiles.push({ name: file, path: testPath });
        found = true;
        break;
      }
    }
    
    // Buscar sin la estructura de carpetas para los componentes y servicios
    if (!found && file.includes('/')) {
      const segments = file.split('/');
      const filename = segments[segments.length - 1];
      const simplePaths = [
        `./${filename}`,
        path.join(publicDir, filename),
        `./js/${filename}`,
        path.join(srcDir, 'js', filename),
        path.join(publicDir, 'src/js', filename)
      ];
      
      for (const testPath of simplePaths) {
        if (fs.existsSync(testPath)) {
          jsFiles.push({ name: file, path: testPath });
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      console.warn(`No se encontró el archivo JS: ${file}`);
    }
  }
  
  // Buscar archivos CSS
  const cssFiles = [];
  for (const file of cssFileOrder) {
    // Intentar varias rutas posibles
    const possiblePaths = [
      path.join(srcDir, 'css', file),
      path.join(publicDir, 'src/css', file),
      `./${file}`,
      path.join(publicDir, file),
      `./css/${file}`
    ];
    
    let found = false;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        cssFiles.push({ name: file, path: testPath });
        found = true;
        break;
      }
    }
    
    // Buscar sin la estructura de carpetas para los componentes
    if (!found && file.includes('/')) {
      const segments = file.split('/');
      const filename = segments[segments.length - 1];
      const simplePaths = [
        `./${filename}`,
        path.join(publicDir, filename),
        `./css/${filename}`,
        path.join(srcDir, 'css', filename),
        path.join(publicDir, 'src/css', filename)
      ];
      
      for (const testPath of simplePaths) {
        if (fs.existsSync(testPath)) {
          cssFiles.push({ name: file, path: testPath });
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      console.warn(`No se encontró el archivo CSS: ${file}`);
    }
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
    let content = '';
    if (file.path) {
      content = fs.readFileSync(file.path, 'utf8');
    } else if (file.content) {
      content = file.content;
    } else {
      console.warn(`Saltando archivo sin contenido: ${file.name}`);
      continue;
    }
    
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
window.changeView = changeView || function(view) { console.log('Cambiando a vista:', view); };
window.showPropertyDetails = showPropertyDetails || function(id) { console.log('Mostrando detalles:', id); };
`;
  
  // Cerrar IIFE y añadir inicialización
  combinedContent += `
  // Inicializar cuando el documento está cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('MLS Interface inicializado.');
      if (typeof initApp === 'function') {
        initApp();
      } else {
        console.log('Función initApp no disponible, inicializando con fallback...');
        if (typeof APP_STATE !== 'undefined' && typeof APP_STATE.init === 'function') {
          APP_STATE.init();
        }
        if (typeof FilterService !== 'undefined' && typeof FilterService.init === 'function') {
          FilterService.init();
        }
        if (typeof PropertyMap !== 'undefined' && typeof PropertyMap.initializeMainMap === 'function') {
          PropertyMap.initializeMainMap();
        }
      }
    });
  } else {
    console.log('MLS Interface inicializado inmediatamente.');
    if (typeof initApp === 'function') {
      initApp();
    } else {
      console.log('Función initApp no disponible, inicializando con fallback...');
      if (typeof APP_STATE !== 'undefined' && typeof APP_STATE.init === 'function') {
        APP_STATE.init();
      }
      if (typeof FilterService !== 'undefined' && typeof FilterService.init === 'function') {
        FilterService.init();
      }
      if (typeof PropertyMap !== 'undefined' && typeof PropertyMap.initializeMainMap === 'function') {
        PropertyMap.initializeMainMap();
      }
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
    let content = '';
    if (file.path) {
      content = fs.readFileSync(file.path, 'utf8');
    } else if (file.content) {
      content = file.content;
    } else {
      console.warn(`Saltando archivo CSS sin contenido: ${file.name}`);
      continue;
    }
    
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

// Función para actualizar referencias en el index.html original in-place
function updateIndexHtml() {
  // Encontrar el archivo index.html original
  const indexHtmlPath = findIndexHtml();
  if (!indexHtmlPath) {
    return false;
  }
  
  console.log(`Actualizando referencias en el index.html original (${indexHtmlPath})...`);
  
  // Leer el index original
  let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Verificar si ya tiene la referencia a los archivos combinados
const hasJsRef = indexContent.includes('mls-interface.js');
const hasCssRef = indexContent.includes('mls-interface.css');

if (hasJsRef && hasCssRef) {
  console.log('El index.html ya contiene referencias a los archivos combinados.');
  return true;
}

// Modificar el HTML para usar los archivos combinados
// 1. Reemplazar múltiples referencias a CSS individuales con una única referencia al archivo combinado
let updatedContent = indexContent;

// Buscar múltiples referencias a archivos CSS individuales y reemplazarlas por una única referencia al CSS combinado
const cssLinkPattern = /<link\s+rel=["']stylesheet["']\s+href=["']src\/css\/[^"']+["']\s*>/g;
const cssLinks = indexContent.match(cssLinkPattern) || [];

if (cssLinks.length > 0) {
  const firstCssLink = cssLinks[0];
  const replacementCssLink = `<link rel="stylesheet" href="mls-interface.css">`;
  
  // Reemplazar el primer link con el nuevo y eliminar los demás
  updatedContent = updatedContent.replace(firstCssLink, replacementCssLink);
  for (let i = 1; i < cssLinks.length; i++) {
    updatedContent = updatedContent.replace(cssLinks[i], '');
  }
  
  console.log(`Reemplazadas ${cssLinks.length} referencias CSS por una única referencia al archivo combinado.`);
} else {
  // Si no se encontraron links CSS individuales, añadir la referencia al CSS combinado antes de </head>
  updatedContent = updatedContent.replace('</head>', `  <link rel="stylesheet" href="mls-interface.css">\n</head>`);
  console.log('Añadida referencia al CSS combinado.');
}

// 2. Reemplazar múltiples referencias a JS individuales con una única referencia al archivo combinado
const jsScriptPattern = /<script\s+src=["']src\/js\/[^"']+["']\s*><\/script>/g;
const jsScripts = updatedContent.match(jsScriptPattern) || [];

if (jsScripts.length > 0) {
  const firstJsScript = jsScripts[0];
  const replacementJsScript = `<script src="mls-interface.js"></script>`;
  
  // Reemplazar el primer script con el nuevo y eliminar los demás
  updatedContent = updatedContent.replace(firstJsScript, replacementJsScript);
  for (let i = 1; i < jsScripts.length; i++) {
    updatedContent = updatedContent.replace(jsScripts[i], '');
  }
  
  console.log(`Reemplazadas ${jsScripts.length} referencias JS por una única referencia al archivo combinado.`);
} else {
  // Si no se encontraron scripts JS individuales, añadir la referencia al JS combinado antes de </body>
  updatedContent = updatedContent.replace('</body>', `  <script src="mls-interface.js"></script>\n</body>`);
  console.log('Añadida referencia al JS combinado.');
}

// Guardar el archivo HTML actualizado en la misma ubicación (in-place)
fs.writeFileSync(indexHtmlPath, updatedContent);
console.log(`✅ Archivo index.html actualizado directamente en ${indexHtmlPath}.`);
return true;
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
      path.join(srcDir, 'js'),
      path.join(publicDir, 'src/js'),
      './js',
      path.join(publicDir, 'js'),
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
      path.join(srcDir, 'css'),
      path.join(publicDir, 'src/css'),
      './css',
      path.join(publicDir, 'css'),
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
  
  // Actualizar el index.html original directamente
  updateIndexHtml();
  
  console.log('Proceso de construcción completado exitosamente.');
} catch (error) {
  console.error('Error durante el proceso de construcción:', error);
}
}

build();