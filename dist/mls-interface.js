/**
 * MLS Interface - Versión combinada generada automáticamente
 * Fecha: 24/3/2025, 2:01:14 p.m.
 * 
 * Este archivo fue generado a partir de los módulos JS del proyecto
 * No edites este archivo directamente, modifica los módulos originales.
 */

// Asegurarse de que todas las funciones estén disponibles globalmente
(function(window, document) {
  'use strict';


// =========== INICIO: config.js ===========

// Configuración global de la aplicación
const CONFIG = {
    // Configuración del mapa
    map: {
        defaultCenter: [24.1636, -110.3131],
        defaultZoom: 10,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    },

    // Configuración de la galería
    gallery: {
        transitionSpeed: 200,
        defaultHeight: 500
    },

    // Tipos de propiedades y sus colores
    propertyTypes: {
        house: {
            color: '#9B8B70', // Taupe elegante
            icon: 'fa-home'
        },
        condo: {
            color: '#B4A590', // Beige cálido
            icon: 'fa-building'
        },
        apartment: {
            color: '#8E8279', // Gris cálido
            icon: 'fa-city'
        },
        land: {
            color: '#A69F95', // Gris beige
            icon: 'fa-mountain'
        }
    },

    // Configuración de la animación
    animation: {
        duration: 300,
        easing: 'ease'
    },

    // Configuración de las conversiones de moneda
    currency: {
        exchangeRate: 20.78, // MXN to USD
        locale: 'en-US',
        currency: 'USD'
    }
};

// Congelar el objeto de configuración para prevenir modificaciones accidentales
Object.freeze(CONFIG);
// =========== FIN: config.js ===========

// =========== INICIO: utils/formatters.js ===========

const Formatters = {
    // Formato de precio
    formatPrice(price, options = {}) {
        if (!price) return 'Price on request';
        
        const config = {
            locale: options.locale || CONFIG.currency.locale,
            currency: options.currency || CONFIG.currency.currency,
            minimumFractionDigits: options.minimumFractionDigits || 0,
            maximumFractionDigits: options.maximumFractionDigits || 0
        };

        try {
            return new Intl.NumberFormat(config.locale, {
                style: 'currency',
                currency: config.currency,
                minimumFractionDigits: config.minimumFractionDigits,
                maximumFractionDigits: config.maximumFractionDigits
            }).format(price);
        } catch (error) {
            console.error('Error formatting price:', error);
            return `$${Number(price).toLocaleString()}`;
        }
    },

    // Formato de área
    formatArea(area, unit = 'sq ft') {
        if (!area) return 'N/A';
        return `${Number(area).toLocaleString()} ${unit}`;
    },

    // Formato de fecha
    formatDate(date, options = {}) {
        if (!date) return 'N/A';
        
        try {
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString(options.locale || 'en-US', {
                year: options.year || 'numeric',
                month: options.month || 'long',
                day: options.day || 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return date;
        }
    },

    // Formato de distancia
    formatDistance(meters, unit = 'km') {
        if (!meters) return 'N/A';
        
        switch (unit.toLowerCase()) {
            case 'km':
                return `${(meters / 1000).toFixed(1)} km`;
            case 'mi':
                return `${(meters / 1609.34).toFixed(1)} mi`;
            default:
                return `${meters} m`;
        }
    },

    // Formato de características
    formatFeatures(features) {
        if (!features) return [];
        
        try {
            const parsed = typeof features === 'string' ? JSON.parse(features) : features;
            return Object.entries(parsed)
                .filter(([_, value]) => value)
                .map(([key]) => key);
        } catch (error) {
            console.error('Error formatting features:', error);
            return [];
        }
    },

    // Formato de texto truncado
    truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    // Formato de rango de precios
    formatPriceRange(min, max) {
        const formattedMin = this.formatPrice(min);
        if (!max) return `${formattedMin}+`;
        return `${formattedMin} - ${this.formatPrice(max)}`;
    }
};

// Congelar el objeto de formateo para prevenir modificaciones
Object.freeze(Formatters);
// =========== FIN: utils/formatters.js ===========

// =========== INICIO: utils/domHelpers.js ===========

const DOMHelpers = {
    // Crear elemento
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Establecer atributos
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Añadir hijos
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    },

    // Limpiar elemento
    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    // Mostrar/ocultar elemento
    toggleElement(element, show) {
        if (element) {
            element.style.display = show ? '' : 'none';
        }
    },

    // Añadir/remover clase
    toggleClass(element, className, force) {
        if (element) {
            element.classList.toggle(className, force);
        }
    },

    // Establecer contenido HTML de forma segura
    setHTML(element, html) {
        if (element) {
            element.innerHTML = this.sanitizeHTML(html);
        }
    },

    // Sanitizar HTML
    sanitizeHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.innerHTML;
    },

    // Eventos
    addEventListeners(element, events = {}) {
        Object.entries(events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });

        // Retornar función para remover eventos
        return () => {
            Object.entries(events).forEach(([event, handler]) => {
                element.removeEventListener(event, handler);
            });
        };
    },

    // Delegación de eventos
    delegate(element, eventType, selector, handler) {
        element.addEventListener(eventType, event => {
            const target = event.target.closest(selector);
            if (target && element.contains(target)) {
                handler.call(target, event);
            }
        });
    },

    // Animaciones
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = '';

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.transition = `opacity ${duration}ms`;
                element.style.opacity = 1;
                setTimeout(resolve, duration);
            });
        });
    },

    fadeOut(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    },

    // Manipulación de formularios
    serializeForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },

    // Scroll
    scrollIntoView(element, options = {}) {
        element.scrollIntoView({
            behavior: options.behavior || 'smooth',
            block: options.block || 'start',
            inline: options.inline || 'nearest'
        });
    },

    // Detección de visibilidad
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Observador de intersección
    createIntersectionObserver(callback, options = {}) {
        return new IntersectionObserver(callback, {
            root: options.root || null,
            rootMargin: options.rootMargin || '0px',
            threshold: options.threshold || 0
        });
    }
};

// Congelar el objeto de helpers para prevenir modificaciones
Object.freeze(DOMHelpers);
// =========== FIN: utils/domHelpers.js ===========

// =========== INICIO: services/storageService.js ===========

const StorageService = {
    // Claves de almacenamiento
    keys: {
        FAVORITES: 'favorites',
        FILTERS: 'filters',
        VIEW_PREFERENCE: 'viewPreference'
    },

    // Métodos de almacenamiento
    save(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    load(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Métodos específicos para favoritos
    saveFavorites(favorites) {
        return this.save(this.keys.FAVORITES, Array.from(favorites));
    },

    loadFavorites() {
        return new Set(this.load(this.keys.FAVORITES, []));
    },

    // Métodos específicos para filtros
    saveFilters(filters) {
        return this.save(this.keys.FILTERS, filters);
    },

    loadFilters() {
        return {};
    },

    // Métodos específicos para preferencias de vista
    saveViewPreference(view) {
        return this.save(this.keys.VIEW_PREFERENCE, view);
    },

    loadViewPreference() {
        return this.load(this.keys.VIEW_PREFERENCE, 'grid');
    },

    // Método para limpiar todo el almacenamiento
    clearAll() {
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Congelar el servicio para prevenir modificaciones
Object.freeze(StorageService);
// =========== FIN: services/storageService.js ===========

// =========== INICIO: services/notificationService.js ===========

const NotificationService = {
    types: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },

    icons: {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    },

    defaultOptions: {
        duration: 3000,
        closeable: true,
        animate: true,
        progress: true
    },

    init() {
        this.createNotificationContainer();
        this.bindEvents();
        this.createStyles();
    },

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    },

    createStyles() {
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification-container {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    max-width: 500px;
                    width: calc(100% - 2rem);
                    z-index: 9999;
                    pointer-events: none;
                }

                .notification {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 0.75rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    transform: translateY(100px);
                    opacity: 0;
                    pointer-events: auto;
                    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    border-left: 4px solid transparent;
                    position: relative;
                    overflow: hidden;
                }

                .notification.show {
                    transform: translateY(0);
                    opacity: 1;
                }

                .notification.success {
                    border-left-color: var(--success-color);
                    background: linear-gradient(135deg, rgba(0, 110, 109, 0.05), rgba(255, 255, 255, 0.95));
                }

                .notification.error {
                    border-left-color: var(--danger-color);
                    background: linear-gradient(135deg, rgba(194, 166, 99, 0.05), rgba(255, 255, 255, 0.95));
                }

                .notification.warning {
                    border-left-color: var(--warning-color);
                    background: linear-gradient(135deg, rgba(212, 188, 130, 0.05), rgba(255, 255, 255, 0.95));
                }

                .notification.info {
                    border-left-color: var(--primary-color);
                    background: linear-gradient(135deg, rgba(0, 110, 109, 0.05), rgba(255, 255, 255, 0.95));
                }

                .notification-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                    padding: 0.5rem;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notification.success .notification-icon {
                    color: var(--success-color);
                    background: rgba(0, 110, 109, 0.1);
                }

                .notification.error .notification-icon {
                    color: var(--danger-color);
                    background: rgba(194, 166, 99, 0.1);
                }

                .notification.warning .notification-icon {
                    color: var(--warning-color);
                    background: rgba(212, 188, 130, 0.1);
                }

                .notification.info .notification-icon {
                    color: var(--primary-color);
                    background: rgba(0, 110, 109, 0.1);
                }

                .notification-content {
                    flex: 1;
                    min-width: 0;
                }

                .notification-title {
                    font-family: 'Playfair Display', serif;
                    margin: 0 0 0.25rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .notification-message {
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin: 0;
                    line-height: 1.4;
                }

                .notification-close {
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    opacity: 0.7;
                    transition: all 0.3s ease;
                    margin-left: auto;
                    flex-shrink: 0;
                    margin-top: -0.5rem;
                    margin-right: -0.5rem;
                }

                .notification-close:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .notification::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.3);
                    width: 100%;
                    transform-origin: left;
                    animation: progress 3s linear forwards;
                }

                @keyframes progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }

                @media (max-width: 768px) {
                    .notification-container {
                        bottom: 1rem;
                        width: calc(100% - 1rem);
                    }

                    .notification {
                        padding: 0.75rem 1rem;
                    }

                    .notification-icon {
                        font-size: 1.25rem;
                        width: 2.5rem;
                        height: 2.5rem;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .notification {
                        transition: none;
                    }

                    .notification::after {
                        animation: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    show(message, type = 'info', options = {}) {
        const settings = { ...this.defaultOptions, ...options };
        const container = document.getElementById('notification-container');
        if (!container) return;

        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${this.icons[type]}"></i>
            </div>
            <div class="notification-content">
                ${settings.title ? `<h3 class="notification-title">${settings.title}</h3>` : ''}
                <p class="notification-message">${message}</p>
            </div>
            ${settings.closeable ? `
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
        `;

        // Agregar al contenedor
        container.appendChild(notification);

        // Mostrar con animación
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Configurar temporizador de cierre
        let timer;
        if (settings.duration > 0) {
            timer = setTimeout(() => this.close(notification), settings.duration);

            // Pausar temporizador al hover
            notification.addEventListener('mouseenter', () => {
                clearTimeout(timer);
                if (settings.progress) {
                    notification.style.animationPlayState = 'paused';
                }
            });

            notification.addEventListener('mouseleave', () => {
                timer = setTimeout(() => this.close(notification), settings.duration);
                if (settings.progress) {
                    notification.style.animationPlayState = 'running';
                }
            });
        }

        // Manejar cierre manual
        if (settings.closeable) {
            const closeBtn = notification.querySelector('.notification-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    clearTimeout(timer);
                    this.close(notification);
                });
            }
        }

        // Añadir al stack de notificaciones
        this.manageNotificationStack();

        return notification;
    },

    manageNotificationStack() {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notifications = container.querySelectorAll('.notification');
        if (notifications.length > 5) {
            this.close(notifications[0]);
        }
    },

    success(message, options = {}) {
        return this.show(message, this.types.SUCCESS, options);
    },

    error(message, options = {}) {
        return this.show(message, this.types.ERROR, options);
    },

    warning(message, options = {}) {
        return this.show(message, this.types.WARNING, options);
    },

    info(message, options = {}) {
        return this.show(message, this.types.INFO, options);
    },

    close(notification) {
        if (!notification) return;
        
        notification.classList.remove('show');
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(100px)';
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    },

    closeAll() {
        const container = document.getElementById('notification-container');
        if (container) {
            const notifications = container.querySelectorAll('.notification');
            notifications.forEach(notification => this.close(notification));
        }
    },

    bindEvents() {
        // Cerrar notificaciones al cambiar de pestaña
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.closeAll();
            }
        });

        // Manejar tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });

        // Limpiar notificaciones antiguas al hacer scroll
        window.addEventListener('scroll', debounce(() => {
            const container = document.getElementById('notification-container');
            if (container) {
                const notifications = container.querySelectorAll('.notification');
                if (notifications.length > 3) {
                    this.close(notifications[0]);
                }
            }
        }, 100));
    }
};

// Función debounce helper
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

// Inicializar el servicio
NotificationService.init();

// Exportar para uso global
window.NotificationService = NotificationService;
// =========== FIN: services/notificationService.js ===========

// =========== INICIO: services/apiService.js ===========

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
// =========== FIN: services/apiService.js ===========

// =========== INICIO: services/filterService.js ===========

