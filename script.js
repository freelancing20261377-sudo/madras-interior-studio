/**
 * AETHER INTERIOR STUDIO - MAIN JAVASCRIPT
 * =========================================
 * Features:
 * - Loading screen animation
 * - Sticky navbar with scroll effect
 * - Mobile navigation toggle
 * - Smooth scrolling for anchor links
 * - Scroll reveal animations (IntersectionObserver)
 * - Portfolio gallery filtering
 * - Testimonial slider
 * - Animated stat counters
 * - Contact form validation & submission
 * - Back-to-top button
 * - Active nav link highlighting on scroll
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // DOM Element References
    // =========================================
    const loadingScreen = document.getElementById('loading-screen');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const statNumbers = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contact-form');
    const yearSpan = document.getElementById('year');

    // Testimonial slider elements
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    const testimonialsDotsContainer = document.getElementById('testimonials-dots');

    // =========================================
    // 1. LOADING SCREEN
    // =========================================
    function hideLoadingScreen() {
        if (!loadingScreen) return;
        // Wait for loading animation to complete before hiding
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Trigger hero reveal animations after loading
            setTimeout(() => {
                document.querySelectorAll('.hero .reveal').forEach(el => {
                    el.classList.add('revealed');
                });
            }, 200);
        }, 2000);
    }
    hideLoadingScreen();

    // =========================================
    // 2. STICKY NAVBAR & SCROLL EFFECTS
    // =========================================
    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background change
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link highlighting
        highlightActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // =========================================
    // 3. MOBILE NAVIGATION TOGGLE
    // =========================================
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            toggleMobileMenu();
        }
    });

    // =========================================
    // 4. SMOOTH SCROLLING FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // 5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
    // =========================================
    function highlightActiveNavLink() {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // =========================================
    // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // 7. PORTFOLIO GALLERY FILTERING
    // =========================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter portfolio cards
            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Small delay for smooth reflow
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });

    // =========================================
    // 8. TESTIMONIAL SLIDER
    // =========================================
    let currentSlide = 0;
    const testimonialCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const totalSlides = testimonialCards.length;

    // Create dot indicators
    function createDots() {
        if (!testimonialsDotsContainer) return;
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            testimonialsDotsContainer.appendChild(dot);
        }
    }
    createDots();

    const dots = testimonialsDotsContainer.querySelectorAll('.testimonial-dot');

    function updateSlider() {
        testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Animate card content
        testimonialCards.forEach((card, index) => {
            if (index === currentSlide) {
                card.classList.add('revealed');
            } else {
                card.classList.remove('revealed');
            }
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    testimonialNext.addEventListener('click', nextSlide);
    testimonialPrev.addEventListener('click', prevSlide);

    // Auto-advance testimonials every 6 seconds
    let autoSlideInterval = setInterval(nextSlide, 6000);

    // Pause auto-slide on interaction
    [testimonialNext, testimonialPrev, testimonialsDotsContainer].forEach(el => {
        el.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        el.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 6000);
        });
    });

    // Initialize first testimonial as visible
    if (testimonialCards.length > 0) {
        testimonialCards[0].classList.add('revealed');
    }

    // =========================================
    // 9. ANIMATED STAT COUNTERS
    // =========================================
    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counter animation when about section is visible
    const aboutSection = document.getElementById('about');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (aboutSection) counterObserver.observe(aboutSection);

    // =========================================
    // 10. CONTACT FORM VALIDATION & SUBMISSION
    // =========================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showFieldError(fieldId, show) {
        const group = document.getElementById(fieldId)?.closest('.form-group');
        if (group) {
            group.classList.toggle('error', show);
        }
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const message = document.getElementById('message');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const successMsg = document.getElementById('form-success');

        let isValid = true;

        // Name validation
        if (!name.value.trim()) {
            showFieldError('name', true);
            isValid = false;
        } else {
            showFieldError('name', false);
        }

        // Email validation
        if (!email.value.trim() || !validateEmail(email.value.trim())) {
            showFieldError('email', true);
            isValid = false;
        } else {
            showFieldError('email', false);
        }

        // Service validation
        if (!service.value) {
            showFieldError('service', true);
            isValid = false;
        } else {
            showFieldError('service', false);
        }

        // Message validation
        if (!message.value.trim()) {
            showFieldError('message', true);
            isValid = false;
        } else {
            showFieldError('message', false);
        }

        if (!isValid) return;

        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            successMsg.classList.add('visible');
            contactForm.reset();

            // Hide success message after 6 seconds
            setTimeout(() => {
                successMsg.classList.remove('visible');
            }, 6000);
        }, 1500);
    });

    // Real-time validation on input
    ['name', 'email', 'service', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                showFieldError(fieldId, false);
            });
        }
    });

    // =========================================
    // 11. BACK TO TOP BUTTON
    // =========================================
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================
    // 12. DYNAMIC YEAR IN FOOTER
    // =========================================
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // =========================================
    // 13. NAVBAR LINK CLICK - CLOSE MOBILE MENU
    // =========================================
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // =========================================
    // 14. PARALLAX EFFECT ON HERO (subtle)
    // =========================================
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
            }
        }, { passive: true });
    }

    // =========================================
    // 15. KEYBOARD NAVIGATION FOR TESTIMONIALS
    // =========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // =========================================
    // 16. TOUCH SWIPE FOR TESTIMONIALS
    // =========================================
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialsTrack) {
        testimonialsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }, { passive: true });
    }

    // =========================================
    // 17. PORTFOLIO CARD LINK PREVENT DEFAULT (demo)
    // =========================================
    document.querySelectorAll('.portfolio-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // In production, this would navigate to the project detail page
            alert('Project detail page coming soon!');
        });
    });

    console.log('Aether Interior Studio - Website initialized successfully');
});
