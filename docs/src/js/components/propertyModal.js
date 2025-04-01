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