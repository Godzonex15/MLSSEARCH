const FilterBar = {
    state: {
        activeFilters: {},
        advancedFiltersVisible: false
    },

    init() {
        this.loadSavedFilters();
        this.bindEvents();
        this.updateFilterTags();
    },

    loadSavedFilters() {
        const savedFilters = StorageService.loadFilters();
        if (savedFilters) {
            this.state.activeFilters = savedFilters;
            this.applyFiltersToInputs();
        }
    },

    bindEvents() {
        // Eventos de los selectores de filtro
        document.querySelectorAll('select[id]').forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateFilter(e.target.id, e.target.value);
            });
        });

        // Evento del botón de búsqueda
        const searchForm = document.querySelector('.basic-filters');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyAllFilters();
            });
        }

        // Evento para limpiar todos los filtros
        const clearAllBtn = document.querySelector('.clear-all-filters');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllFilters());
        }

        // Toggle de filtros avanzados
        const advancedToggle = document.querySelector('.advanced-filters-toggle button');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => this.toggleAdvancedFilters());
        }

        // Delegación de eventos para remover filtros individuales
        document.getElementById('filterTags')?.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-filter');
            if (removeBtn) {
                const filterType = removeBtn.dataset.filterType;
                if (filterType) {
                    this.removeFilter(filterType);
                }
            }
        });

        // Eventos del slider de precio
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider && priceSlider.noUiSlider) {
            priceSlider.noUiSlider.on('change', (values) => {
                const [min, max] = values;
                this.handlePriceSliderChange(min, max);
            });
        }
    },

    handlePriceSliderChange(min, max) {
        const numericMin = parseFloat(min.replace(/[^\d.-]/g, ''));
        const numericMax = parseFloat(max.replace(/[^\d.-]/g, ''));
        const value = numericMax >= 5000000 ? `${numericMin}-` : `${numericMin}-${numericMax}`;
        
        const select = document.getElementById('priceRange');
        if (select) {
            select.value = value;
        }
        this.updateFilter('priceRange', value);
    },

    updateFilter(filterType, value) {
        if (!value || value === '') {
            delete this.state.activeFilters[filterType];
        } else {
            this.state.activeFilters[filterType] = value;
        }

        StorageService.saveFilters(this.state.activeFilters);
        this.updateFilterTags();
        APP_STATE.setFilter(filterType, value);

        // Notificar al servicio de analíticas
        if (window.AnalyticsService) {
            AnalyticsService.trackFilterChange({
                filterType,
                value,
                allFilters: {...this.state.activeFilters}
            });
        }
    },

    removeFilter(filterType) {
        const select = document.getElementById(filterType);
        if (select) {
            select.value = '';
        }

        // Si es el filtro de precio y existe el slider
        if (filterType === 'priceRange') {
            const priceSlider = document.getElementById('priceSlider');
            if (priceSlider && priceSlider.noUiSlider) {
                priceSlider.noUiSlider.set([0, 5000000]);
            }
        }
        
        delete this.state.activeFilters[filterType];
        StorageService.saveFilters(this.state.activeFilters);
        this.updateFilterTags();
        APP_STATE.setFilter(filterType, '');
    },

    clearAllFilters() {
        // Limpiar selectores
        document.querySelectorAll('select[id]').forEach(select => {
            select.value = '';
        });

        // Resetear slider de precio
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider && priceSlider.noUiSlider) {
            priceSlider.noUiSlider.set([0, 5000000]);
        }

        // Limpiar filtros activos
        this.state.activeFilters = {};
        StorageService.saveFilters({});
        this.updateFilterTags();
        
        // Notificar al estado global y aplicar filtros
        Object.keys(APP_STATE.activeFilters).forEach(filterType => {
            APP_STATE.setFilter(filterType, '');
        });

        // Actualizar resultados
        this.applyAllFilters();
    },

    toggleAdvancedFilters() {
        const advancedFilters = document.getElementById('advancedFilters');
        const toggleBtn = document.querySelector('.advanced-filters-toggle i.fa-chevron-down, .advanced-filters-toggle i.fa-chevron-up');
        
        if (advancedFilters) {
            this.state.advancedFiltersVisible = !this.state.advancedFiltersVisible;
            
            if (this.state.advancedFiltersVisible) {
                advancedFilters.style.display = 'block';
                setTimeout(() => advancedFilters.classList.add('show'), 10);
                toggleBtn?.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                advancedFilters.classList.remove('show');
                setTimeout(() => {
                    advancedFilters.style.display = 'none';
                }, 300);
                toggleBtn?.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        }
    },

    updateFilterTags() {
        const container = document.getElementById('filterTags');
        if (!container) return;

        const tags = Object.entries(this.state.activeFilters)
            .filter(([_, value]) => value)
            .map(([type, value]) => this.createFilterTag(type, value));

        container.innerHTML = tags.join('');

        // Actualizar visibilidad del contenedor
        const activeFilters = document.getElementById('activeFilters');
        if (activeFilters) {
            activeFilters.style.display = tags.length > 0 ? 'block' : 'none';
        }
    },

    createFilterTag(type, value) {
        let displayValue = value;

        // Formatear valores específicos
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
            case 'location':
                if (value.startsWith('all-')) {
                    const locationOption = FilterService.filterDefinitions.location.options
                        .find(opt => opt.value === value);
                    if (locationOption) {
                        displayValue = locationOption.label;
                    }
                }
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
                <button class="remove-filter" 
                        data-filter-type="${type}"
                        aria-label="Remove ${filterNames[type] || type} filter">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
    },

    applyFiltersToInputs() {
        Object.entries(this.state.activeFilters).forEach(([type, value]) => {
            const input = document.getElementById(type);
            if (input) {
                input.value = value;
            }
            
            // Actualizar slider de precio si es necesario
            if (type === 'priceRange') {
                const priceSlider = document.getElementById('priceSlider');
                if (priceSlider && priceSlider.noUiSlider) {
                    const [min, max] = value.split('-');
                    priceSlider.noUiSlider.set([
                        parseFloat(min),
                        max ? parseFloat(max) : 5000000
                    ]);
                }
            }
        });
    },

    applyAllFilters() {
        window.applyFilters?.();
    },

    getActiveFilters() {
        return {...this.state.activeFilters};
    }
};

// Inicializar el componente
FilterBar.init();

// Exportar para uso global
window.FilterBar = FilterBar;