const FilterService = {
    state: {
        activeFilters: {},
        priceSliderInstance: null,
        minPrice: 0,
        maxPrice: 5000000,
        lastSearch: '',
        debounceTimeout: null,
        advancedFiltersVisible: false,
        initializing: true
    },





















    filterDefinitions: {
        propertyType: {
            label: 'Property Type',
            options: [
                { value: '', label: 'All Types' },
                { value: 'Houses', label: 'House' },
                { value: 'Apartments', label: 'Apartment' },
                { value: 'Condos', label: 'Condo' },
                { value: 'Land', label: 'Land' }
            ]
        },
        location: {
            label: 'Location',
            options: [
                { value: '', label: 'All Locations' },
                
                // La Paz Area
                { value: 'all-la-paz', label: '◈ LA PAZ AREA' },
                { value: 'La Paz City', label: '    • La Paz City' },
                { value: 'El Centenario', label: '    • El Centenario' },
                { value: 'El Sargento', label: '    • El Sargento' },
                { value: 'LaPaz Beach', label: '    • La Paz Beach' },
                { value: 'Los Planes', label: '    • Los Planes' },
                { value: 'San Juan de la Costa', label: '    • San Juan de la Costa' },
                { value: 'Pacific North', label: '    • Pacific North' },
                { value: 'San Pedro', label: '    • San Pedro' },
    
                // Los Cabos Area
                { value: 'all-los-cabos', label: '◈ LOS CABOS' },
                { value: 'CSL-Beach & Marina', label: '    • Cabo San Lucas Beach & Marina' },
                { value: 'CSL-Centro', label: '    • Cabo San Lucas Centro' },
                { value: 'CSL-North', label: '    • Cabo San Lucas North' },
                { value: 'CSL Cor-Inland', label: '    • Cabo San Lucas Corridor Inland' },
                { value: 'CSL-Corr. Oceanside', label: '    • Cabo San Lucas Corridor Oceanside' },
                { value: 'SJD-Beachside', label: '    • San José del Cabo Beachside' },
                { value: 'SJD-Centro', label: '    • San José del Cabo Centro' },
                { value: 'SJD-East', label: '    • San José del Cabo East' },
                { value: 'SJD-North', label: '    • San José del Cabo North' },
                { value: 'SJD Corr-Inland', label: '    • San José Corridor Inland' },
                { value: 'SJD Corr-Oceanside', label: '    • San José Corridor Oceanside' },
                { value: 'SJD-Inland/Golf', label: '    • San José Inland/Golf' },
                { value: 'Cerro Colorado', label: '    • Cerro Colorado' },
    
                // East Cape Area
                { value: 'all-east-cape', label: '◈ EAST CAPE' },
                { value: 'East Cape North', label: '    • East Cape North' },
                { value: 'East Cape South', label: '    • East Cape South' },
    
                // La Ventana Area
                { value: 'all-ventana', label: '◈ LA VENTANA AREA' },
                { value: 'La Ventana', label: '    • La Ventana' },
                { value: 'El Sargento', label: '    • El Sargento' },
    
                // Loreto Area
                { value: 'all-loreto', label: '◈ LORETO AREA' },
                { value: 'Loreto', label: '    • Loreto' },
                { value: 'Nopolo', label: '    • Nopolo' },
                { value: 'Excondido South', label: '    • Excondido South' },
    
                // Pacific Area
                { value: 'all-pacific', label: '◈ PACIFIC AREA' },
                { value: 'Pacific North', label: '    • Pacific North' },
                { value: 'Pacific South', label: '    • Pacific South' }
            ]
        },

    subdivision: {
        label: 'Subdivision',
        options: [
            { value: '', label: 'All Subdivisions' }
            // Subdivisiones se cargarán dinámicamente
        ]
    },
        priceRange: {
            label: 'Price Range',
            options: [
                { value: '', label: 'Any Price' },
                { value: '0-200000', label: 'Up to $200,000' },
                { value: '200000-300000', label: '$200,000 - $300,000' },
                { value: '300000-400000', label: '$300,000 - $400,000' },
                { value: '400000-500000', label: '$400,000 - $500,000' },
                { value: '500000-750000', label: '$500,000 - $750,000' },
                { value: '750000-1000000', label: '$750,000 - $1M' },
                { value: '1000000-1500000', label: '$1M - $1.5M' },
                { value: '1500000-2000000', label: '$1.5M - $2M' },
                { value: '2000000-3000000', label: '$2M - $3M' },
                { value: '3000000-5000000', label: '$3M - $5M' },
                { value: '5000000-', label: '$5M+' }
            ]
        },
        bedrooms: {
            label: 'Bedrooms',
            options: [
                { value: '', label: 'Any' },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' },
                { value: '5', label: '5+' }
            ]
        },
        bathrooms: {
            label: 'Bathrooms',
            options: [
                { value: '', label: 'Any' },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' }
            ]
        }
    },

regions: {
    'all-la-paz': ['La Paz City', 'El Centenario', 'El Sargento', 'LaPaz Beach', 'Los Planes', 'San Juan de la Costa', 'Pacific North', 'San Pedro'],
    'all-los-cabos': ['CSL-Beach & Marina', 'CSL-Centro', 'CSL-North', 'CSL Cor-Inland', 'CSL-Corr. Oceanside', 'SJD-Beachside', 'SJD-Centro', 'SJD-East', 'SJD-North', 'SJD Corr-Inland', 'SJD Corr-Oceanside', 'SJD-Inland/Golf', 'Cerro Colorado'],
    'all-east-cape': ['East Cape North', 'East Cape South'],
    'all-ventana': ['La Ventana', 'El Sargento'],
    'all-loreto': ['Loreto', 'Nopolo', 'Excondido South'],
    'all-pacific': ['Pacific North', 'Pacific South']
},

    // Método para cargar subdivisiones
loadSubdivisions(location) {
    const subdivisionMap = {
        'La Paz City': ['Almar', 'Alttus Homes', 'Alttus Sunset', 'Aqualoft', 'Bellavista', 'Centro', 'Colina del Sol', 'Esterito', 'Fidepaz', 'General', 'La Posada Condos', 'Lomas de Palmira', 'Mandala Estrella de Mar', 'Marina Palmira', 'Marina Sol', 'Sancta', 'Villas Posada', 'Vista Bahia (La Paz)', 'Vista Coral', 'Vista Cortes', 'Vista Los Suenos'],
        'El Centenario': ['Ampliacion Centenario', 'Centenario- Centro', 'Chametla', 'El Centenario', 'El Comitan', 'Haciendas Palo Verde', 'Lomas del Centenario', 'Palo Verde', 'Real Centenario', 'Villas del Centenario'],
        'CSL-Beach & Marina': ['Blue Bay-Pedregal', 'Blue Moon', 'Cabo Viejo', 'Cascadas', 'Centro-CSL South', 'CSL Marina:General', 'CSL Near Bch &Mar:Gen', 'Hacienda CSL', 'Marea Los Cabos', 'Marina', 'Marina Cabo Plaza', 'Marina Side:General', 'Marina Sol', 'Mistiq Pedregal Los Cabos', 'Monteluna', 'Montemar Pedregal', 'Pacific Side:General', 'Pedregal CSL', 'Pedregal Heights', 'Pedregal Towers', 'Plaza Bonita', 'Portofino', 'Puerta Cabos Village', 'Terrasol', 'Tesoro', 'The Five', 'The Mountain Club at Pedregal', 'The O Pedregal', 'The Paraiso Residences', 'Villa La Estancia'],
        'CSL-Centro': ['Agua Luna', 'Arenal', 'Best Suites', 'Blue Bay-Uptown', 'Breeze of Cabo', 'Cabo Peninsula Residences', 'Cardinal Living', 'Centro', 'Centro-CSL North', 'Coromuel', 'Costa Mare', 'Fracc Lomas Del Cabo', 'HD III', 'HD IV', 'La Isla', 'Lienzo Charro', 'Lunaterra II', 'Luxotica III', 'Luxotica IV', 'Master Plaza Center 36', 'Miro Los Cabos', 'Morgan Residences', 'Quintas California', 'San Charbel', 'Sea Breeze', 'Sea Breeze II', 'Sky Town', 'Sunset', 'Sunset:General', 'Sunset Hills', 'Terra 192', 'Terra 194', 'Uptown:General', 'Villa Dorada', 'Vista Mare', 'Vista Panorama', 'White 12', 'Xantus Residences'],
        'CSL Cor-Inland': ['Alba Residences', 'Avalon', 'Balena', 'Betanya', 'Cabo Costa', 'Cabo Costa Mirador', 'Cabo del Mar Ecopark', 'Camino del Mar', 'Casa Mex-Agaves', 'Catania', 'Chileno Inland-General', 'Ciruelos', 'Colinas del Tezal', 'Cresta del Mar', 'CSL C/Club Golf', 'Cuatrovientos', 'Cumbre del Tezal', 'Dream Tezal', 'Duara', 'El Tezal E;General', 'El Tezal W:General', 'Hermitage', 'Kaikoura', 'Kamu Living', 'La Mar', 'La Noria', 'Las Misiones', 'La Vista', 'Lucca Tower', 'Lumaria', 'Luna del Tezal', 'Maranata', 'Marazul', 'Maroma Los Cabos', 'Mistiq Los Cabos', 'Monte Rocella', 'Ocean Plaza', 'Optimus Residences', 'OR Cabo Boutique Residences', 'Panorama', 'Plaza Costa Mar', 'Plaza Las Olas', 'Puerta de Hierro', 'Punta Arena', 'Rancho Paraiso', 'Rancho Paraiso Ests', 'Rancho Par-El Cielito', 'Rivieri', 'Sabina Residencial', 'San Miguel', 'Santa Lucia', 'Sierra Dorada', 'Solaria', 'Tamar', 'Terrazas al Cortez', 'Torre Catalina', 'Toscana Residences', 'Tramonti', 'Tramonti Paradiso', 'Ventanas', 'Veranda Residences', 'Villas del Tezal', 'Villas Neptuno', 'Vistana', 'Vista Real Upper', 'Vistas del Tezal', 'Vista Vela', 'Vista Vela III', 'Vista Vela Sunset', 'Vista Vella II', 'Vistazul', 'White Lotus'],
        'CSL-Corr. Oceanside': ['Amaterra', 'Bahia del Tezal', 'Brisas', 'Cabo Bello', 'Chileno Bay', 'Cove Club', 'El Tezal-OceanSide:General', 'Esperanza', 'Las Colinas', 'Las Posadas', 'Las Residencias', 'Las Villas', 'Misiones del Cabo', 'Playa del Rey', 'Puerta del Sol-CDSol', 'Santa Carmela', 'The Shores', 'Vista Azul'],
        'CSL-North': ['Altamira Condominios Plus', 'Arcoiris', 'Brisas del Pac East', 'Brisas del Pacifico E', 'Brisas del Pacifico W', 'Cangrejos', 'Colinas de Cabo Baja', 'Condominios CL II', 'CSL N-E of19:Genral', 'CSL N- W 19- General', 'El Progreso', 'Hojazen', 'Jacarandas', 'Lomas del Faro', 'Lomas del Pacifico', 'Lomas del Sol', 'Luna Park', 'Maralta', 'Mesa Colorada', 'Miramar', 'Palma Real', 'Palmitos Residencial', 'Plaza Elam', 'Portales', 'Terranova'],
        'East Cape North': ['Baja Martires', 'Bay of Dreams', 'Boca del Alamo', 'Buena Vista', 'Buenos Aires', 'B.Vista/Barilles-Gen', 'Centro-Los Barriles', 'Colina del Sol', 'El Cardonal', 'Itzamatul', 'Las Tinas', 'La Ventana', 'Los Barriles', 'Nrth of Barilles-Gen', 'Pallisades', 'Palo Blanco', 'Punta Pescadero', 'San Bartolo', 'Santa Maria', 'Spa Buena Vista', 'Vista Antigua', 'Vista Las Brisas'],
        'East Cape South': ['Bahia Terranova', 'Boca del Salado', 'Cabo Pulmo', 'Cabo Riviera', 'Castillo de Arena', 'Costa de Oro', 'Costa Palmas Golf Residences', 'Costa Palmas Marina Residences', 'La Ribera', 'La Ribera General', 'Las Barracas', 'Las Cuevas', 'Las Lomas I', 'Las Lomas II', 'Lighthouse Point Est', 'Los Frailes', 'Miraflores', 'Mira & Santi General', 'Nine Palms', 'Pindojo', 'Playa Colorada', 'Playa Tortuga', 'Punta Perfecta', 'Rancho Leonero', 'Rancho Tortuga', 'San Luis', 'Santa Cruz', 'Santiago', 'Shipwrecks', 'Sofia Habitat', 'Vinorama', 'Vinorama Estates', 'Vinoramas', 'Zacatitos'],
        'SJD-Beachside': ['Albaluz', 'El Zalate', 'Emma', 'La Jolla', 'Las Olas', 'Nolah', 'SJD-CostaAzulBch:Gen', 'Soleado', 'Tortuga Bay', 'Viceroy Residences', 'Viva'],
        'SJD-Centro': ['1  Ro de Mayo', 'Centro-SJD', 'Chamizal', 'Chamizal, EL', 'Chula Vista', 'Healios Consultorios', 'Laiva Art Walk', 'Magisterial', 'Mauricio Castro', 'Providence', 'SJD above 1:General', 'SJD D/town:General'],
        'SJD Corr-Inland': ['Antigua', 'Bugambilias', 'Cabo Colo-Inland:Gen', 'Colorado Hills', 'El Tule-Inland:General', 'La Reserva at Querencia', 'Las Villas', 'Oasis Palmilla', 'Palmilla Dunes', 'Palmilla Estates', 'ResidenciasLomasTule', 'Section 10- El Parque', 'Section 12- Las Cabanas', 'Section 13- El Lago', 'Section 14- El Campo', 'Section 18- Horizontes', 'Section 19', 'Section 19- LaVista-LaLoma', 'Section 1- Las Colinas', 'Section 22F- La Montana', 'Section 29- La Cresta', 'Section 3- El Valle', 'Section 4- Las Canadas', 'Section 6- Las Verandas', 'The Canyon  Entre Piedras', 'Velamar', 'Villas de Oro', 'Vista Colorada', 'Vistamar'],
        'SJD Corr-Oceanside': ['Cabo Colo-Ocean:Gen', 'Cabo Colorado', 'Caleta Loma', 'Casa del Mar', 'Espiritu del Mar', 'La Caleta', 'Las Ventanas', 'Palmilla Norte', 'Punta Bella', 'Rancho Cerro Colorado', 'Santarena', 'Section 28- Ocean Residences', 'Solaz Residences', 'Villas del Mar'],
        'SJD-East': ['BLANC de Mar', 'Cabo Cortez', 'El Altillo', 'El Encanto', 'El Rincon-SJD Marina', 'Fundadores', 'La Choya', 'Laguna Hills', 'Laguna Spring', 'La Laguna', 'La Noria', 'La Playita', 'Las Palmas (CSL Airport)', 'One Marina Place', 'Proyecto Cuatro', 'Salada', 'Sendero San Jose', 'SJD Marina:General', 'West Enclave Ritz-Carlton'],
        'SJD-Inland/Golf': ['Alegranza', 'Casa Nima', 'Cenit', 'Club La Costa', 'Cora', 'Finisterra', 'Gringo Hill', 'Hacienda Los Cabos', 'La Canada', 'La Cima', 'Larena', 'Loma Linda', 'Lomas de la Jolla', 'Lomas del Desierto', 'Los Valles', 'Mare', 'Mirador', 'Montecitos', 'Muralla', 'Paramo', 'Pueblo Campestre', 'Residencial La Jolla', 'SJD Hills:General', 'SJD-Inland/Golf:Gen', 'Terrazas Costa Azul', 'Villas de México', 'Vista Hermosa', 'Vista Lagos'],
        'SJD-North': ['Airport', 'El Rosarito', 'Las Varedas', 'Las Veredas', 'Lomas del Rosarito', 'Monte Real', 'San Jose Viejo', 'Santa Rosa', 'SJD N,W of 1:General', 'Torres San Jose', 'Vista Hermosa', 'Zacatal'],
        'Cerro Colorado': ['Cabo Colorado', 'Ladera Phase 1', 'Rancho Cerro Colorado'],
        'Pacific North': ['Agua Blanca', 'Ahorcadita', 'Centro-Todos Santos', 'Conquista Agraria NCPE', 'El Posito', 'La Cachora', 'La Maquina', 'La Pastora', 'La Poza', 'Las Brisas-Esencia', 'Las Brisas- Todos Santos', 'Las Playitas', 'Las Tunas', 'Palms Garden Residences', 'Playas Pacificas', 'Playitas Norte', 'San Sebastian', 'Todos Santos-General', 'Todos Santos Nth-Gen', 'Todos Santos Town House'],
        'Pacific South': ['Alvar', 'Beach Estates', 'Cantinas', 'Cerritos', 'Cerritos 2097', 'Cerritos/Pesca-Genrl', 'Cerritos Sunrise', 'Ciudad Cerritos', 'Copala', 'Coronado', 'Diamante Dunes Residence', 'Dunes Residence Club', 'El Cardonal', 'Elias Calles', 'Elias Calles-Gen', 'Gallo 64', 'Golf Villas', 'Halo of Cerritos', 'Las Casas', 'Las Terrazas', 'Mavila', 'Migaloo', 'Migrino', 'Migrino-Gen', 'Oasis del Mar', 'Ocean Club Residences', 'Old Lighthouse Club Hacienda', 'Pacific Bay', 'Palm Beach', 'Pescadero', 'Pueblo Pescadero', 'Punta Lobos', 'RanchoLasMargaritas', 'Rancho Nuevo', 'Rolling Hills', 'San Cristobal', 'San Cristobal-Gen', 'St Regis Residences', 'Sunset Hill', 'Surfside Residences', 'The Cliff at Cerritos', 'The Tequila Ranch', 'The Villas-Rcho Sn Lucas', 'Tuna Pescadero', 'Villas de Cerritos Beach'],
        'San Juan de la Costa': ['El Cajete', 'San Juan de la Costa'],
        'LaPaz Beach': ['Costa Baja Resort', 'LaPaz Beach Subdivision', 'Paraiso del Mar', 'Pedregal', 'Playa de la Paz'],
        'Los Planes': ['Ejido Juan Dominguez Cota'],
        'El Sargento': ['El Sargento'],
        'La Ventana': ['La Ventana', 'Seila'],
        'Loreto': ['Centro', 'General', 'San Cosme Gen'],
        'Nopolo': ['Agua Viva', 'Founders', 'General'],
        'Excondido South': ['Waicuri 1', 'Waicuri 2'],
        'Ejidos': ['La Purisima'],
        'Mulege': ['Centro', 'General'],
        'Scorpion Bay': ['San Juanico'],
    };

    // Resto del método de carga de subdivisiones
    this.state.subdivisions = subdivisionMap[location] || [];
    
    // Actualizar las opciones de subdivisión
    this.filterDefinitions.subdivision.options = [
        { value: '', label: 'All Subdivisions' },
        ...this.state.subdivisions.map(sub => ({
            value: sub, 
            label: sub
        }))
    ];

    // Si hay un select de subdivisiones, actualizarlo
    const subdivisionSelect = document.getElementById('subdivision');
    if (subdivisionSelect) {
        subdivisionSelect.innerHTML = this.filterDefinitions.subdivision.options.map(option => 
            `<option value="${option.value}">${option.label}</option>`
        ).join('');
    }
},

    init() {
        this.initializeFilters();
        this.initializePriceRangeSlider();
        this.initializeMLSSearch();
        this.loadSavedFilters();
        this.bindEvents();
        this.state.initializing = false;
    },

    initializeFilters() {
        Object.entries(this.filterDefinitions).forEach(([filterId, definition]) => {
            const select = document.getElementById(filterId);
            if (select) {
                select.innerHTML = definition.options.map(option => 
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
            }
        });
    },

    initializeMLSSearch() {
        const searchInput = document.getElementById('mlsSearch');
        if (!searchInput) return;
    
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) {
                delete this.state.activeFilters.propertyId;
                this.updateFilterTags();
            } else {
                this.state.activeFilters.propertyId = value;
                this.updateFilterTags();
            }
        });
    },

    initializePriceRangeSlider() {
        const sliderElement = document.getElementById('priceSlider');
        if (!sliderElement) return;

        this.state.priceSliderInstance = noUiSlider.create(sliderElement, {
            start: [this.state.minPrice, this.state.maxPrice],
            connect: true,
            range: {
                'min': this.state.minPrice,
                'max': this.state.maxPrice
            },
            step: 50000,
            format: {
                to: value => Math.round(value),
                from: value => Number(value)
            },
            tooltips: [
                {
                    to: value => Formatters.formatPrice(value),
                    from: value => Number(value.replace(/[^\d.-]/g, ''))
                },
                {
                    to: value => Formatters.formatPrice(value),
                    from: value => Number(value.replace(/[^\d.-]/g, ''))
                }
            ]
        });

        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');

        if (minPriceInput && maxPriceInput) {
            this.state.priceSliderInstance.on('update', (values, handle) => {
                const [min, max] = values;
                minPriceInput.value = Formatters.formatPrice(min);
                maxPriceInput.value = Formatters.formatPrice(max);
            });

            [minPriceInput, maxPriceInput].forEach((input, index) => {
                input.addEventListener('change', (e) => {
                    const value = parseFloat(e.target.value.replace(/[^\d.-]/g, ''));
                    if (!isNaN(value)) {
                        const values = this.state.priceSliderInstance.get();
                        values[index] = value;
                        this.state.priceSliderInstance.set(values);
                    }
                });
            });
        }
    },

    togglePriceSlider() {
        const modal = document.getElementById('priceSliderModal');
        if (modal) {
            modal.classList.toggle('show');
            document.body.style.overflow = modal.classList.contains('show') ? 'hidden' : '';
        }
    },

    applyPriceRange() {
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        const priceSelect = document.getElementById('priceRange');
        
        const min = parseFloat(minInput.value.replace(/[^\d.-]/g, ''));
        const max = parseFloat(maxInput.value.replace(/[^\d.-]/g, ''));
        
        let value;
        if (max >= this.state.maxPrice || !max) {
            value = `${min}-`;
        } else {
            value = `${min}-${max}`;
        }
        
        let customOption = Array.from(priceSelect.options).find(option => option.classList.contains('custom-range'));
        if (!customOption) {
            customOption = document.createElement('option');
            customOption.classList.add('custom-range');
            priceSelect.appendChild(customOption);
        }
    
        const label = max >= this.state.maxPrice ? 
            `${Formatters.formatPrice(min)}+` : 
            `${Formatters.formatPrice(min)} - ${Formatters.formatPrice(max)}`;
        
        customOption.value = value;
        customOption.textContent = label;
        
        priceSelect.value = value;
        
        this.updateFilter('priceRange', value);
        this.togglePriceSlider();
    },

    handleRegionSelection(regionKey) {
        // Si es una selección de región, tomar la primera ubicación
        if (regionKey.startsWith('all-')) {
            const regionLocations = this.regions[regionKey] || [];
            
            if (regionLocations.length > 0) {
                // Seleccionar la primera ubicación de la región
                const firstLocation = regionLocations[0];
                console.log(`Seleccionando ${firstLocation} como representante para la región ${regionKey}`);
                return firstLocation;
            }
        }
        
        // Si no es una región o no tiene ubicaciones, devolver la key original
        return regionKey;
    },
    

    updateFilter(filterType, value) {
        if (!value || value === '') {
            delete this.state.activeFilters[filterType];
        } else {
            // Manejar regiones de manera especial
            if (filterType === 'location') {
                value = this.handleRegionSelection(value);
            }
            
            this.state.activeFilters[filterType] = value;
        }
    
        // Solo actualizamos el almacenamiento y los tags visuales
        StorageService.saveFilters(this.state.activeFilters);
        this.updateFilterTags();
        APP_STATE.activeFilters[filterType] = value;
    },

    clearAllFilters() {
        if (this.state.isClearing) return;
        this.state.isClearing = true;
    
        // Limpiar selects
        document.querySelectorAll('select[id]').forEach(select => {
            select.value = '';
        });
    
        // Limpiar checkboxes de filtros avanzados
        document.querySelectorAll('.feature-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    
        // Limpiar MLS
        const mlsSearch = document.getElementById('mlsSearch');
        if (mlsSearch) mlsSearch.value = '';
    
        // Limpiar slider
        if (this.state.priceSliderInstance) {
            this.state.priceSliderInstance.set([this.state.minPrice, this.state.maxPrice]);
        }
    
        this.state.activeFilters = {};
        APP_STATE.activeFilters = {};
        StorageService.saveFilters({});
        this.updateFilterTags();
    
        // Limpiar resultados
        updateResults([]);
        updateMarkers([]);
    
        NotificationService.success('All filters have been cleared', {
            duration: 2000
        });
    
        setTimeout(() => {
            this.state.isClearing = false;
        }, 100);
    },

    toggleAdvancedFilters() {
        const advancedFilters = document.getElementById('advancedFilters');
        const toggleBtn = document.querySelector('.advanced-filters-toggle i.fa-chevron-down, .advanced-filters-toggle i.fa-chevron-up');
        
        if (advancedFilters) {
            this.state.advancedFiltersVisible = !this.state.advancedFiltersVisible;
            
            if (this.state.advancedFiltersVisible) {
                advancedFilters.style.display = 'block';
                setTimeout(() => {
                    advancedFilters.classList.add('show');
                    toggleBtn?.classList.replace('fa-chevron-down', 'fa-chevron-up');
                }, 10);
            } else {
                advancedFilters.classList.remove('show');
                toggleBtn?.classList.replace('fa-chevron-up', 'fa-chevron-down');
                setTimeout(() => {
                    advancedFilters.style.display = 'none';
                }, 300);
            }
        }
    },


















    updateFilterTags() {
        const container = document.getElementById('filterTags');
        if (!container) return;
    
        const tags = Object.entries(this.state.activeFilters)
            .filter(([_, value]) => value)
            .map(([type, value]) => {
                let displayValue = value;
                const filterDef = this.filterDefinitions[type];
    
                switch(type) {
                    case 'priceRange':
                        const [min, max] = value.split('-');
                        displayValue = max ? 
                            `${Formatters.formatPrice(min)} - ${Formatters.formatPrice(max)}` : 
                            `${Formatters.formatPrice(min)}+`;
                        break;
                    case 'propertyId':
                        displayValue = `MLS: ${value}`;
                        break;
                    case 'bedrooms':
                    case 'bathrooms':
                        displayValue = `${value}+`;
                        break;
                    case 'virtualTour':
                        displayValue = 'Virtual Tour';
                        break;
                    case 'openHouse':
                        displayValue = 'Open House';
                        break;
                    case 'beachfront':
                        displayValue = 'Beachfront';
                        break;
                    case 'oceanView':
                        displayValue = 'Ocean View';
                        break;
                    case 'pool':
                        displayValue = 'Pool';
                        break;
                    case 'cfe':
                        displayValue = 'CFE';
                        break;
                    case 'furnished':
                        displayValue = 'Furnished';
                        break;
                    case 'garage':
                        displayValue = 'Garage';
                        break;
                    case 'gated':
                        displayValue = 'Gated Community';
                        break;
                    case 'petFriendly':
                        displayValue = 'Pet Friendly';
                        break;
                    case 'newListing':
                        displayValue = 'New Listing';
                        break;
                    case 'priceReduced':
                        displayValue = 'Price Reduced';
                        break;
                    default:
                        if (filterDef) {
                            const option = filterDef.options.find(opt => opt.value === value);
                            if (option)
                                displayValue = option.label;
                    }
                    break;
                }
    
                const filterNames = {
                    propertyType: 'Type',
                    location: 'Location',
                    priceRange: 'Price',
                    bedrooms: 'Beds',
                    bathrooms: 'Baths',
                    propertyId: 'MLS ID',
                    virtualTour: 'Feature',
                    openHouse: 'Feature',
                    beachfront: 'Feature',
                    oceanView: 'Feature',
                    pool: 'Feature',
                    cfe: 'Feature',
                    furnished: 'Feature',
                    garage: 'Feature',
                    gated: 'Feature',
                    petFriendly: 'Feature',
                    newListing: 'Status',
                    priceReduced: 'Status'
                };
    
                return `
                    <div class="filter-tag" data-filter-type="${type}">
                        <span>${filterDef?.label || filterNames[type] || type}: ${displayValue}</span>
                        <button class="remove-filter" 
                                onclick="FilterService.removeFilter('${type}')"
                                aria-label="Remove ${filterDef?.label || type} filter">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
    
        container.innerHTML = tags.join('');
    
        const activeFilters = document.getElementById('activeFilters');
        if (activeFilters) {
            const hasFilters = tags.length > 0;
            if (hasFilters) {
                activeFilters.style.display = 'block';
                setTimeout(() => {
                    activeFilters.style.opacity = '1';
                    activeFilters.style.transform = 'translateY(0)';
                }, 10);
            } else {
                activeFilters.style.opacity = '0';
                activeFilters.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    activeFilters.style.display = 'none';
                }, 300);
            }
        }
    },








    



















    removeFilter(filterType) {
        const tag = document.querySelector(`.filter-tag[data-filter-type="${filterType}"]`);
        if (tag) {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                const select = document.getElementById(filterType);
                if (select) select.value = '';
    
                if (filterType === 'propertyId') {
                    const mlsSearch = document.getElementById('mlsSearch');
                    if (mlsSearch) mlsSearch.value = '';
                }
    
                if (filterType === 'priceRange' && this.state.priceSliderInstance) {
                    this.state.priceSliderInstance.set([this.state.minPrice, this.state.maxPrice]);
                }
    
                delete this.state.activeFilters[filterType];
                StorageService.saveFilters(this.state.activeFilters);
                this.updateFilterTags();
                APP_STATE.setFilter(filterType, '');
            }, 300);
        }
    },


















































































    

    async applyFilters() {
        if (this.state.isValidating) return;
        this.state.isValidating = true;
    
        const activeFilters = this.getActiveFilters();
        
        // Lista de todos los filtros avanzados (checkboxes)
        const advancedFilters = [
            'virtualTour', 'openHouse', 'beachfront', 'oceanView', 
            'pool', 'cfe', 'furnished', 'garage', 'gated', 
            'petFriendly', 'newListing', 'priceReduced'
        ];
        
        // Verificar qué filtros avanzados están activos
        const activeAdvancedFilters = advancedFilters.filter(filter => activeFilters[filter]);
        const hasAdvancedFilters = activeAdvancedFilters.length > 0;
        
        // Si hay un MLS ID, mostramos directamente la propiedad
        if (activeFilters.propertyId) {
            try {
                const property = await ApiService.getProperty(activeFilters.propertyId);
                if (property) {
                    PropertyModal.show(activeFilters.propertyId);
                    this.state.isValidating = false;
                    return;
                }
            } catch (error) {
                console.error('Error loading property:', error);
                NotificationService.error('Property not found');
                this.state.isValidating = false;
                return;
            }
        }
    
        // Validación de filtros mínimos solo si no hay MLS ID
        // No contamos los filtros avanzados para la validación mínima
        const regularFilters = {...activeFilters};
        advancedFilters.forEach(filter => {
            if (regularFilters[filter]) delete regularFilters[filter];
        });
        
        const filterCount = Object.values(regularFilters).filter(Boolean).length;
        if (filterCount < 2 && !hasAdvancedFilters) {
            NotificationService.warning('Please select at least 2 filters to search', {
                title: 'More filters required',
                duration: 3000
            });
            this.state.isValidating = false;
            return;
        }
    
        showLoadingOverlay();
        try {
            // Crear una copia de los filtros para el servidor
            let serverFilters = {...activeFilters};
            
            // Remover filtros avanzados para procesarlos en el cliente
            advancedFilters.forEach(filter => {
                if (serverFilters[filter]) delete serverFilters[filter];
            });
            
            // Verificar si tenemos un filtro de región
            let locationsToQuery = [];
            
            if (serverFilters.location && serverFilters.location.startsWith('all-')) {
                const regionKey = serverFilters.location;
                const regionLocations = this.regions[regionKey] || [];
                
                if (regionLocations.length > 0) {
                    // Usar solo la primera ubicación de la región para evitar errores
                    locationsToQuery = regionLocations.slice(0, 1);
                    console.log(`Buscando propiedades para región ${regionKey}, usando ubicación: ${locationsToQuery[0]}`);
                }
            } else if (serverFilters.location) {
                // Si es una ubicación específica, la agregamos al array
                locationsToQuery = [serverFilters.location];
            }
            
            let allProperties = [];
            
            // Si hay ubicaciones para consultar, las procesamos una por una
            if (locationsToQuery.length > 0) {
                for (const location of locationsToQuery) {
                    try {
                        // Hacer una copia de los filtros para cada consulta
                        const currentFilters = {...serverFilters, location};
                        
                        console.log(`Buscando propiedades para ubicación: ${location}`);
                        const result = await ApiService.searchProperties(currentFilters);
                        
                        if (result.properties && Array.isArray(result.properties)) {
                            allProperties = [...allProperties, ...result.properties];
                        }
                    } catch (error) {
                        console.warn(`Error al buscar propiedades para ${location}:`, error);
                        // Continuamos con la siguiente ubicación
                    }
                }
            } else {
                // Si no hay ubicaciones específicas, hacemos una consulta general
                console.log('Enviando filtros al servidor:', serverFilters);
                const result = await ApiService.searchProperties(serverFilters);
                
                if (result.properties && Array.isArray(result.properties)) {
                    allProperties = result.properties;
                }
            }
            
            if (!allProperties || !Array.isArray(allProperties)) {
                allProperties = [];
            }
    
            // Aplicar filtros avanzados en el cliente
            let filteredProperties = [...allProperties];
            let filtersApplied = false;
            
            // Filtro de tour virtual
            if (activeFilters.virtualTour) {
                filtersApplied = true;
                console.log('Aplicando filtro de tour virtual en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    return (property.virtualtourscount && property.virtualtourscount > 0) || 
                           (property.vTours && property.vTours.length > 0) || 
                           (property.vrTours && property.vrTours.length > 0);
                });
            }
            
            // Filtro de open house
            if (activeFilters.openHouse) {
                filtersApplied = true;
                console.log('Aplicando filtro de open house en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    return property.openhousescount && property.openhousescount > 0;
                });
            }
            
            // Filtro de ocean view
            if (activeFilters.oceanView) {
                filtersApplied = true;
                console.log('Aplicando filtro de ocean view en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    // Verificar en diferentes posibles campos
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'string') {
                        try {
                            const features = JSON.parse(property.exteriorfeatures);
                            return features['Ocean View'] === true;
                        } catch (e) {}
                    }
                    
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'object') {
                        return property.exteriorfeatures['Ocean View'] === true;
                    }
                    
                    // También buscar en otros campos posibles
                    if (property.publicremarks && property.publicremarks.toLowerCase().includes('ocean view')) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de beachfront
            if (activeFilters.beachfront) {
                filtersApplied = true;
                console.log('Aplicando filtro de beachfront en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    // Verificar en diferentes posibles campos
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'string') {
                        try {
                            const features = JSON.parse(property.exteriorfeatures);
                            return features['Beachfront'] === true;
                        } catch (e) {}
                    }
                    
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'object') {
                        return property.exteriorfeatures['Beachfront'] === true;
                    }
                    
                    // También buscar en otros campos posibles
                    if (property.publicremarks && 
                        (property.publicremarks.toLowerCase().includes('beachfront') || 
                         property.publicremarks.toLowerCase().includes('beach front'))) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de pool
            if (activeFilters.pool) {
                filtersApplied = true;
                console.log('Aplicando filtro de pool en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    // Verificar si hay features de piscina
                    return property.poolfeatures !== null;
                });
            }
            
            // Filtro de CFE
            if (activeFilters.cfe) {
                filtersApplied = true;
                console.log('Aplicando filtro de CFE en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    if (property.electric && typeof property.electric === 'string') {
                        try {
                            const electric = JSON.parse(property.electric);
                            return electric && electric.CFE === true;
                        } catch (e) {}
                    }
                    
                    if (property.electric && typeof property.electric === 'object') {
                        return property.electric.CFE === true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de furnished
            if (activeFilters.furnished) {
                filtersApplied = true;
                console.log('Aplicando filtro de furnished en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    if (property.interiorfeatures && typeof property.interiorfeatures === 'string') {
                        try {
                            const features = JSON.parse(property.interiorfeatures);
                            return features['Furnished'] === true;
                        } catch (e) {}
                    }
                    
                    if (property.interiorfeatures && typeof property.interiorfeatures === 'object') {
                        return property.interiorfeatures['Furnished'] === true;
                    }
                    
                    // También buscar en otros campos posibles
                    if (property.publicremarks && property.publicremarks.toLowerCase().includes('furnished')) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de garage
            if (activeFilters.garage) {
                filtersApplied = true;
                console.log('Aplicando filtro de garage en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'string') {
                        try {
                            const features = JSON.parse(property.exteriorfeatures);
                            return features['Garage'] === true;
                        } catch (e) {}
                    }
                    
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'object') {
                        return property.exteriorfeatures['Garage'] === true;
                    }
                    
                    // También buscar en otros campos posibles
                    if (property.publicremarks && property.publicremarks.toLowerCase().includes('garage')) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de gated community
            if (activeFilters.gated) {
                filtersApplied = true;
                console.log('Aplicando filtro de gated community en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'string') {
                        try {
                            const features = JSON.parse(property.exteriorfeatures);
                            return features['Gated'] === true || features['Gated Community'] === true;
                        } catch (e) {}
                    }
                    
                    if (property.exteriorfeatures && typeof property.exteriorfeatures === 'object') {
                        return property.exteriorfeatures['Gated'] === true || 
                               property.exteriorfeatures['Gated Community'] === true;
                    }
                    
                    // También buscar en otros campos posibles
                    if (property.publicremarks && 
                        (property.publicremarks.toLowerCase().includes('gated community') || 
                         property.publicremarks.toLowerCase().includes('gated'))) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Filtro de pet friendly
            if (activeFilters.petFriendly) {
                filtersApplied = true;
                console.log('Aplicando filtro de pet friendly en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    return property.petsallowed === true || 
                           (property.petsallowed && property.petsallowed.toLowerCase() === 'yes');
                });
            }
            
            // Filtro de new listing
            if (activeFilters.newListing) {
                filtersApplied = true;
                console.log('Aplicando filtro de new listing en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    return property.majorchangetype === 'New Listing';
                });
            }
            
            // Filtro de price reduced
            if (activeFilters.priceReduced) {
                filtersApplied = true;
                console.log('Aplicando filtro de price reduced en el cliente');
                filteredProperties = filteredProperties.filter(property => {
                    return property.majorchangetype === 'Price Change';
                });
            }
            
            console.log(`Propiedades después de aplicar filtros avanzados: ${filteredProperties.length} de ${allProperties.length}`);
            
            const sortedListings = this.sortProperties(filteredProperties);
            updateResults(sortedListings);
            updateMarkers(sortedListings);
            
            // Mostrar notificación si se aplicaron filtros pero no hay resultados
            if (filtersApplied && allProperties.length > 0 && filteredProperties.length === 0) {
                NotificationService.info('No properties found matching all your advanced filter criteria', {
                    title: 'Filter Results',
                    duration: 4000
                });
            } else if (allProperties.length === 0) {
                // Si no hay propiedades, mostrar un mensaje
                NotificationService.info('No properties found with the selected filters. Try different criteria.', {
                    title: 'No Results',
                    duration: 4000
                });
            }
            
        } catch (error) {
            console.error('Error applying filters:', error);
            NotificationService.error('Error searching properties. Please try with different filters.');
            updateResults([]);
            updateMarkers([]);
        } finally {
            hideLoadingOverlay();
            this.state.isValidating = false;
        }
    },


































































































    sortProperties(properties, sortBy = 'priceDesc') {
        return [...properties].sort((a, b) => {
            switch(sortBy) {
                case 'priceDesc':
                    return parseFloat(b.currentpricepublic) - parseFloat(a.currentpricepublic);
                case 'priceAsc':
                    return parseFloat(a.currentpricepublic) - parseFloat(b.currentpricepublic);
                default:
                    return 0;
            }
        });
    },

    loadSavedFilters() {
        this.state.activeFilters = {};
        this.applyFiltersToInputs();
        return {};
    },

    applyFiltersToInputs() {
        console.log('applyFiltersToInputs function');
        Object.entries(this.state.activeFilters).forEach(([type, value]) => {
            const input = document.getElementById(type);
            if (input) {
                input.value = value;
            }
    
            if (type === 'propertyId') {
                const mlsSearch = document.getElementById('mlsSearch');
                if (mlsSearch) mlsSearch.value = value;
            }
    
            if (type === 'priceRange' && this.state.priceSliderInstance) {
                const [min, max] = value.split('-');
                this.state.priceSliderInstance.set([
                    parseFloat(min),
                    max ? parseFloat(max) : this.state.maxPrice
                ]);
            }
            
            // Restaurar estado de checkboxes
            if (['virtualTour', 'openHouse', 'beachfront', 'oceanView', 'pool', 'cfe', 
                 'furnished', 'garage', 'gated', 'petFriendly', 'newListing', 'priceReduced'].includes(type)) {
                const checkbox = document.querySelector(`input[name="${type}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        });
    
        this.updateFilterTags();
    },

    getActiveFilters() {
        // Crear una copia para no modificar el estado original
        const filters = {...this.state.activeFilters};
        
        // Verificar si hay checkboxes marcados en los filtros avanzados
        document.querySelectorAll('.feature-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
            // Asegurar que los valores de los checkboxes se incluyan en los filtros activos
            filters[checkbox.name] = checkbox.value;
        });
        
        return filters;
    },

    bindEvents() {
        // Los selectores ahora solo actualizan el estado
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateFilter(e.target.id, e.target.value);
            });
        });
    
        // Agregar eventos para los checkboxes (añadir esta parte)
        document.querySelectorAll('.feature-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const { name, checked } = e.target;
                if (checked) {
                    this.updateFilter(name, e.target.value);
                } else {
                    this.removeFilter(name);
                }
            });
        });
    
        // El botón de búsqueda ahora es el único que dispara la búsqueda
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }
    
        // El formulario también dispara la búsqueda
        const searchForm = document.querySelector('.basic-filters');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }
    
        const clearAllBtn = document.querySelector('.clear-all-filters');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllFilters());
        }
    
        // Eventos del slider de precio
        document.getElementById('filterTags')?.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-filter');
            if (removeBtn) {
                const filterType = removeBtn.dataset.filterType;
                if (filterType) {
                    this.removeFilter(filterType);
                }
            }
        });
    }
};

