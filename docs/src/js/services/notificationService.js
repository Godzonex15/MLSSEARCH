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