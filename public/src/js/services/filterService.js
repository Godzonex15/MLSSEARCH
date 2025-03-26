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