// Inicializar el servicio
FilterService.init();

// Exportar para uso global
window.FilterService = FilterService;
// =========== FIN: services/filterService.js ===========

// =========== INICIO: services/shareService.js ===========

const ShareService = {
    baseUrl: window.location.origin + window.location.pathname,
    
    init() {
        this.handleSharedProperty();
        window.addEventListener('popstate', () => {
            this.handleSharedProperty();
        });

        // Escuchar mensajes del padre si estamos en un iframe
        if (window !== window.top) {
            window.addEventListener('message', (event) => {
                // Verificar origen si es necesario
                if (event.data.type === 'showProperty') {
                    this.handleSharedProperty();
                }
            });
        }
    },

    generateShareUrl(propertyId) {
        const url = new URL(this.baseUrl);
        url.searchParams.set('property', propertyId);
        return url.toString();
    },

    async handleSharedProperty() {
        const params = new URLSearchParams(window.location.search);
        const propertyId = params.get('property');
        
        if (propertyId) {
            try {
                const property = await ApiService.getProperty(propertyId);
                if (property) {
                    setTimeout(() => {
                        PropertyModal.show(propertyId);
                    }, 500);

                    if (PropertyMap && PropertyMap.focusMarker) {
                        PropertyMap.focusMarker(propertyId);
                    }

                    // Notificar al padre si estamos en un iframe
                    if (window !== window.top) {
                        window.parent.postMessage({
                            type: 'propertySelected',
                            propertyId: propertyId,
                            property: {
                                title: property.streetadditionalinfo || property.propertytypelabel,
                                description: property.publicremarks,
                                type: property.propertytypelabel,
                                location: property.mlsareamajor,
                                price: property.currentpricepublic,
                                image: property.photos?.[0]?.Uri1600 || ''
                            }
                        }, '*');
                    }
                }
            } catch (error) {
                console.error('Error loading shared property:', error);
                NotificationService.error('Error loading property');
            }
        }
    },

    async shareProperty(propertyId) {
        try {
            const property = await ApiService.getProperty(propertyId);
            if (!property) return;

            const shareUrl = this.generateShareUrl(propertyId);
            const shareText = `Check out this ${property.propertytypelabel} in ${property.city}!`;

            // Intentar usar la API de compartir si está disponible
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: property.streetadditionalinfo || property.propertytypelabel,
                        text: shareText,
                        url: shareUrl
                    });
                    return;
                } catch (error) {
                    // Si falla el share nativo, continuamos con el fallback
                    console.warn('Native share failed:', error);
                }
            }

            // Fallback: Copiar al portapapeles
            try {
                await navigator.clipboard.writeText(shareUrl);
                NotificationService.success('Link copied to clipboard!', {
                    title: 'Share Property',
                    duration: 2000
                });
            } catch (error) {
                // Fallback manual si clipboard API no está disponible
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = shareUrl;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    NotificationService.success('Link copied to clipboard!', {
                        title: 'Share Property',
                        duration: 2000
                    });
                } catch (err) {
                    NotificationService.info(
                        'Could not copy automatically. URL:\n' + shareUrl,
                        { title: 'Share Property', duration: 5000 }
                    );
                }
            }

            // Notificar al padre si estamos en un iframe
            if (window !== window.top) {
                window.parent.postMessage({
                    type: 'shareProperty',
                    propertyId,
                    url: shareUrl,
                    text: shareText,
                    property: {
                        title: property.streetadditionalinfo || property.propertytypelabel,
                        description: property.publicremarks,
                        type: property.propertytypelabel,
                        location: property.mlsareamajor,
                        price: property.currentpricepublic,
                        image: property.photos?.[0]?.Uri1600 || ''
                    }
                }, '*');
            }
        } catch (error) {
            console.error('Error sharing property:', error);
            NotificationService.error('Error sharing property');
        }
    }
};

