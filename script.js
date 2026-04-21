/* ═══════════════════════════════════════════════════════════════════
   Parth Jadhav — Portfolio · JavaScript
   Advanced Interactivity & Modern UI/UX
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Device detection ──────────────────────────────────────────
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ═══════════════════════════════════════════════════════════════
       1. PARTICLE NETWORK BACKGROUND
       ═══════════════════════════════════════════════════════════════ */
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas && !prefersReducedMotion) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        let animFrameId;

        const PARTICLE_COUNT = isMobile ? 30 : 80;
        const CONNECTION_DISTANCE = isMobile ? 100 : 150;
        const MOUSE_INFLUENCE = 80;

        const resizeCanvas = () => {
            const hero = document.getElementById('hero');
            particleCanvas.width = hero.offsetWidth;
            particleCanvas.height = hero.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 0.5;
                this.baseOpacity = Math.random() * 0.4 + 0.1;
                this.opacity = this.baseOpacity;
            }

            update() {
                // Mouse influence
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_INFLUENCE && !isTouchDevice) {
                    const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
                    this.vx += (dx / dist) * force * 0.15;
                    this.vy += (dy / dist) * force * 0.15;
                }

                // Dampen velocity
                this.vx *= 0.99;
                this.vy *= 0.99;

                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges
                if (this.x < 0) this.x = particleCanvas.width;
                if (this.x > particleCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particleCanvas.height;
                if (this.y > particleCanvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(32, 70%, 65%, ${this.opacity})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `hsla(32, 60%, 60%, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animFrameId = requestAnimationFrame(animateParticles);
        };

        // Track mouse in hero area
        const heroSection = document.getElementById('hero');
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        }, { passive: true });

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // Pause when hero not visible
        const heroObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!animFrameId) animateParticles();
            } else {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        }, { threshold: 0.1 });
        heroObserver.observe(heroSection);
    }

    /* ═══════════════════════════════════════════════════════════════
       2. TERMINAL TYPING EFFECT
       ═══════════════════════════════════════════════════════════════ */
    const terminalText = document.getElementById('terminal-text');
    if (terminalText) {
        const phrases = [
            'Compiling code...',
            'Building scalable systems...',
            'Solving problems...',
            'B.Tech Computer Engineering | Software Developer',
            'Hello, World! 👋'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const TYPE_SPEED = 60;
        const DELETE_SPEED = 35;
        const PAUSE_AFTER_TYPE = 1800;
        const PAUSE_AFTER_DELETE = 400;

        const typeEffect = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isPaused) return;

            if (!isDeleting) {
                // Typing forward
                terminalText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    // Check if last phrase — stop deleting
                    if (phraseIndex === phrases.length - 1) {
                        return; // Stay on last phrase
                    }
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                        typeEffect();
                    }, PAUSE_AFTER_TYPE);
                    return;
                }
            } else {
                // Deleting
                terminalText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex++;
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        typeEffect();
                    }, PAUSE_AFTER_DELETE);
                    return;
                }
            }

            setTimeout(typeEffect, isDeleting ? DELETE_SPEED : TYPE_SPEED);
        };

        // Start after initial hero reveal
        setTimeout(typeEffect, 1200);
    }

    /* ═══════════════════════════════════════════════════════════════
       3. CURSOR SPOTLIGHT (Night-Flash)
       ═══════════════════════════════════════════════════════════════ */
    const spotlight = document.getElementById('cursor-spotlight');
    if (spotlight && !isTouchDevice && !isMobile && !prefersReducedMotion) {
        let spotlightX = 0;
        let spotlightY = 0;
        let currentX = 0;
        let currentY = 0;
        let spotlightActive = false;

        document.addEventListener('mousemove', (e) => {
            spotlightX = e.clientX;
            spotlightY = e.clientY;

            if (!spotlightActive) {
                spotlightActive = true;
                spotlight.classList.add('active');
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            spotlightActive = false;
            spotlight.classList.remove('active');
        });

        const updateSpotlight = () => {
            // Smooth lerp
            currentX += (spotlightX - currentX) * 0.12;
            currentY += (spotlightY - currentY) * 0.12;

            spotlight.style.background = `radial-gradient(
                400px circle at ${currentX}px ${currentY}px,
                hsla(32, 70%, 55%, 0.07),
                hsla(32, 60%, 45%, 0.03) 40%,
                transparent 70%
            )`;

            requestAnimationFrame(updateSpotlight);
        };

        requestAnimationFrame(updateSpotlight);
    }

    /* ═══════════════════════════════════════════════════════════════
       4. STICKY NAVBAR
       ═══════════════════════════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const heroEl = document.getElementById('hero');
    let lastScroll = 0;

    const handleNavbarScroll = () => {
        const currentScroll = window.scrollY;
        const heroHeight = heroEl.offsetHeight;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScroll > heroHeight) {
            if (currentScroll > lastScroll && currentScroll - lastScroll > 10) {
                navbar.classList.add('hidden');
            } else if (lastScroll - currentScroll > 10) {
                navbar.classList.remove('hidden');
            }
        } else {
            navbar.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    /* ═══════════════════════════════════════════════════════════════
       5. MOBILE MENU TOGGLE
       ═══════════════════════════════════════════════════════════════ */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       6. ACTIVE NAV LINK ON SCROLL
       ═══════════════════════════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ═══════════════════════════════════════════════════════════════
       7. SMOOTH SCROLL
       ═══════════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       8. SCROLL REVEAL ANIMATIONS — Enhanced with Cascade
       ═══════════════════════════════════════════════════════════════ */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If this element has children that should cascade
                if (entry.target.classList.contains('reveal-cascade')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, i) => {
                        child.style.transitionDelay = `${i * 80}ms`;
                    });
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ═══════════════════════════════════════════════════════════════
       9. SKILL BAR FILL ANIMATION
       ═══════════════════════════════════════════════════════════════ */
    const skillBars = document.querySelectorAll('.skill-bar__fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = `${width}%`;
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    /* ═══════════════════════════════════════════════════════════════
       10. COUNTER ANIMATION
       ═══════════════════════════════════════════════════════════════ */
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    /* ═══════════════════════════════════════════════════════════════
       11. 3D TILT EFFECT — Enhanced with Light Reflection
       ═══════════════════════════════════════════════════════════════ */
    if (!isTouchDevice && !isMobile) {
        // ─── Project Cards (strong tilt: ±8°) ──────────────────────
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Move glow
                const glow = card.querySelector('.project-card__glow');
                if (glow) {
                    glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, hsla(32, 70%, 60%, 0.12), transparent 40%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                const glow = card.querySelector('.project-card__glow');
                if (glow) {
                    glow.style.background = 'transparent';
                }
            });
        });

        // ─── Skill Category Cards (light tilt: ±4°) ────────────────
        const skillCards = document.querySelectorAll('.skill-category');

        skillCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });

        // ─── Timeline Content Cards (light tilt: ±3°) ──────────────
        const timelineCards = document.querySelectorAll('.timeline-content');

        timelineCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0)';
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       12. ACHIEVEMENT CARD SHINE EFFECT
       ═══════════════════════════════════════════════════════════════ */
    const achievementCards = document.querySelectorAll('.achievement-card');

    achievementCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const shine = card.querySelector('.achievement-card__shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}% ${y}%, hsla(32, 70%, 60%, 0.15), transparent 50%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const shine = card.querySelector('.achievement-card__shine');
            if (shine) {
                shine.style.background = 'transparent';
            }
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       13. SKILL TAG INTERACTION
       ═══════════════════════════════════════════════════════════════ */
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = `translateY(-3px) rotate(${(Math.random() - 0.5) * 4}deg)`;
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) rotate(0)';
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       14. CONTACT FORM
       ═══════════════════════════════════════════════════════════════ */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) return;

        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.classList.add('btn--success');
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn--success');
            }, 3000);
        }, 1500);
    });

    /* ═══════════════════════════════════════════════════════════════
       15. PARALLAX — Hero Orbs (Mouse) + Scroll-based
       ═══════════════════════════════════════════════════════════════ */
    // Mouse parallax for hero orbs
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        const orb1 = document.querySelector('.hero-orb--1');
        const orb2 = document.querySelector('.hero-orb--2');
        const orb3 = document.querySelector('.hero-orb--3');

        if (orb1) orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        if (orb2) orb2.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
        if (orb3) orb3.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    }, { passive: true });

    // Scroll parallax for hero background elements
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroEl ? heroEl.offsetHeight : 800;

            if (scrollY < heroHeight * 1.5) {
                const gridOverlay = document.querySelector('.hero-grid-overlay');
                if (gridOverlay) {
                    gridOverlay.style.transform = `translateY(${scrollY * 0.3}px)`;
                }

                // Fade hero content slightly as scrolling past
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    const opacity = Math.max(0, 1 - (scrollY / heroHeight) * 1.2);
                    const translateY = scrollY * 0.15;
                    heroContent.style.opacity = opacity;
                    heroContent.style.transform = `translateY(${translateY}px)`;
                }
            }
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════════════════════════
       16. TIMELINE ANIMATION
       ═══════════════════════════════════════════════════════════════ */
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    /* ═══════════════════════════════════════════════════════════════
       17. TYPED EFFECT FOR HERO GREETING
       ═══════════════════════════════════════════════════════════════ */
    const greetingEl = document.querySelector('.hero-greeting');
    if (greetingEl) {
        const text = greetingEl.textContent;
        greetingEl.textContent = '';
        greetingEl.style.opacity = '1';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                greetingEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, 80);
            }
        };
        setTimeout(type, 600);
    }

    /* ═══════════════════════════════════════════════════════════════
       18. EASTER EGG — Secret Terminal
       ═══════════════════════════════════════════════════════════════ */
    const easterEggToggle = document.getElementById('easter-egg-toggle');
    const easterEggPanel = document.getElementById('easter-egg-panel');
    const easterEggClose = document.getElementById('easter-egg-close');
    const easterEggJoke = document.getElementById('easter-egg-joke');

    const techJokes = [
        "Why do programmers prefer dark mode?\nBecause light attracts bugs. 🐛",
        "// TODO: write a joke\n// STATUS: deployed to production anyway 🚀",
        "There are only 10 types of people:\nthose who understand binary, and those who don't.",
        "A SQL query walks into a bar, sees two tables,\nand asks... 'Can I JOIN you?' 🍻",
        "!false — It's funny because it's true. 😏",
        "A programmer's wife tells him:\n'Go to the store and buy a loaf of bread.\nIf they have eggs, buy a dozen.'\nHe came back with 12 loaves. 🍞",
        "Why do Java developers wear glasses?\nBecause they can't C# 👓",
        "git commit -m 'fixed bug'\ngit push\n// narrator: he did not fix the bug 💀",
        "Debugging: Being the detective in a crime movie\nwhere you are also the murderer. 🔍",
        "It works on my machine! ¯\\_(ツ)_/¯\n*Ships entire machine to production*"
    ];

    let easterEggTimeout = null;

    if (easterEggToggle && easterEggPanel) {
        const showEasterEgg = () => {
            const randomJoke = techJokes[Math.floor(Math.random() * techJokes.length)];

            // Type out the joke character by character
            if (easterEggJoke) {
                easterEggJoke.textContent = '';
                let jokeIdx = 0;
                const typeJoke = () => {
                    if (jokeIdx < randomJoke.length) {
                        easterEggJoke.textContent += randomJoke.charAt(jokeIdx);
                        jokeIdx++;
                        setTimeout(typeJoke, 25);
                    }
                };
                setTimeout(typeJoke, 300);
            }

            easterEggPanel.classList.add('visible');

            // Auto-hide after 8 seconds
            clearTimeout(easterEggTimeout);
            easterEggTimeout = setTimeout(() => {
                easterEggPanel.classList.remove('visible');
            }, 8000);
        };

        const hideEasterEgg = () => {
            easterEggPanel.classList.remove('visible');
            clearTimeout(easterEggTimeout);
        };

        easterEggToggle.addEventListener('click', showEasterEgg);
        easterEggClose.addEventListener('click', hideEasterEgg);
    }
});
