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