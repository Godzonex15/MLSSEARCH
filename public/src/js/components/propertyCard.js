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