// Inicializar el servicio
ShareService.init();

// Exportar para uso global
window.ShareService = ShareService;
// =========== FIN: services/shareService.js ===========

// =========== INICIO: services/mapService.js ===========

const MapService = {
    // Estado interno del servicio
    state: {
        map: null,
        markers: [],
        activeMarkerId: null,
        bounds: null
    },

    // Inicialización del mapa
    initializeMap(containerId, config = CONFIG.map) {
        try {
            if (this.state.map) {
                this.state.map.remove();
            }

            const map = L.map(containerId, {
                zoomControl: false,
                scrollWheelZoom: true
            }).setView(config.defaultCenter, config.defaultZoom);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(map);

            L.tileLayer(config.tileLayer, {
                attribution: config.attribution,
                maxZoom: 19
            }).addTo(map);

            this.state.map = map;
            return map;
        } catch (error) {
            console.error('Error initializing map:', error);
            return null;
        }
    },

    // Gestión de marcadores
    addMarkers(properties, onClick) {
        this.clearMarkers();
        const bounds = L.latLngBounds([]);

        properties.forEach(property => {
            if (!property.latitude || !property.longitude) return;

            const marker = L.marker([property.latitude, property.longitude], {
                icon: L.divIcon({
                    className: 'custom-marker-container',
                    html: this.createMarkerContent(property),
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            });

            marker.propertyId = property.id;

            marker.on('click', () => {
                if (onClick) onClick(property.id);
                this.highlightMarker(property.id);
            });

            marker.addTo(this.state.map);
            this.state.markers.push(marker);
            bounds.extend([property.latitude, property.longitude]);
        });

        if (!bounds.isEmpty()) {
            this.state.bounds = bounds;
            this.state.map.fitBounds(bounds.pad(0.1));
        }
    },

    // Limpieza de marcadores
    clearMarkers() {
        this.state.markers.forEach(marker => marker.remove());
        this.state.markers = [];
        this.state.activeMarkerId = null;
    },

    // Resaltar marcador
    highlightMarker(propertyId) {
        this.state.markers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                const markerDiv = element.querySelector('.map-marker');
                if (markerDiv) {
                    const isActive = marker.propertyId === propertyId;
                    markerDiv.classList.toggle('active', isActive);
                    element.style.zIndex = isActive ? 1000 : 1;
                }
            }
        });
        this.state.activeMarkerId = propertyId;
    },

    // Centrar mapa en un marcador
    focusMarker(propertyId) {
        const marker = this.state.markers.find(m => m.propertyId === propertyId);
        if (marker) {
            const latLng = marker.getLatLng();
            
            // Calculamos el centro del mapa ajustado
            const mapHeight = this.state.map.getContainer().clientHeight;
            const offset = mapHeight / 3; // Ajustamos el offset vertical
            
            // Obtenemos el punto en píxeles
            const point = this.state.map.project(latLng, 15);
            // Ajustamos la posición vertical para centrar
            point.y -= offset;
            // Convertimos de vuelta a coordenadas
            const adjustedLatLng = this.state.map.unproject(point, 15);
    
            this.state.map.flyTo(adjustedLatLng, 15, {
                animate: true,
                duration: 0.8
            });
            
            // Resaltamos el marcador
            this.highlightMarker(propertyId);
        }
    },

    // Crear contenido del marcador
    createMarkerContent(property) {
        const getMarkerClass = (propertyType) => {
            switch(propertyType.toLowerCase()) {
                case 'house':
                case 'houses': 
                    return 'marker-house';
                case 'condo':
                case 'condos': 
                    return 'marker-condo';
                case 'apartment':
                case 'apartments': 
                    return 'marker-apartment';
                case 'land': 
                    return 'marker-land';
                default: 
                    return 'marker-house';
            }
        };

        const getMarkerIcon = (propertyType) => {
            switch(propertyType.toLowerCase()) {
                case 'house':
                case 'houses': 
                    return 'fa-home';
                case 'condo':
                case 'condos': 
                    return 'fa-building';
                case 'apartment':
                case 'apartments': 
                    return 'fa-city';
                case 'land': 
                    return 'fa-mountain';
                default: 
                    return 'fa-home';
            }
        };

        const markerClass = getMarkerClass(property.propertytypelabel);
        const iconClass = getMarkerIcon(property.propertytypelabel);
        const isActive = property.id === this.state.activeMarkerId;
        
        return `
            <div class="map-marker ${markerClass} ${isActive ? 'active' : ''}">
                <i class="fas ${iconClass}"></i>
                <div class="marker-preview">
                    <div class="property-image">
                        <img src="${property.imageUrl?.Uri800 || property.photos?.[0]?.Uri800 || '/images/placeholder.jpg'}" 
                             alt="${property.propertytypelabel || 'Property'}"
                             loading="lazy">
                    </div>
                    <div class="preview-info">
                        <div class="property-type">
                            <i class="fas ${iconClass}"></i>
                            ${property.propertytypelabel}
                        </div>
                        <div class="property-location">
                            ${property.subdivisionname || ''}, ${property.city || ''}
                        </div>
                        <div class="property-price">
                            $${Number(property.currentpricepublic).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Actualizar mapa
    updateMap() {
        if (this.state.map) {
            this.state.map.invalidateSize();
            if (this.state.bounds && !this.state.bounds.isEmpty()) {
                this.state.map.fitBounds(this.state.bounds.pad(0.1));
            }
        }
    },

    // Limpieza
    destroy() {
        if (this.state.map) {
            this.clearMarkers();
            this.state.map.remove();
            this.state.map = null;
        }
    }
};

// Congelar el servicio para prevenir modificaciones
Object.freeze(MapService);
// =========== FIN: services/mapService.js ===========

// =========== INICIO: services/propertyService.js ===========

const PropertyService = {
    // Métodos de filtrado
    filterProperties(properties, filters) {
        return properties.filter(property => {
            // Filtrar por tipo de propiedad
            if (filters.propertyType && 
                property.propertytypelabel !== filters.propertyType) {
                return false;
            }

            // Filtrar por ubicación
            if (filters.location && 
                property.mlsareamajor !== filters.location) {
                return false;
            }

            // Filtrar por rango de precio
            if (filters.priceRange) {
                const [minStr, maxStr] = filters.priceRange.split('-');
                const price = parseInt(property.currentpricepublic);
                const min = parseInt(minStr);
                const max = maxStr ? parseInt(maxStr) : Infinity;
                
                if (price < min || price > max) {
                    return false;
                }
            }

            // Filtrar por número de habitaciones
            if (filters.bedrooms) {
                const minBeds = parseInt(filters.bedrooms);
                const beds = parseInt(property.bedstotal) || 0;
                if (beds < minBeds) {
                    return false;
                }
            }

            // Filtrar por número de baños
            if (filters.bathrooms) {
                const minBaths = parseFloat(filters.bathrooms);
                const baths = parseFloat(property.bathroomstotaldecimal) || 0;
                if (baths < minBaths) {
                    return false;
                }
            }

            return true;
        });
    },

    // Métodos de búsqueda
    searchProperties(properties, searchTerm) {
        const normalizedTerm = searchTerm.toLowerCase();
        return properties.filter(property => {
            return (
                property.streetadditionalinfo?.toLowerCase().includes(normalizedTerm) ||
                property.city?.toLowerCase().includes(normalizedTerm) ||
                property.subdivisionname?.toLowerCase().includes(normalizedTerm) ||
                property.publicremarks?.toLowerCase().includes(normalizedTerm)
            );
        });
    },

    // Métodos de ordenamiento
    sortProperties(properties, sortBy, sortOrder = 'asc') {
        return [...properties].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'price':
                    comparison = parseFloat(a.currentpricepublic) - parseFloat(b.currentpricepublic);
                    break;
                case 'bedrooms':
                    comparison = (parseInt(a.bedstotal) || 0) - (parseInt(b.bedstotal) || 0);
                    break;
                case 'bathrooms':
                    comparison = (parseFloat(a.bathroomstotaldecimal) || 0) - (parseFloat(b.bathroomstotaldecimal) || 0);
                    break;
                case 'area':
                    comparison = (parseFloat(a.buildingareatotal) || 0) - (parseFloat(b.buildingareatotal) || 0);
                    break;
                case 'city':
                    comparison = (a.city || '').localeCompare(b.city || '');
                    break;
                default:
                    return 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });
    },

    // Métodos de agrupación
    groupProperties(properties, groupBy) {
        return properties.reduce((groups, property) => {
            let key;
            switch (groupBy) {
                case 'type':
                    key = property.propertytypelabel || 'Other';
                    break;
                case 'city':
                    key = property.city || 'Unknown';
                    break;
                case 'priceRange':
                    const price = parseInt(property.currentpricepublic);
                    key = this.getPriceRange(price);
                    break;
                default:
                    key = 'Other';
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(property);
            return groups;
        }, {});
    },

    // Métodos de utilidad
    getPriceRange(price) {
        if (price <= 100000) return '0-100k';
        if (price <= 200000) return '100k-200k';
        if (price <= 300000) return '200k-300k';
        if (price <= 400000) return '300k-400k';
        return '400k+';
    },

    // Métodos de análisis
    analyzeProperties(properties) {
        const analysis = {
            totalCount: properties.length,
            averagePrice: 0,
            priceRange: { min: Infinity, max: -Infinity },
            typeDistribution: {},
            cityDistribution: {},
            averageBedrooms: 0,
            averageBathrooms: 0
        };

        properties.forEach(property => {
            // Análisis de precios
            const price = parseFloat(property.currentpricepublic);
            analysis.averagePrice += price;
            analysis.priceRange.min = Math.min(analysis.priceRange.min, price);
            analysis.priceRange.max = Math.max(analysis.priceRange.max, price);

            // Distribución por tipo
            const type = property.propertytypelabel || 'Unknown';
            analysis.typeDistribution[type] = (analysis.typeDistribution[type] || 0) + 1;

            // Distribución por ciudad
            const city = property.city || 'Unknown';
            analysis.cityDistribution[city] = (analysis.cityDistribution[city] || 0) + 1;

            // Promedios
            analysis.averageBedrooms += parseInt(property.bedstotal) || 0;
            analysis.averageBathrooms += parseFloat(property.bathroomstotaldecimal) || 0;
        });

        // Calcular promedios finales
        if (properties.length > 0) {
            analysis.averagePrice /= properties.length;
            analysis.averageBedrooms /= properties.length;
            analysis.averageBathrooms /= properties.length;
        }

        return analysis;
    }
};

// Congelar el servicio para prevenir modificaciones
Object.freeze(PropertyService);
// =========== FIN: services/propertyService.js ===========

// =========== INICIO: services/analyticsService.js ===========

const AnalyticsService = {
    events: {
        PROPERTY_VIEW: 'property_view',
        FILTER_CHANGE: 'filter_change',
        VIEW_CHANGE: 'view_change',
        CONTACT_AGENT: 'contact_agent',
        SCHEDULE_VIEWING: 'schedule_viewing',
        FAVORITE_TOGGLE: 'favorite_toggle',
        MAP_INTERACTION: 'map_interaction',
        SEARCH_PERFORMED: 'search_performed'
    },

    state: {
        sessionStartTime: Date.now(),
        pageViews: 0,
        interactions: {},
        lastEvent: null
    },

    init() {
        this.trackPageView();
        this.bindGlobalEvents();
    },

    trackEvent(eventName, data = {}) {
        try {
            const eventData = {
                eventName,
                timestamp: Date.now(),
                sessionDuration: Date.now() - this.state.sessionStartTime,
                ...data
            };

            // Guardar evento en el estado
            this.state.lastEvent = eventData;
            this.state.interactions[eventName] = (this.state.interactions[eventName] || 0) + 1;

            // Guardar en localStorage para persistencia
            this.persistEvent(eventData);

            // Enviar a servicio de análisis (mock)
            this.sendToAnalytics(eventData);

            return true;
        } catch (error) {
            console.error('Error tracking event:', error);
            return false;
        }
    },

    trackPageView() {
        this.state.pageViews++;
        this.trackEvent('page_view', {
            pageViews: this.state.pageViews,
            path: window.location.pathname,
            referrer: document.referrer
        });
    },

    trackPropertyView(propertyId) {
        this.trackEvent(this.events.PROPERTY_VIEW, {
            propertyId,
            viewType: APP_STATE.currentView
        });
    },

    trackFilterChange(filterType, value) {
        this.trackEvent(this.events.FILTER_CHANGE, {
            filterType,
            value,
            activeFilters: {...APP_STATE.activeFilters}
        });
    },

    trackViewChange(newView) {
        this.trackEvent(this.events.VIEW_CHANGE, {
            previousView: APP_STATE.currentView,
            newView
        });
    },

    trackContactAgent(propertyId) {
        this.trackEvent(this.events.CONTACT_AGENT, {
            propertyId,
            currentView: APP_STATE.currentView
        });
    },

    trackScheduleViewing(propertyId) {
        this.trackEvent(this.events.SCHEDULE_VIEWING, {
            propertyId,
            currentView: APP_STATE.currentView
        });
    },

    trackFavoriteToggle(propertyId, isFavorite) {
        this.trackEvent(this.events.FAVORITE_TOGGLE, {
            propertyId,
            isFavorite,
            totalFavorites: APP_STATE.favorites.size
        });
    },

    trackMapInteraction(interactionType, data = {}) {
        this.trackEvent(this.events.MAP_INTERACTION, {
            interactionType,
            ...data
        });
    },

    // Persistencia de eventos
    persistEvent(eventData) {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push(eventData);
            
            // Mantener solo los últimos 1000 eventos
            if (events.length > 1000) {
                events.shift();
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.error('Error persisting analytics event:', error);
        }
    },

    // Mock de envío a servicio de análisis
    sendToAnalytics(eventData) {
        // En producción, aquí se enviarían los datos a un servicio real
        console.debug('Analytics event:', eventData);
    },

    // Eventos globales
    bindGlobalEvents() {
        // Rastrear tiempo en página
        let lastActivityTime = Date.now();
        
        document.addEventListener('mousemove', () => {
            const now = Date.now();
            if (now - lastActivityTime > 60000) { // 1 minuto
                this.trackEvent('user_active_again', {
                    inactiveTime: now - lastActivityTime
                });
            }
            lastActivityTime = now;
        });

        // Rastrear salida
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                sessionDuration: Date.now() - this.state.sessionStartTime,
                pageViews: this.state.pageViews,
                totalInteractions: Object.values(this.state.interactions).reduce((a, b) => a + b, 0)
            });
        });
    },

    // Métodos de reporte
    getSessionStats() {
        return {
            sessionDuration: Date.now() - this.state.sessionStartTime,
            pageViews: this.state.pageViews,
            interactions: {...this.state.interactions},
            lastEvent: this.state.lastEvent
        };
    },

    getStoredEvents() {
        try {
            return JSON.parse(localStorage.getItem('analytics_events') || '[]');
        } catch {
            return [];
        }
    }
};

// Inicializar el servicio
AnalyticsService.init();
// =========== FIN: services/analyticsService.js ===========

// =========== INICIO: services/i18nService.js ===========

const I18nService = {
    config: {
        defaultLocale: 'en',
        fallbackLocale: 'en',
        supportedLocales: ['en', 'es'],
        storageKey: 'selectedLocale'
    },

    state: {
        currentLocale: 'en',
        translations: {
            en: {
                propertyTypes: {
                    house: 'House',
                    apartment: 'Apartment',
                    condo: 'Condo',
                    land: 'Land'
                },
                filters: {
                    propertyType: 'Property Type',
                    location: 'Location',
                    priceRange: 'Price Range',
                    bedrooms: 'Bedrooms',
                    bathrooms: 'Bathrooms',
                    allTypes: 'All Types',
                    allLocations: 'All Locations',
                    anyPrice: 'Any Price'
                },
                features: {
                    beds: 'beds',
                    baths: 'baths',
                    sqft: 'sq ft',
                    yearBuilt: 'Year Built',
                    pool: 'Pool',
                    garage: 'Garage'
                },
                actions: {
                    viewDetails: 'View Details',
                    contact: 'Contact Agent',
                    schedule: 'Schedule Viewing',
                    share: 'Share',
                    save: 'Save',
                    remove: 'Remove'
                },
                amenities: {
                    pool: 'Swimming Pool',
                    gym: 'Fitness Center',
                    parking: 'Parking',
                    security: '24/7 Security',
                    ac: 'Air Conditioning'
                }
            },
            es: {
                propertyTypes: {
                    house: 'Casa',
                    apartment: 'Apartamento',
                    condo: 'Condominio',
                    land: 'Terreno'
                },
                filters: {
                    propertyType: 'Tipo de Propiedad',
                    location: 'Ubicación',
                    priceRange: 'Rango de Precio',
                    bedrooms: 'Habitaciones',
                    bathrooms: 'Baños',
                    allTypes: 'Todos los Tipos',
                    allLocations: 'Todas las Ubicaciones',
                    anyPrice: 'Cualquier Precio'
                },
                features: {
                    beds: 'hab',
                    baths: 'baños',
                    sqft: 'm²',
                    yearBuilt: 'Año Construcción',
                    pool: 'Piscina',
                    garage: 'Garaje'
                },
                actions: {
                    viewDetails: 'Ver Detalles',
                    contact: 'Contactar Agente',
                    schedule: 'Programar Visita',
                    share: 'Compartir',
                    save: 'Guardar',
                    remove: 'Eliminar'
                },
                amenities: {
                    pool: 'Piscina',
                    gym: 'Gimnasio',
                    parking: 'Estacionamiento',
                    security: 'Seguridad 24/7',
                    ac: 'Aire Acondicionado'
                }
            }
        }
    },

    // Inicialización
    init() {
        this.loadLocale();
        this.bindEvents();
    },

    // Cargar idioma guardado o detectar automáticamente
    loadLocale() {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved && this.config.supportedLocales.includes(saved)) {
            this.setLocale(saved);
        } else {
            this.detectLocale();
        }
    },

    // Detectar idioma del navegador
    detectLocale() {
        const browserLocale = navigator.language.split('-')[0];
        const locale = this.config.supportedLocales.includes(browserLocale) ?
            browserLocale : this.config.defaultLocale;
        this.setLocale(locale);
    },

    // Cambiar idioma
    setLocale(locale) {
        if (!this.config.supportedLocales.includes(locale)) {
            console.warn(`Locale ${locale} not supported, falling back to ${this.config.fallbackLocale}`);
            locale = this.config.fallbackLocale;
        }

        this.state.currentLocale = locale;
        localStorage.setItem(this.config.storageKey, locale);
        document.documentElement.setAttribute('lang', locale);
        
        this.updateUI();
    },

    // Obtener traducción
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.state.translations[this.state.currentLocale];
        
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        // Reemplazar parámetros
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/{(\w+)}/g, (match, key) => {
                return params[key] !== undefined ? params[key] : match;
            });
        }

        return value;
    },

    // Formatear números según el locale
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.state.currentLocale, options).format(number);
    },

    // Formatear fechas según el locale
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat(this.state.currentLocale, options).format(date);
    },

    // Formatear moneda según el locale
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.state.currentLocale, {
            style: 'currency',
            currency
        }).format(amount);
    },

    // Actualizar interfaz cuando cambia el idioma
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.t(key);
        });

        // Disparar evento para que otros componentes se actualicen
        window.dispatchEvent(new CustomEvent('localeChanged', {
            detail: { locale: this.state.currentLocale }
        }));
    },

    // Manejadores de eventos
    bindEvents() {
        // Actualizar cuando se restaura la página
        window.addEventListener('pageshow', () => {
            this.loadLocale();
        });

        // Observer para elementos dinámicos
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.dataset?.i18n) {
                        node.textContent = this.t(node.dataset.i18n);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// Inicializar servicio
I18nService.init();

// Exportar servicio
window.I18nService = I18nService;
// =========== FIN: services/i18nService.js ===========

// =========== INICIO: services/searchService.js ===========

const SearchService = {
    config: {
        minSearchLength: 2,
        debounceTime: 300,
        maxResults: 50,
        searchableFields: [
            'streetadditionalinfo',
            'city',
            'subdivisionname',
            'publicremarks',
            'propertytypelabel'
        ]
    },

    state: {
        lastQuery: '',
        debounceTimeout: null,
        searchHistory: []
    },

    // Búsqueda principal
    search(query, filters = {}) {
        if (!query || query.length < this.config.minSearchLength) {
            return [];
        }

        const normalizedQuery = this.normalizeText(query);
        const searchTerms = normalizedQuery.split(' ').filter(term => term.length >= this.config.minSearchLength);

        return SAMPLE_LISTINGS.filter(property => {
            // Primero aplicar filtros si existen
            if (!this.matchesFilters(property, filters)) {
                return false;
            }

            // Luego buscar coincidencias con los términos
            return searchTerms.every(term => this.propertyMatchesTerm(property, term));
        }).slice(0, this.config.maxResults);
    },

    // Búsqueda con sugerencias
    searchWithSuggestions(query, filters = {}) {
        const results = this.search(query, filters);
        const suggestions = this.generateSuggestions(query, results);

        return {
            results,
            suggestions,
            count: results.length,
            hasMore: results.length === this.config.maxResults
        };
    },

    // Coincidencia de propiedad con término
    propertyMatchesTerm(property, term) {
        return this.config.searchableFields.some(field => {
            const value = property[field];
            if (!value) return false;

            const normalizedValue = this.normalizeText(value.toString());
            return normalizedValue.includes(term);
        });
    },

    // Verificar si la propiedad cumple con los filtros
    matchesFilters(property, filters) {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;

            switch (key) {
                case 'priceRange':
                    const [min, max] = value.split('-').map(Number);
                    const price = Number(property.currentpricepublic);
                    return price >= min && (!max || price <= max);

                case 'bedrooms':
                    const minBeds = Number(value);
                    const beds = Number(property.bedstotal) || 0;
                    return beds >= minBeds;

                case 'bathrooms':
                    const minBaths = Number(value);
                    const baths = Number(property.bathroomstotaldecimal) || 0;
                    return baths >= minBaths;

                default:
                    return property[key] === value;
            }
        });
    },

    // Generar sugerencias basadas en los resultados
    generateSuggestions(query, results) {
        const suggestions = new Set();
        
        results.forEach(property => {
            // Sugerir ubicaciones
            if (property.city) suggestions.add(property.city);
            if (property.subdivisionname) suggestions.add(property.subdivisionname);

            // Sugerir tipos de propiedad
            if (property.propertytypelabel) suggestions.add(property.propertytypelabel);
        });

        // Filtrar sugerencias que coincidan parcialmente con la consulta
        const normalizedQuery = this.normalizeText(query);
        return Array.from(suggestions)
            .filter(suggestion => 
                this.normalizeText(suggestion).includes(normalizedQuery)
            )
            .slice(0, 5);
    },

    // Búsqueda por proximidad geográfica
    searchByLocation(latitude, longitude, radiusKm, filters = {}) {
        return SAMPLE_LISTINGS
            .filter(property => {
                // Primero verificar filtros
                if (!this.matchesFilters(property, filters)) return false;

                // Luego verificar distancia
                if (!property.latitude || !property.longitude) return false;

                const distance = this.calculateDistance(
                    latitude, longitude,
                    property.latitude, property.longitude
                );

                return distance <= radiusKm;
            })
            .map(property => ({
                ...property,
                distance: this.calculateDistance(
                    latitude, longitude,
                    property.latitude, property.longitude
                )
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, this.config.maxResults);
    },

    // Calcular distancia entre dos puntos (fórmula haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    // Convertir grados a radianes
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    },

    // Normalizar texto para búsqueda
    normalizeText(text) {
        return text.toString().toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^a-z0-9\s]/g, ''); // Remover caracteres especiales
    },

    // Gestión del historial de búsqueda
    addToHistory(query) {
        const maxHistoryItems = 10;
        this.state.searchHistory = [
            query,
            ...this.state.searchHistory.filter(q => q !== query)
        ].slice(0, maxHistoryItems);

        this.saveHistory();
    },

    getHistory() {
        return this.state.searchHistory;
    },

    clearHistory() {
        this.state.searchHistory = [];
        this.saveHistory();
    },

    saveHistory() {
        try {
            localStorage.setItem('searchHistory', JSON.stringify(this.state.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    },

    loadHistory() {
        try {
            const history = localStorage.getItem('searchHistory');
            if (history) {
                this.state.searchHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('Error loading search history:', error);
            this.state.searchHistory = [];
        }
    },

    // Búsqueda con debounce
    debounceSearch(query, filters, callback) {
        clearTimeout(this.state.debounceTimeout);
        
        this.state.debounceTimeout = setTimeout(() => {
            const results = this.search(query, filters);
            callback(results);
        }, this.config.debounceTime);
    }
};

// Inicializar servicio
SearchService.loadHistory();

// Exportar servicio
window.SearchService = SearchService;
// =========== FIN: services/searchService.js ===========

// =========== INICIO: state.js ===========

const APP_STATE = {
    // Estado inicial
    currentView: 'grid',
    activeFilters: {},
    map: null,
    markers: [],
    selectedProperty: null,
    currentGalleryIndex: 0,
    favorites: new Set(),
    modalMap: null,
    initialized: false,
    isSharedProperty: false,

    // Métodos para manipular el estado
    setView(view) {
        if (view !== 'list' && view !== 'grid') return;
        this.currentView = view;
        this.notifySubscribers('viewChanged', view);
    },

    setFilter(filterType, value) {
        if (!value || value === '') {
            delete this.activeFilters[filterType];
        } else {
            this.activeFilters[filterType] = value;
        }
        // No disparamos eventos de filtros aquí
    },

    setSelectedProperty(propertyId) {
        this.selectedProperty = propertyId;
        this.notifySubscribers('propertySelected', propertyId);
        
        // Llamar al mapa para centrar en la propiedad
        if (PropertyMap && PropertyMap.focusMarker) {
            PropertyMap.focusMarker(propertyId);
        }
    
        // Eliminar toda la parte de actualización de URL
        // if (!this.isSharedProperty) {
        //     const url = new URL(window.location.href);
        //     url.searchParams.set('property', propertyId);
        //     window.history.pushState({propertyId}, '', url.toString());
        // }
    },

    // setSelectedProperty(propertyId) {
    //     this.selectedProperty = propertyId;
    //     this.notifySubscribers('propertySelected', propertyId);
    //     // Llamar directamente a la función de actualización del preview
    //     updateSelectedPropertyPreview(propertyId);

    //     // Si la propiedad se seleccionó manualmente, actualizar la URL
    //     if (!this.isSharedProperty) {
    //         const url = new URL(window.location.href);
    //         url.searchParams.set('property', propertyId);
    //         window.history.pushState({propertyId}, '', url.toString());
    //     }
    // },

    toggleFavorite(propertyId) {
        if (this.favorites.has(propertyId)) {
            this.favorites.delete(propertyId);
        } else {
            this.favorites.add(propertyId);
        }
        localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
        this.notifySubscribers('favoritesChanged', propertyId);
    },

    // Sistema de suscripción para actualizaciones de estado
    subscribers: {},

    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
        return () => {
            this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
        };
    },

    notifySubscribers(event, data) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(callback => callback(data));
    },

    // Inicialización
    init() {
        // Limpiar filtros
        this.activeFilters = {};
     
        // Cargar favoritos del localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.favorites = new Set(savedFavorites);
     
        // Verificar si hay una propiedad compartida en la URL 
        const params = new URLSearchParams(window.location.search);
        const propertyId = params.get('property');
        if (propertyId) {
            this.isSharedProperty = true; 
            this.selectedProperty = propertyId;
        }
     
        // Configurar suscriptores iniciales
        this.setupInitialSubscribers();
     
        // Cargar vista guardada
        const savedView = localStorage.getItem('viewPreference') || 'grid';
        this.setView(savedView);
     
        // Marcar como inicializado después de un breve retraso
        setTimeout(() => {
            this.initialized = true;
        }, 200);
     },
     
     setupInitialSubscribers() {
        // Suscriptor para cambios en la vista
        this.subscribe('viewChanged', (view) => {
            document.querySelectorAll('.view-controls-container .btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
            });
        });
    
        // Ya no necesitamos este suscriptor para filtersChanged
        /* this.subscribe('filtersChanged', () => {
            if (typeof FilterBar !== 'undefined' && FilterBar.updateFilterTags) {
                FilterBar.updateFilterTags();
            }
            if (typeof window.applyFilters === 'function') {
                window.applyFilters();
            }
        }); */
    
        // Suscriptor para selección de propiedad
        this.subscribe('propertySelected', async (propertyId) => {
            try {
                const property = await ApiService.getProperty(propertyId);
                if (property) {
                    if (PropertyMap && typeof PropertyMap.highlightMarker === 'function') {
                        PropertyMap.highlightMarker(propertyId);
                    }
    
                    if (!this.isSharedProperty && window === window.top) {
                        const url = new URL(window.location.href);
                        url.searchParams.set('property', propertyId);
                        window.history.pushState({propertyId}, '', url);
                    }
                }
            } catch (error) {
                console.error('Error al obtener la propiedad:', error);
            }
        });
    
        // Mantener el suscriptor de favoritos
        this.subscribe('favoritesChanged', (propertyId) => {
            document.querySelectorAll(`.favorite-btn[data-property-id="${propertyId}"]`)
                .forEach(btn => {
                    const isFavorite = this.favorites.has(propertyId);
                    btn.classList.toggle('active', isFavorite);
                    btn.querySelector('i').className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
                });
        });
    }
};

// Inicializar el estado de la aplicación
APP_STATE.init();

// Exportar el estado global
window.APP_STATE = APP_STATE;
// =========== FIN: state.js ===========

// =========== INICIO: components/propertyCard.js ===========

const PropertyCard = {
    render(property, view = 'grid') {
        if (!property || !property.id) {
            console.error('Invalid property data:', property);
            return '';
        }
        
        const isFavorite = APP_STATE.favorites.has(property.id);
        const isSelected = APP_STATE.selectedProperty === property.id;

        return view === 'list' ? 
            this.renderListView(property, isFavorite, isSelected) : 
            this.renderGridView(property, isFavorite, isSelected);
    },

    renderGridView(property, isFavorite, isSelected) {
        // Safe property access with fallbacks
        const propertyType = property.propertytypelabel || 'Property';
        const title = property.streetadditionalinfo || property.subdivisionname || propertyType;
        const location = property.subdivisionname ? 
            `${property.subdivisionname}, ${property.city || ''}` : 
            (property.city || 'Location unavailable');
        const imageUrl = this.getPropertyImage(property);
        
        return `
            <div class="property-card grid-card ${isSelected ? 'active' : ''}" 
                data-property-id="${property.id}"
                onClick="APP_STATE.setSelectedProperty('${property.id}')">
                <div class="property-image">
                    ${this.renderPropertyStatus(property)}
                    <img src="${imageUrl}" 
                         alt="${propertyType}"
                         loading="lazy"
                         onerror="this.src='/images/placeholder.jpg'"
                    <div class="price-tag">
                        <div class="price">${Formatters.formatPrice(property.currentpricepublic)}</div>
                        <div class="price-conversion">${Formatters.formatPrice(property.currentpricepublic * CONFIG.currency.exchangeRate, { currency: 'MXN' })}</div>
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); APP_STATE.toggleFavorite('${property.id}')"
                            data-property-id="${property.id}">
                        <i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>
                    </button>
                </div>
                <div class="property-info">
                    <h3 class="property-title">
                        ${title}
                    </h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i> 
                        ${location}
                    </div>
                    ${this.renderPropertySpecs(property)}
                    <div class="property-description">
                        ${Formatters.truncateText(property.publicremarks || 'No description available', 120)}
                    </div>
