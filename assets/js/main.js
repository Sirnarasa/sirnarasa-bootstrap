// Sirnarasa - Main JavaScript Module
// Modern ES6+ JavaScript for enhanced user experience
// Dikembangkan oleh okabrionz.com

(function() {
    'use strict';

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    document.addEventListener('DOMContentLoaded', function() {
        initLazyLoading();
        initSmoothScrolling();
        initNavbarEffects();
        initCardAnimations();
        initFormEnhancements();
        initAccessibilityFeatures();
    });

    // ==========================================================================
    // LAZY LOADING
    // ==========================================================================

    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // ==========================================================================
    // SMOOTH SCROLLING
    // ==========================================================================

    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ==========================================================================
    // NAVBAR EFFECTS
    // ==========================================================================

    function initNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollTop = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > scrollThreshold) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }

            // Auto-hide navbar on scroll down (mobile)
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScrollTop = scrollTop;
        }, { passive: true });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            if (navbarCollapse && navbarToggler) {
                const isCollapsed = !navbarCollapse.classList.contains('show');
                const clickedInsideNav = navbar.contains(e.target);
                
                if (!isCollapsed && !clickedInsideNav) {
                    navbarToggler.click();
                }
            }
        });
    }

    // ==========================================================================
    // CARD ANIMATIONS
    // ==========================================================================

    function initCardAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const cards = document.querySelectorAll('.card, .bs-component');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.classList.add('animate-ready');
            cardObserver.observe(card);
        });
    }

    // ==========================================================================
    // FORM ENHANCEMENTS
    // ==========================================================================

    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add floating labels effect
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-content');
                }

                input.addEventListener('blur', function() {
                    if (this.value.trim() !== '') {
                        this.classList.add('has-content');
                    } else {
                        this.classList.remove('has-content');
                    }
                });
            });

            // Enhanced search functionality
            if (form.id === 'cse-search-box') {
                const searchInput = form.querySelector('input[name="q"]');
                if (searchInput) {
                    // Add search suggestions (placeholder for future enhancement)
                    searchInput.addEventListener('input', debounce(function() {
                        const query = this.value.trim();
                        if (query.length >= 3) {
                            // Future: Implement search suggestions
                            console.log('Search query:', query);
                        }
                    }, 300));
                }
            }
        });
    }

    // ==========================================================================
    // ACCESSIBILITY FEATURES
    // ==========================================================================

    function initAccessibilityFeatures() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Keyboard navigation for dropdowns
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Focus trap for modal dialogs (if any)
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', function() {
                const focusableElements = this.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length) {
                    focusableElements[0].focus();
                }
            });
        });

        // Announce dynamic content changes to screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        window.announceToScreenReader = function(message) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalImages = [
            '/apple-touch-icon.png',
            '/img/lazy.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Initialize performance optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    } else {
        preloadCriticalResources();
    }

    // ==========================================================================
    // PROGRESSIVE ENHANCEMENT
    // ==========================================================================

    // Add CSS class to indicate JavaScript is available
    document.documentElement.classList.add('js-enabled');

    // Service Worker registration (for future PWA features)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', function() {
            // Future: Register service worker for offline functionality
            console.log('Service Worker support detected');
        });
    }

    // ==========================================================================
    // ANALYTICS & TRACKING
    // ==========================================================================

    function trackUserInteraction(action, category, label) {
        // Future: Implement privacy-friendly analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Track important user interactions
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            const isExternal = !link.href.startsWith(window.location.origin);
            if (isExternal) {
                trackUserInteraction('click', 'external_link', link.href);
            }
        }
    });

})();