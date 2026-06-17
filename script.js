/**
 * Material Design 3 — Main JavaScript
 * Алексей Викулов — Backend-репетитор
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const topAppBar = document.getElementById('top-app-bar');
    const menuBtn = document.getElementById('menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const fab = document.getElementById('fab');
    const bottomNav = document.getElementById('bottom-nav');
    const snackbar = document.getElementById('snackbar');
    const contactForm = document.getElementById('contact-form');

    // ============================================
    // Theme Management
    // ============================================
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ============================================
    // Top App Bar Scroll Effect
    // ============================================
    let lastScrollY = 0;
    let ticking = false;

    function updateAppBar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 10) {
            topAppBar.classList.add('scrolled');
        } else {
            topAppBar.classList.remove('scrolled');
        }
        
        // Hide/Show on scroll (optional)
        // if (scrollY > lastScrollY && scrollY > 100) {
        //     topAppBar.style.transform = 'translateY(-100%)';
        // } else {
        //     topAppBar.style.transform = 'translateY(0)';
        // }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateAppBar);
            ticking = true;
        }
    });

    // ============================================
    // Navigation Drawer
    // ============================================
    function openDrawer() {
        navDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        navDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', openDrawer);
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close drawer on link click
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // ============================================
    // Active Navigation Link
    // ============================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .drawer-link, .bottom-nav-item');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ============================================
    // Course Tabs
    // ============================================
    const segmentBtns = document.querySelectorAll('.segment-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update buttons
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 60;
        const duration = 1500;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = entry.target.querySelectorAll('.stat-value');
                statValues.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const suffix = stat.textContent.replace(/[0-9]/g, '');
                    animateCounter(stat, target, suffix);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // ============================================
    // Fade In Animation
    // ============================================
    const fadeElements = document.querySelectorAll('.card-elevated, .card-filled, .card-outlined, .section-header, .stat-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up', 'visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        el.classList.add('fade-in-up');
        fadeObserver.observe(el);
    });

    // ============================================
    // FAB Visibility
    // ============================================
    let fabVisible = false;

    function updateFabVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Show FAB after scrolling past hero
        if (scrollY > windowHeight * 0.5 && scrollY < docHeight - windowHeight * 2) {
            if (!fabVisible) {
                fab.style.opacity = '1';
                fab.style.transform = 'translateY(0)';
                fabVisible = true;
            }
        } else {
            if (fabVisible) {
                fab.style.opacity = '0';
                fab.style.transform = 'translateY(20px)';
                fabVisible = false;
            }
        }
    }

    // Initial state
    if (fab) {
        fab.style.opacity = '0';
        fab.style.transform = 'translateY(20px)';
        fab.style.transition = 'all 0.3s ease';
    }

    window.addEventListener('scroll', updateFabVisibility);

    // ============================================
    // Form Handling
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate
            if (!data.name || !data.email || !data.message) {
                showSnackbar('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Simulate submission
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showSnackbar('Сообщение отправлено! Я свяжусь с вами в течение 2 часов.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ============================================
    // Snackbar
    // ============================================
    function showSnackbar(message) {
        if (!snackbar) return;
        
        const snackbarText = snackbar.querySelector('.snackbar-text');
        snackbarText.textContent = message;
        snackbar.classList.add('show');
        
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 4000);
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Ripple Effect for Buttons
    // ============================================
    function createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple to buttons
    document.querySelectorAll('.btn-filled, .btn-tonal, .btn-outlined, .btn-text').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ============================================
    // Page Load Animation
    // ============================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        setTimeout(() => {
            document.querySelectorAll('.hero-text > *, .hero-visual > *').forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `all 0.6s cubic-bezier(0.05, 0.7, 0.1, 1) ${i * 0.1}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            });
        }, 100);
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Tab focus management
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // ============================================
    // Performance: Debounce scroll events
    // ============================================
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

    // ============================================
    // Console Easter Egg
    // ============================================
    console.log('%c👨‍💻 Алексей Викулов — Backend-репетитор', 'font-size: 20px; font-weight: bold; color: #D0BCFF;');
    console.log('%cPython • Golang • ЕГЭ', 'font-size: 14px; color: #CCC2DC;');
    console.log('%cХочешь научиться программировать? Запишись на бесплатный пробный урок!', 'font-size: 12px; color: #81C995;');
    console.log('%c📱 WhatsApp: +7 918 345-51-43', 'font-size: 12px;');
    console.log('%c💬 Telegram: @AVick23', 'font-size: 12px;');

})();