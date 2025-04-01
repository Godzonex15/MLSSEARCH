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