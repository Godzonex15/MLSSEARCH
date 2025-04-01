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