<div class="property-actions">
                        <button class="btn-primary" onclick="event.stopPropagation(); showPropertyDetails('${property.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderListView(property, isFavorite, isSelected) {
        // Safe property access with fallbacks
        const propertyType = property.propertytypelabel || 'Property';
        const title = property.streetadditionalinfo || property.subdivisionname || propertyType;
        const location = property.subdivisionname ? 
            `${property.subdivisionname}, ${property.city || ''}` : 
            (property.city || 'Location unavailable');
        const imageUrl = this.getPropertyImage(property);
        
        return `
            <div class="property-card list-card ${isSelected ? 'active' : ''}" 
                data-property-id="${property.id}"
                onclick="APP_STATE.setSelectedProperty('${property.id}')">
                <div class="property-image">
                    ${this.renderPropertyStatus(property)}
                    <img src="${imageUrl}" 
                         alt="${propertyType}"
                         loading="lazy"
                         onerror="this.src='/images/placeholder.jpg'">
                    <div class="price-tag">
                        <div class="price">${Formatters.formatPrice(property.currentpricepublic)}</div>
                        <div class="price-conversion">${Formatters.formatPrice(property.currentpricepublic * CONFIG.currency.exchangeRate, { currency: 'MXN' })}</div>
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); APP_STATE.toggleFavorite('${property.id}')"
                            data-property-id="${property.id}">
                        <i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>
                    </button>
                </div>
                <div class="property-info">
                    <div class="property-header">
                        <h3 class="property-title">
                            ${title}
                        </h3>
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i> 
                            ${location}
                        </div>
                    </div>
                    ${this.renderPropertySpecs(property)}
                    <div class="property-description">
                        ${Formatters.truncateText(property.publicremarks || 'No description available', 200)}
                    </div>
                    ${this.renderPropertyFeatures(property)}
                    <div class="property-actions">
                        <button class="btn-primary" onclick="event.stopPropagation(); showPropertyDetails('${property.id}')">
                            View Details
                        </button>
                        <button class="btn-outline" onclick="event.stopPropagation(); contactAgent('${property.id}')">
                            Contact Agent
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderPropertySpecs(property) {
        return `
            <div class="property-specs">
                ${property.bedstotal ? `
                    <span class="spec-item">
                        <i class="fas fa-bed"></i>
                        <span>${property.bedstotal} Beds</span>
                    </span>
                ` : ''}
                ${property.bathroomstotaldecimal ? `
                    <span class="spec-item">
                        <i class="fas fa-bath"></i>
                        <span>${property.bathroomstotaldecimal} Baths</span>
                    </span>
                ` : ''}
                ${property.buildingareatotal ? `
                    <span class="spec-item">
                        <i class="fas fa-vector-square"></i>
                        <span>${Formatters.formatArea(property.buildingareatotal)}</span>
                    </span>
                ` : ''}
                ${property.yearbuilt ? `
                    <span class="spec-item">
                        <i class="fas fa-calendar"></i>
                        <span>Built ${property.yearbuilt}</span>
                    </span>
                ` : ''}
            </div>
        `;
    },

    renderPropertyFeatures(property) {
        const features = [];
        
        if (property.interiorfeatures) {
            try {
                const interiorFeatures = Formatters.formatFeatures(property.interiorfeatures);
                features.push(...interiorFeatures.slice(0, 2));
            } catch (e) {
                console.warn('Error parsing interior features:', e);
            }
        }
        
        if (property.exteriorfeatures) {
            try {
                const exteriorFeatures = Formatters.formatFeatures(property.exteriorfeatures);
                features.push(...exteriorFeatures.slice(0, 2));
            } catch (e) {
                console.warn('Error parsing exterior features:', e);
            }
        }

        if (features.length === 0) return '';

        return `
            <div class="property-features">
                ${features.slice(0, 4).map(feature => `
                    <span class="feature-tag">
                        <i class="fas fa-check"></i>
                        ${feature}
                    </span>
                `).join('')}
            </div>
        `;
    },

    renderPropertyStatus(property) {
        const statuses = [];
        
        // New Listing
        if (property.majorchangetype === 'New Listing') {
            statuses.push({
                class: 'status-new-listing',
                text: 'New Listing',
                icon: 'fa-star'
            });
        }
        
        // New Construction
        if (property.yearbuilt && property.yearbuilt >= new Date().getFullYear()) {
            statuses.push({
                class: 'status-new-construction',
                text: 'New Construction',
                icon: 'fa-hard-hat'
            });
        }
        
        // Price Reduced
        if (property.majorchangetype === 'Price Change' && property.pricechange < 0) {
            statuses.push({
                class: 'status-price-reduced',
                text: 'Price Reduced',
                icon: 'fa-tag'
            });
        }
        
        // Featured
        if (property.featured) {
            statuses.push({
                class: 'status-featured',
                text: 'Featured',
                icon: 'fa-gem'
            });
        }

        // Open House
        if (property.hasOpenHouse) {
            statuses.push({
                class: 'status-open-house',
                text: 'Open House',
                icon: 'fa-door-open'
            });
        }

        // Under Contract
        if (property.status === 'Under Contract') {
            statuses.push({
                class: 'status-under-contract',
                text: 'Under Contract',
                icon: 'fa-file-signature'
            });
        }

        // Si no hay estados, retornar vacío
        if (statuses.length === 0) return '';

        // Renderizar los estados
        return `
            <div class="property-status">
                ${statuses.map(status => `
                    <div class="status-tag ${status.class}">
                        <i class="fas ${status.icon}"></i>
                        ${status.text}
                    </div>
                `).join('')}
            </div>
        `;
    },

    getPropertyImage(property) {
        // Handling multiple possible image structures
        if (property.imageUrl && property.imageUrl.Uri800) {
            return property.imageUrl.Uri800;
        } else if (property.photos && property.photos.length > 0) {
            if (property.photos[0].Uri800) {
                return property.photos[0].Uri800;
            } else if (property.photos[0].uri) {
                return property.photos[0].uri;
            } else if (typeof property.photos[0] === 'string') {
                return property.photos[0];
            }
        } else if (property.propertyPhoto) {
            return property.propertyPhoto;
        }
        
        // Fallback to placeholder
        return '/images/placeholder.jpg';
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                e.stopPropagation();
                const propertyId = favoriteBtn.dataset.propertyId;
                if (propertyId) {
                    APP_STATE.toggleFavorite(propertyId);
                }
            }
        });
    }
};

PropertyCard.bindEvents();

// Export for global use
window.PropertyCard = PropertyCard;
// =========== FIN: components/propertyCard.js ===========

// =========== INICIO: components/propertyModal.js ===========

const PropertyModal = {
    state: {
        modalInstance: null,
        currentProperty: null,
        currentImageIndex: 0,
        isLoading: false
    },

    init() {
        const modalElement = document.getElementById('propertyModal');
        if (!modalElement) return;
    
        // Event listeners del modal
        modalElement.addEventListener('hidden.bs.modal', () => {
            PropertyMap.destroyModalMap();
            this.state.currentProperty = null;
            this.state.currentImageIndex = 0;
            
            // Limpiar URL si no estamos en un iframe
            if (window === window.top) {
                const url = new URL(window.location.href);
                url.searchParams.delete('property');
                window.history.replaceState({}, '', url);
            }
        });
    
        // Checar parámetros de URL al iniciar
        this.checkUrlParams();
        
        // Escuchar cambios en la URL
        window.addEventListener('popstate', () => {
            this.checkUrlParams();
        });
    },

    showWithData(property) {
        if (!property || this.state.isLoading) return;
    
        try {
            this.state.isLoading = true;
            this.showLoadingOverlay();
    
            this.state.currentProperty = property;
            this.state.currentImageIndex = 0;
    
            this.updateModalContent(property);
            this.showModal();
            
            // Inicializar componentes DESPUÉS de que el modal se muestre completamente
            this.modalElement.addEventListener('shown.bs.modal', () => {
                if (property.latitude && property.longitude) {
                    PropertyMap.initializeModalMap(property);
                }
                
                // Inicializar cualquier otro componente necesario
                this.initializeImageLoading();
                
                // Solo inicializar la galería si hay fotos
                if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
                    PropertyGallery.initialize(property);
                }
            }, { once: true }); // usar once: true para que se ejecute solo una vez
    
            // Actualizar URL si no estamos en un iframe
            if (window === window.top) {
                const url = new URL(window.location.href);
                url.searchParams.set('property', property.id);
                window.history.pushState({propertyId: property.id}, '', url);
            }
    
        } catch (error) {
            console.error('Error displaying property:', error);
            NotificationService.error('Error al mostrar la propiedad');
        } finally {
            this.state.isLoading = false;
            this.hideLoadingOverlay();
        }
    },

    async show(propertyId) {
        if (!propertyId || this.state.isLoading) return;

        try {
            this.state.isLoading = true;
            this.showLoadingOverlay();

            const property = await ApiService.getProperty(propertyId);
            
            if (!property) {
                console.error('Property not found:', propertyId);
                NotificationService.error('Property not found');
                return;
            }

            this.state.currentProperty = property;
            this.state.currentImageIndex = 0;

            this.updateModalContent(property);
            this.showModal();
            this.initializeComponents(property);

            // Actualizar URL si no estamos en un iframe
            if (window === window.top) {
                const url = new URL(window.location.href);
                url.searchParams.set('property', propertyId);
                window.history.pushState({propertyId}, '', url);
            }

            // Notificar al padre si estamos en un iframe
            if (window !== window.top) {
                window.parent.postMessage({
                    type: 'propertySelected',
                    propertyId,
                    property: {
                        title: property.streetadditionalinfo || property.propertytypelabel,
                        description: property.publicremarks,
                        type: property.propertytypelabel,
                        location: property.mlsareamajor,
                        price: property.currentpricepublic,
                        image: property.photos?.[0]?.Uri1600 || ''
                    }
                }, '*');
            }

        } catch (error) {
            console.error('Error loading property:', error);
            NotificationService.error('Error loading property');
        } finally {
            this.state.isLoading = false;
            this.hideLoadingOverlay();
        }
    },

    showLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    },

    hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    },

    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const propertyId = params.get('property');
        
        if (propertyId && !this.state.isLoading) {
            this.show(propertyId);
        }
    },

updateModalContent(property) {
    const modalContent = document.getElementById('propertyModalContent');
    if (!modalContent) return;

    const formattedPrice = Formatters.formatPrice(property.currentpricepublic);
    const formattedArea = property.buildingareatotal ? 
        `${Formatters.formatArea(property.buildingareatotal)}` : 'N/A';
    
    // Manejar el caso donde no hay fotos
    const hasPhotos = property.photos && Array.isArray(property.photos) && property.photos.length > 0;
    
    // HTML para la galería
    const galleryHTML = hasPhotos ? `
        <div class="modal-gallery-side">
            <div class="main-image-viewer">
                <img id="modalMainImage" src="${property.photos[0].Uri800 || '/images/placeholder.jpg'}" 
                     alt="${property.subdivisionname || 'Property'}"
                     style="object-fit: cover;">
                <button class="nav-circle prev" aria-label="Previous image">❮</button>
                <button class="nav-circle next" aria-label="Next image">❯</button>
            </div>
            <div class="thumbnail-strip">
                ${property.photos.map((photo, index) => `
                    <img src="${photo.Uri300 || '/images/placeholder.jpg'}" 
                         class="thumbnail ${index === 0 ? 'active' : ''}"
                         data-index="${index}"
                         alt="Thumbnail ${index + 1}">
                `).join('')}
            </div>
        </div>
    ` : `
        <div class="modal-gallery-side">
            <div class="main-image-viewer">
                <img id="modalMainImage" src="/images/placeholder.jpg" 
                     alt="${property.subdivisionname || 'Property'}"
                     style="object-fit: cover;">
            </div>
        </div>
    `;
    
    // HTML para previsualización de imágenes
    const previewGridHTML = hasPhotos ? `
        <div class="preview-grid">
            ${property.photos.slice(0, 4).map((photo, index) => `
                <div class="preview-box">
                    <img src="${photo.Uri300 || '/images/placeholder.jpg'}" 
                         alt="Property preview" 
                         class="preview-image"
                         loading="lazy">
                </div>
            `).join('')}
            <div class="view-all-photos">
                <span>View All ${property.photos.length} Photos</span>
            </div>
        </div>
    ` : `
        <div class="preview-grid">
            <div class="preview-box">
                <img src="/images/placeholder.jpg" 
                     alt="Property preview" 
                     class="preview-image"
                     loading="lazy">
            </div>
        </div>
    `;

    modalContent.innerHTML = `
        <button type="button" class="close-modal" data-bs-dismiss="modal">×</button>
        <button class="share-button" onclick="ShareService.shareProperty('${property.id}')">
            <i class="fas fa-share-alt"></i> Share
        </button>
        <div class="modal-split">
            <!-- Lado izquierdo - Galería -->
            ${galleryHTML}

            <!-- Lado derecho - Información -->
            <div class="modal-info-side">
                <h2 class="property-title">${property.subdivisionname || property.streetadditionalinfo || 'Property'}</h2>
                <p class="property-location">${property.city || ''}, ${property.mlsareamajor || ''}</p>
                <p class="property-price">${formattedPrice}</p>

                <!-- Grid de preview de imágenes -->
                ${previewGridHTML}

                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-label">Beds</div>
                        <div class="stat-value beds">${property.bedstotal || 'N/A'}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Baths</div>
                        <div class="stat-value baths">${property.bathroomstotaldecimal || 'N/A'}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Area</div>
                        <div class="stat-value area">${formattedArea}</div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>Property Information</h3>
                    <div class="details-grid">
                        ${this.createPropertyDetails(property)}
                    </div>
                </div>

                ${property.latitude && property.longitude ? `
                    <div class="info-section location-section">
                        <h3>Location</h3>
                        <div id="propertyMap" class="map-container"></div>
                        <p class="address">${property.unparsedaddress || 'N/A'}</p>
                        <a href="https://www.google.com/maps?q=${property.latitude},${property.longitude}" 
                           target="_blank" 
                           class="view-map-btn">
                            VIEW ON GOOGLE MAPS
                        </a>
                    </div>
                ` : ''}

                <div class="info-section">
                    <h3>Features</h3>
                    <div class="features-grid">
                        ${this.createFeaturesSections(property)}
                    </div>
                </div>

                <div class="info-section">
                    <h3>Description</h3>
                    <p class="description">${property.publicremarks || 'No description available.'}</p>
                </div>
            </div>
        </div>
    `;

    this.bindModalEvents();
},

    createPropertyDetails(property) {
        const details = [
            { label: 'Property ID', value: property.id },
            { label: 'Property Type', value: property.propertytypelabel },
            { label: 'Property Class', value: property.propertyclass },
            { label: 'Year Built', value: property.yearbuilt || 'N/A' },
            { label: 'Lot Size', value: property.lotsizedimensions || 'N/A' },
            { label: 'Total Rooms', value: property.roomstotal || 'N/A' },
            { label: 'Status', value: property.majorchangetype || 'New Listing' }
        ];

        return details.map(detail => `
            <div class="info-row">
                <div class="info-label">${detail.label}</div>
                <div class="info-value">${detail.value}</div>
            </div>
        `).join('');
    },

    createFeaturesSections(property) {
        const features = {
            'Interior Features': property.interiorfeatures,
            'Exterior Features': property.exteriorfeatures,
            'Pool Features': property.poolfeatures,
            'Patio Features': property.patioandporchfeatures,
            'Architectural Style': property.architecturalstyle,
            'Electric': property.electric,
            'Kitchen Appliances': property.kitchenappliances
        };

        return Object.entries(features)
            .filter(([_, value]) => value)
            .map(([title, features]) => this.createFeatureCategory(title, features))
            .join('');
    },

    createFeatureCategory(title, features) {
        const parsedFeatures = this.parseFeatures(features);
        if (!parsedFeatures.length) return '';

        return `
            <div class="feature-category">
                <h4>${title}</h4>
                <p>${parsedFeatures.join(', ')}</p>
            </div>
        `;
    },

    parseFeatures(features) {
        try {
            if (typeof features === 'string' && features.startsWith('{')) {
                return Object.entries(JSON.parse(features))
                    .filter(([_, value]) => value)
                    .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
            } else if (typeof features === 'object') {
                return Object.entries(features)
                    .filter(([_, value]) => value)
                    .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
            }
            return [];
        } catch (e) {
            console.error('Error parsing features:', e);
            return [];
        }
    },

    bindModalEvents() {
        const mainImage = document.getElementById('modalMainImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const prevBtn = document.querySelector('.nav-circle.prev');
        const nextBtn = document.querySelector('.nav-circle.next');

        if (mainImage && this.state.currentProperty?.photos) {
            const photos = this.state.currentProperty.photos;

            const updateMainImage = (index) => {
                if (index >= 0 && index < photos.length) {
                    this.state.currentImageIndex = index;
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = photos[index].Uri1600 || photos[index].Uri800;
                        mainImage.style.opacity = '1';
                    }, 200);
                    thumbnails.forEach((thumb, i) => {
                        thumb.classList.toggle('active', i === index);
                    });
                }
            };

            // Eventos de botones de navegación
            prevBtn?.addEventListener('click', () => {
                let newIndex = this.state.currentImageIndex - 1;
                if (newIndex < 0) newIndex = photos.length - 1;
                updateMainImage(newIndex);
            });

            nextBtn?.addEventListener('click', () => {
                let newIndex = this.state.currentImageIndex + 1;
                if (newIndex >= photos.length) newIndex = 0;
                updateMainImage(newIndex);
            });

            // Eventos de miniaturas
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const index = parseInt(thumb.dataset.index);
                    if (!isNaN(index)) updateMainImage(index);
                });
            });

            // Eventos táctiles
            let touchStartX = 0;
            mainImage.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            mainImage.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextBtn?.click();
                    } else {
                        prevBtn?.click();
                    }
                }
            }, { passive: true });
        }

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.modal.show')) return;

            switch(e.key) {
                case 'ArrowLeft':
                    prevBtn?.click();
                    break;
                case 'ArrowRight':
                    nextBtn?.click();
                    break;
                case 'Escape':
                    this.hideModal();
                    break;
            }
        });

        // Eventos de la galería
        document.querySelectorAll('.preview-box, .view-all-photos').forEach(element => {
            element.addEventListener('click', () => {
                if (this.state.currentProperty) {
                    PropertyGallery.initialize(this.state.currentProperty);
                    if (element.classList.contains('preview-box')) {
                        const images = Array.from(document.querySelectorAll('.preview-box'));
                        const index = images.indexOf(element);
                        if (index !== -1) {
                            PropertyGallery.setStartIndex(index);
                        }
                    }
                    PropertyGallery.showFullGallery();
                }
            });
        });

        // Eventos del mapa
        const mapBtn = document.querySelector('.view-map-btn');
        if (mapBtn && this.state.currentProperty) {
            mapBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const { latitude, longitude } = this.state.currentProperty;
                if (latitude && longitude) {
                    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
                }
            });
        }
    },

    showModal() {
        const modalElement = document.getElementById('propertyModal');
        if (!modalElement) return;
    
        this.modalElement = modalElement; // Guardar referencia para usar en otros métodos
    
        if (this.state.modalInstance) {
            this.state.modalInstance.dispose();
        }
    
        this.state.modalInstance = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: true
        });
    
        this.state.modalInstance.show();
    },

    hideModal() {
        if (this.state.modalInstance) {
            this.state.modalInstance.hide();
        }
    },

    initializeComponents(property) {
        // Solo inicializar la galería si hay fotos
        if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
            PropertyGallery.initialize(property);
        }
    
        // Inicializar cualquier otro componente necesario
        this.initializeImageLoading();
    },

    initializeImageLoading() {
        const images = document.querySelectorAll('#propertyModal img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.src = '/images/placeholder.jpg';
            });
        });
    },

    // Métodos auxiliares
    scheduleViewing(propertyId) {
        if (!propertyId) return;
        
        // Implementar la lógica para programar una visita
        NotificationService.info('Scheduling system coming soon!', {
            title: 'Schedule Viewing',
            duration: 3000
        });
    },

    contactAgent(propertyId) {
        if (!propertyId) return;
        
        // Implementar la lógica para contactar al agente
        NotificationService.info('Contact system coming soon!', {
            title: 'Contact Agent',
            duration: 3000
        });
    }
};

// Inicializar el modal
PropertyModal.init();

// Exportar para uso global
window.PropertyModal = PropertyModal;

// Event Handlers del Modal
const ModalEventHandlers = {
    init() {
        this.bindModalEvents();
        this.bindGalleryEvents();
        this.bindMapEvents();
    },

    bindModalEvents() {
        const modal = document.getElementById('propertyModal');
        if (!modal) return;

        // Manejar apertura del modal
        modal.addEventListener('show.bs.modal', () => {
            document.body.style.overflow = 'hidden';
        });

        // Manejar cierre del modal
        modal.addEventListener('hide.bs.modal', () => {
            document.body.style.overflow = '';
            PropertyMap.destroyModalMap();
        });

        // Prevenir cierre del modal al hacer clic en la galería
        modal.querySelector('.modal-gallery-side')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },

    bindGalleryEvents() {
        const modal = document.getElementById('propertyModal');
        if (!modal) return;

        // Manejar vista completa de la galería
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('preview-grid')) {
                const property = PropertyModal.state.currentProperty;
                if (property) {
                    PropertyGallery.initialize(property);
                    PropertyGallery.showFullGallery();
                }
            }
        });

        // Manejar eventos táctiles
        let touchStartX = 0;
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                const navButton = diff > 0 ? 
                    modal.querySelector('.nav-circle.next') : 
                    modal.querySelector('.nav-circle.prev');
                navButton?.click();
            }
        }, { passive: true });
    },

    bindMapEvents() {
        const modal = document.getElementById('propertyModal');
        if (!modal) return;

        // Actualizar mapa al redimensionar
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (PropertyModal.state.currentProperty) {
                    PropertyMap.updateMap();
                }
            }, 250);
        });

        // Manejar interacciones del mapa
        modal.querySelector('.map-container')?.addEventListener('click', (e) => {
            // Prevenir cierre del modal al interactuar con el mapa
            e.stopPropagation();
        });
    }
};

// Inicializar los manejadores de eventos
ModalEventHandlers.init();
// =========== FIN: components/propertyModal.js ===========

// =========== INICIO: components/propertyGallery.js ===========

const PropertyGallery = {
    state: {
        currentIndex: 0,
        images: [],
        touchStartX: 0,
        touchEndX: 0,
        isFullScreen: false,
        galleryElement: null
    },

    initialize(property) {
        if (!property || !property.photos || !Array.isArray(property.photos) || property.photos.length === 0) {
            this.state.images = [];
            return;
        }
        
        this.state.images = property.photos;
        this.state.currentIndex = 0;
        this.createGalleryModal();
    },

    createGalleryModal() {
        if (!this.state.images.length) return;
    
        // Crear el modal de galería si no existe
        if (!document.getElementById('fullGalleryModal')) {
            const firstImageUrl = this.state.images[0]?.Uri1600 || 
                                 this.state.images[0]?.Uri800 || 
                                 '/images/placeholder.jpg';
            
            const galleryModal = document.createElement('div');
            galleryModal.id = 'fullGalleryModal';
            galleryModal.className = 'gallery-modal';
            galleryModal.innerHTML = `
                <button class="gallery-close">×</button>
                <div class="gallery-content">
                    <div class="gallery-counter">1 / ${this.state.images.length}</div>
                    <div class="gallery-main">
                        <img src="${firstImageUrl}" 
                             alt="Gallery image">
                        <button class="gallery-nav prev">❮</button>
                        <button class="gallery-nav next">❯</button>
                    </div>
                    <div class="gallery-thumbs">
                        ${this.createThumbnails()}
                    </div>
                </div>
            `;
    
            document.body.appendChild(galleryModal);
            this.state.galleryElement = galleryModal;
            this.bindGalleryEvents();
        }
    },

    createThumbnails() {
        return this.state.images.map((image, index) => `
            <img src="${image.Uri300}" 
                 class="gallery-thumb ${index === 0 ? 'active' : ''}"
                 data-index="${index}"
                 alt="Thumbnail ${index + 1}">
        `).join('');
    },

    showFullGallery() {
        if (!this.state.galleryElement || !this.state.images.length) return;
        
        this.updateGalleryView();
        this.state.galleryElement.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    updateGalleryView() {
        if (!this.state.galleryElement) return;

        const mainImage = this.state.galleryElement.querySelector('.gallery-main img');
        const counter = this.state.galleryElement.querySelector('.gallery-counter');
        const thumbs = this.state.galleryElement.querySelectorAll('.gallery-thumb');

        // Actualizar imagen principal
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = this.state.images[this.state.currentIndex].Uri1600 || 
                          this.state.images[this.state.currentIndex].Uri800;
            mainImage.style.opacity = '1';
        }, 200);

        // Actualizar contador
        counter.textContent = `${this.state.currentIndex + 1} / ${this.state.images.length}`;

        // Actualizar miniaturas
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.state.currentIndex);
        });

        // Scroll a la miniatura activa
        const activeThumb = thumbs[this.state.currentIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    },

    bindGalleryEvents() {
        if (!this.state.galleryElement) return;

        const mainImage = this.state.galleryElement.querySelector('.gallery-main img');
        const prevBtn = this.state.galleryElement.querySelector('.gallery-nav.prev');
        const nextBtn = this.state.galleryElement.querySelector('.gallery-nav.next');
        const closeBtn = this.state.galleryElement.querySelector('.gallery-close');
        const thumbsContainer = this.state.galleryElement.querySelector('.gallery-thumbs');

        // Navegación con botones
        prevBtn.addEventListener('click', () => this.navigate('prev'));
        nextBtn.addEventListener('click', () => this.navigate('next'));
        closeBtn.addEventListener('click', () => this.closeGallery());

        // Click en miniaturas
        thumbsContainer.addEventListener('click', (e) => {
            const thumb = e.target.closest('.gallery-thumb');
            if (!thumb) return;
            
            const index = parseInt(thumb.dataset.index);
            if (!isNaN(index)) {
                this.state.currentIndex = index;
                this.updateGalleryView();
            }
        });

        // Eventos táctiles para móviles
        mainImage.addEventListener('touchstart', (e) => {
            this.state.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        mainImage.addEventListener('touchend', (e) => {
            this.state.touchEndX = e.changedTouches[0].clientX;
            const diff = this.state.touchStartX - this.state.touchEndX;

            if (Math.abs(diff) > 50) { // Umbral de 50px para el swipe
                this.navigate(diff > 0 ? 'next' : 'prev');
            }
        }, { passive: true });

        // Cerrar al hacer click fuera
        this.state.galleryElement.addEventListener('click', (e) => {
            if (e.target === this.state.galleryElement) {
                this.closeGallery();
            }
        });

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (!this.state.galleryElement.classList.contains('show')) return;

            switch (e.key) {
                case 'ArrowLeft':
                    this.navigate('prev');
                    break;
                case 'ArrowRight':
                    this.navigate('next');
                    break;
                case 'Escape':
                    this.closeGallery();
                    break;
            }
        });
    },

    navigate(direction) {
        if (direction === 'prev') {
            this.state.currentIndex = this.state.currentIndex > 0 ? 
                this.state.currentIndex - 1 : this.state.images.length - 1;
        } else {
            this.state.currentIndex = this.state.currentIndex < this.state.images.length - 1 ? 
                this.state.currentIndex + 1 : 0;
        }
        this.updateGalleryView();
    },

    closeGallery() {
        if (!this.state.galleryElement) return;
        this.state.galleryElement.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// Exportar el componente
window.PropertyGallery = PropertyGallery;
// =========== FIN: components/propertyGallery.js ===========

// =========== INICIO: components/propertyMap.js ===========

const PropertyMap = {
    state: {
        map: null,
        markers: [],
        activeMarkerId: null,
        bounds: null
    },

    initializeMainMap() {
        try {
            const mapElement = document.getElementById('map');
            if (!mapElement) return null;

            if (this.state.map) {
                this.state.map.remove();
            }

            const map = L.map('map', {
                zoomControl: false,
                scrollWheelZoom: true
            }).setView(CONFIG.map.defaultCenter, CONFIG.map.defaultZoom);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(map);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                maxZoom: 19
            }).addTo(map);

            map.getContainer().classList.add('elegant-map');

            this.state.map = map;
            return map;
        } catch (error) {
            console.error('Error initializing main map:', error);
            return null;
        }
    },

    initializeDetailMap(property) {
        if (!property?.latitude || !property?.longitude) {
            console.warn('Invalid property data for detail map');
            return;
        }

        const mapContainer = document.getElementById('detailMap');
        if (!mapContainer) return;

        try {
            if (this.state.detailMap) {
                this.state.detailMap.remove();
                this.state.detailMap = null;
            }

            const map = L.map('detailMap', {
                center: [property.latitude, property.longitude],
                zoom: 15,
                zoomControl: false,
                scrollWheelZoom: true
            });

            L.control.zoom({
                position: 'bottomright'
            }).addTo(map);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB'
            }).addTo(map);

            map.getContainer().classList.add('elegant-map');

            const marker = this.createPropertyMarker(property);
            marker.addTo(map);

            this.state.detailMap = map;

            setTimeout(() => {
                map.invalidateSize();
                map.setView([property.latitude, property.longitude], 15);
            }, 250);
        } catch (error) {
            console.error('Error initializing detail map:', error);
        }
    },

    initializeModalMap(property) {
        if (!property?.latitude || !property?.longitude) {
            console.warn('Invalid property data for modal map');
            return;
        }
    
        const modalMapContainer = document.getElementById('propertyMap');
        if (!modalMapContainer) return;
    
        try {
            if (this.state.modalMap) {
                this.state.modalMap.remove();
                this.state.modalMap = null;
            }
    
            // Esperar a que el contenedor sea visible y tenga dimensiones
            setTimeout(() => {
                // Asegurarnos de que el contenedor tenga dimensiones antes de inicializar el mapa
                if (modalMapContainer.clientWidth === 0 || modalMapContainer.clientHeight === 0) {
                    console.warn('Map container has no dimensions, aborting map initialization');
                    return;
                }
    
                const map = L.map(modalMapContainer, {
                    zoomControl: false,
                    scrollWheelZoom: false,
                    dragging: !L.Browser.mobile
                });
    
                L.control.zoom({
                    position: 'bottomright'
                }).addTo(map);
    
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '©OpenStreetMap, ©CartoDB'
                }).addTo(map);
    
                map.getContainer().classList.add('elegant-map');
    
                // Crear marcador
                this.createModalMarker(map, property.latitude, property.longitude);
                
                this.state.modalMap = map;
    
                // Establecer vista solo cuando el mapa esté completamente inicializado
                setTimeout(() => {
                    map.invalidateSize();
                    map.setView([property.latitude, property.longitude], 15, {
                        animate: false
                    });
                }, 100);
            }, 500); // Mayor delay para asegurar que el modal esté completamente visible
        } catch (error) {
            console.error('Error initializing modal map:', error);
        }
    },

    createModalMarker(map, lat, lng) {
        const markerHtml = `
            <div class="modal-map-marker">
                <div class="modal-marker-pin"></div>
            </div>
        `;

        const icon = L.divIcon({
            html: markerHtml,
            className: 'custom-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        return L.marker([lat, lng], { icon }).addTo(map);
    },

    addMarkers(properties, onClick) {
        this.clearMarkers();
        
        if (!properties || !Array.isArray(properties) || properties.length === 0) {
            if (this.state.map) {
                this.state.map.setView(CONFIG.map.defaultCenter, CONFIG.map.defaultZoom);
            }
            return;
        }

        const bounds = L.latLngBounds();

        properties.forEach(property => {
            if (!property.latitude || !property.longitude) return;

            const marker = this.createPropertyMarker(property, onClick);
            if (marker) {
                marker.propertyId = property.id;
                marker.addTo(this.state.map);
                this.state.markers.push(marker);
                bounds.extend([property.latitude, property.longitude]);
            }
        });

        if (bounds.getNorthEast() && bounds.getSouthWest()) {
            this.state.bounds = bounds;
            this.state.map.fitBounds(bounds.pad(0.1));
        }
    },

    createPropertyMarker(property, onClick = null) {
        if (!property.latitude || !property.longitude) return null;

        const getMarkerClass = (propertyType) => {
            const types = {
                'house': 'marker-house',
                'houses': 'marker-house',
                'apartment': 'marker-apartment',
                'apartments': 'marker-apartment',
                'condo': 'marker-condo',
                'condos': 'marker-condo',
                'land': 'marker-land',
                'estate': 'marker-estate'
            };
            return types[propertyType.toLowerCase()] || 'marker-house';
        };

        const getMarkerIcon = (propertyType) => {
            const icons = {
                'house': 'fa-home',
                'houses': 'fa-home',
                'apartment': 'fa-building',
                'apartments': 'fa-building',
                'condo': 'fa-city',
                'condos': 'fa-city',
                'land': 'fa-mountain',
                'estate': 'fa-landmark'
            };
            return icons[propertyType.toLowerCase()] || 'fa-home';
        };

        const markerHtml = `
            <div class="main-marker ${getMarkerClass(property.propertytypelabel)}">
                <i class="fas ${getMarkerIcon(property.propertytypelabel)}"></i>
                <div class="property-popup">
                    <h3 class="property-popup-title">${property.subdivisionname}</h3>
                    <div class="property-popup-price">${Formatters.formatPrice(property.currentpricepublic)}</div>
                    <div class="property-popup-address">${property.unparsedaddress}</div>
                </div>
            </div>
        `;

        const icon = L.divIcon({
            html: markerHtml,
            className: 'property-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker([property.latitude, property.longitude], { icon });

        if (onClick) {
            marker.on('click', () => onClick(property.id));
        }

        marker.on('mouseover', (e) => {
            const element = e.target.getElement();
            if (element) {
                element.style.zIndex = 1000;
                const popup = element.querySelector('.property-popup');
                if (popup) popup.style.display = 'block';
            }
        });

        marker.on('mouseout', (e) => {
            const element = e.target.getElement();
            if (element) {
                element.style.zIndex = e.target.propertyId === this.state.activeMarkerId ? 1000 : 1;
                const popup = element.querySelector('.property-popup');
                if (popup) popup.style.display = 'none';
            }
        });

        return marker;
    },

    clearMarkers() {
        this.state.markers.forEach(marker => marker.remove());
        this.state.markers = [];
        this.state.activeMarkerId = null;
    },

    highlightMarker(propertyId) {
        this.state.markers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                const markerDiv = element.querySelector('.main-marker');
                if (markerDiv) {
                    const isActive = marker.propertyId === propertyId;
                    markerDiv.classList.toggle('active', isActive);
                    element.style.zIndex = isActive ? 1000 : 1;
                }
            }
        });
        this.state.activeMarkerId = propertyId;
    },

    focusMarker(propertyId) {
        const marker = this.state.markers.find(m => m.propertyId === propertyId);
        if (marker) {
            const latLng = marker.getLatLng();
            this.state.map.flyTo([latLng.lat - 0.007, latLng.lng], 15, {
                animate: true,
                duration: 0.5
            });
        }
    },

    updateMap() {
        if (this.state.map) {
            this.state.map.invalidateSize();
            if (this.state.bounds && 
                this.state.bounds.getNorthEast() && 
                this.state.bounds.getSouthWest()) {
                this.state.map.fitBounds(this.state.bounds.pad(0.1));
            }
        }

        if (this.state.modalMap) {
            this.state.modalMap.invalidateSize();
        }

        if (this.state.detailMap) {
            this.state.detailMap.invalidateSize();
        }
    },

    destroyDetailMap() {
        if (this.state.detailMap) {
            this.state.detailMap.remove();
            this.state.detailMap = null;
        }
    },
    destroyModalMap() {
        try {
            if (this.state.modalMap) {
                this.state.modalMap.remove();
                this.state.modalMap = null;
            }
        } catch (error) {
            console.error('Error destroying modal map:', error);
            // Asegurarse de que la referencia al mapa se elimine incluso si hay un error
            this.state.modalMap = null;
        }
    }
};

window.PropertyMap = PropertyMap;
// =========== FIN: components/propertyMap.js ===========

// =========== INICIO: app.js ===========

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
// =========== FIN: app.js ===========

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
