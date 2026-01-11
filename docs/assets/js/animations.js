// MediaBay Advanced Animations
class MediaBayAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeWordAnimations();
        this.initializeParticleSystem();
        this.initializeMouseFollower();
        this.initializeScrollTriggers();
        this.initializeHoverEffects();
        this.initializeLoadingAnimations();
        this.initializePageTransitions();
        
        console.log('MediaBay animations initialized');
    }

    // Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll(`
            .service-card,
            .template-card,
            .testimonial-slide,
            .timeline-item,
            .stat-item,
            .contact-item,
            .section-header,
            .hero-visual,
            .portfolio-content
        `);

        elements.forEach(el => {
            this.observer.observe(el);
        });
    }

    triggerAnimation(element, ratio) {
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element, ratio);
                break;
            case 'slideInLeft':
                this.slideInLeft(element, ratio);
                break;
            case 'slideInRight':
                this.slideInRight(element, ratio);
                break;
            case 'scaleIn':
                this.scaleIn(element, ratio);
                break;
            case 'rotateIn':
                this.rotateIn(element, ratio);
                break;
            default:
                this.fadeInUp(element, ratio);
        }
    }

    getAnimationType(element) {
        if (element.classList.contains('service-card')) return 'fadeInUp';
        if (element.classList.contains('template-card')) return 'scaleIn';
        if (element.classList.contains('timeline-item')) return 'slideInLeft';
        if (element.classList.contains('stat-item')) return 'scaleIn';
        if (element.classList.contains('contact-item')) return 'slideInRight';
        return 'fadeInUp';
    }

    // Animation methods
    fadeInUp(element, ratio) {
        const progress = Math.min(ratio * 2, 1);
        element.style.opacity = progress;
        element.style.transform = `translateY(${50 * (1 - progress)}px)`;
    }

    slideInLeft(element, ratio) {
        const progress = Math.min(ratio * 2, 1);
        element.style.opacity = progress;
        element.style.transform = `translateX(${-100 * (1 - progress)}px)`;
    }

    slideInRight(element, ratio) {
        const progress = Math.min(ratio * 2, 1);
        element.style.opacity = progress;
        element.style.transform = `translateX(${100 * (1 - progress)}px)`;
    }

    scaleIn(element, ratio) {
        const progress = Math.min(ratio * 2, 1);
        const scale = 0.5 + (0.5 * progress);
        element.style.opacity = progress;
        element.style.transform = `scale(${scale})`;
    }

    rotateIn(element, ratio) {
        const progress = Math.min(ratio * 2, 1);
        const rotation = 180 * (1 - progress);
        element.style.opacity = progress;
        element.style.transform = `rotate(${rotation}deg) scale(${0.5 + (0.5 * progress)})`;
    }

    // Word animations for hero section
    initializeWordAnimations() {
        const words = document.querySelectorAll('.word-animate');
        
        words.forEach((word, index) => {
            word.addEventListener('mouseenter', () => {
                this.animateWord(word, 'hover');
            });
            
            word.addEventListener('mouseleave', () => {
                this.animateWord(word, 'leave');
            });
        });

        // Trigger initial word reveal animation
        setTimeout(() => {
            this.revealWords(words);
        }, 3500);
    }

    revealWords(words) {
        words.forEach((word, index) => {
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0) scale(1)';
                
                // Add sparkle effect
                this.addSparkleEffect(word);
            }, index * 300);
        });
    }

    animateWord(word, type) {
        if (type === 'hover') {
            word.style.transform = 'translateY(-5px) scale(1.05)';
            word.style.textShadow = '0 10px 30px rgba(232, 122, 100, 0.5)';
            word.style.color = '#E87A64';
        } else {
            word.style.transform = 'translateY(0) scale(1)';
            word.style.textShadow = 'none';
            word.style.color = '';
        }
    }

    addSparkleEffect(element) {
        const sparkles = [];
        const sparkleCount = 5;

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #E87A64;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                z-index: 1000;
            `;
            
            document.body.appendChild(sparkle);
            sparkles.push(sparkle);
        }

        const rect = element.getBoundingClientRect();
        
        sparkles.forEach((sparkle, index) => {
            const angle = (360 / sparkleCount) * index;
            const distance = 30;
            const x = rect.left + rect.width / 2 + Math.cos(angle * Math.PI / 180) * distance;
            const y = rect.top + rect.height / 2 + Math.sin(angle * Math.PI / 180) * distance;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Animate sparkle
            sparkle.animate([
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0)' }
            ], {
                duration: 800,
                delay: index * 100,
                easing: 'ease-out'
            }).onfinish = () => {
                sparkle.remove();
            };
        });
    }

    // Particle system for background effects
    initializeParticleSystem() {
        this.createParticleCanvas();
        this.particles = [];
        this.initParticles();
        this.animateParticles();
    }

    createParticleCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const particleCount = Math.min(50, window.innerWidth / 20);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#132541' : '#E87A64'
            });
        }
    }

    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    // Mouse follower effect
    initializeMouseFollower() {
        this.mouseFollower = document.createElement('div');
        this.mouseFollower.className = 'mouse-follower';
        this.mouseFollower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(232, 122, 100, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease-out;
            opacity: 0;
        `;
        
        document.body.appendChild(this.mouseFollower);
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.mouseFollower.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouseFollower.style.opacity = '0';
        });
        
        // Smooth following animation
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            this.mouseFollower.style.left = followerX - 10 + 'px';
            this.mouseFollower.style.top = followerY - 10 + 'px';
            
            requestAnimationFrame(updateFollower);
        };
        
        updateFollower();
        
        // Scale on hover over interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .service-card, .template-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.mouseFollower.style.transform = 'scale(2)';
                this.mouseFollower.style.background = 'radial-gradient(circle, rgba(232, 122, 100, 0.5), transparent)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.mouseFollower.style.transform = 'scale(1)';
                this.mouseFollower.style.background = 'radial-gradient(circle, rgba(232, 122, 100, 0.3), transparent)';
            });
        });
    }

    // Scroll-triggered animations
    initializeScrollTriggers() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax effect for hero elements
            const heroElements = document.querySelectorAll('.floating-elements .element');
            heroElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.05}deg)`;
            });
            
            // Scale effect for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < windowHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                    const scale = 0.95 + (progress * 0.05);
                    section.style.transform = `scale(${scale})`;
                }
            });
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }

    // Advanced hover effects
    initializeHoverEffects() {
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
                card.style.transform = 'translateY(-15px) rotateX(5deg)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
        
        // Buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createButtonWave(e.target);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(232, 122, 100, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            ripple.remove();
        };
    }

    createButtonWave(button) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.6s ease-in-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(wave);
        
        setTimeout(() => {
            wave.style.left = '100%';
        }, 50);
        
        setTimeout(() => {
            wave.remove();
        }, 650);
    }

    // Loading animations
    initializeLoadingAnimations() {
        const loadingElements = document.querySelectorAll('.loading-bar, .logo-animation');
        
        loadingElements.forEach(element => {
            if (element.classList.contains('loading-bar')) {
                this.animateLoadingBar(element);
            } else if (element.classList.contains('logo-animation')) {
                this.animateLoadingLogo(element);
            }
        });
    }

    animateLoadingBar(bar) {
        const progress = bar.querySelector('::before') || bar;
        let width = 0;
        
        const animate = () => {
            width += Math.random() * 3;
            if (width > 100) width = 100;
            
            progress.style.width = width + '%';
            
            if (width < 100) {
                setTimeout(animate, 50 + Math.random() * 100);
            }
        };
        
        animate();
    }

    animateLoadingLogo(logo) {
        const circle = logo.querySelector('.logo-circle');
        const text = logo.querySelector('.logo-text');
        
        if (circle) {
            circle.style.animation = 'logoSpin 2s linear infinite, logoPulse 1.5s ease-in-out infinite';
        }
        
        if (text) {
            text.style.animation = 'logoFade 2s ease-in-out infinite';
        }
    }

    // Page transitions
    initializePageTransitions() {
        // Add page transition overlay
        this.transitionOverlay = document.createElement('div');
        this.transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #132541, #E87A64);
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
        `;
        
        this.transitionOverlay.innerHTML = 'Loading...';
        document.body.appendChild(this.transitionOverlay);
        
        // Handle page transitions for external links
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    this.showTransition(() => {
                        window.location.href = link.href;
                    });
                }
            });
        });
    }

    showTransition(callback) {
        this.transitionOverlay.style.opacity = '1';
        this.transitionOverlay.style.visibility = 'visible';
        
        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }

    hideTransition() {
        this.transitionOverlay.style.opacity = '0';
        this.transitionOverlay.style.visibility = 'hidden';
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.canvas) {
            this.canvas.remove();
        }
        
        if (this.mouseFollower) {
            this.mouseFollower.remove();
        }
        
        if (this.transitionOverlay) {
            this.transitionOverlay.remove();
        }
    }
}

// Text typing animation
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Morphing shapes animation
class MorphingShapes {
    constructor(container) {
        this.container = container;
        this.shapes = [];
        this.init();
    }

    init() {
        this.createShapes();
        this.animateShapes();
    }

    createShapes() {
        const shapeCount = 5;
        
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: linear-gradient(45deg, #132541, #E87A64);
                border-radius: ${Math.random() * 50}%;
                opacity: 0.1;
                animation: morphFloat ${5 + Math.random() * 5}s ease-in-out infinite;
            `;
            
            this.container.appendChild(shape);
            this.shapes.push(shape);
        }
    }

    animateShapes() {
        this.shapes.forEach((shape, index) => {
            const animate = () => {
                const x = Math.random() * (this.container.offsetWidth - 60);
                const y = Math.random() * (this.container.offsetHeight - 60);
                const scale = 0.5 + Math.random() * 1.5;
                const rotation = Math.random() * 360;
                
                shape.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`;
                shape.style.borderRadius = `${Math.random() * 50}%`;
                
                setTimeout(animate, 3000 + Math.random() * 2000);
            };
            
            setTimeout(animate, index * 500);
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation system
    window.mediaBayAnimations = new MediaBayAnimations();
    
    // Initialize typewriter effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        const words = [
            originalText,
            'Creating Digital Excellence',
            'Building Your Online Presence',
            'Crafting Beautiful Experiences'
        ];
        
        setTimeout(() => {
            new TypeWriter(heroSubtitle, words, 4000);
        }, 5000);
    }
    
    // Initialize morphing shapes for hero section
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        new MorphingShapes(heroVisual);
    }
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes morphFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
            75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        .txt {
            border-right: 2px solid #E87A64;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { border-color: #E87A64; }
            51%, 100% { border-color: transparent; }
        }
        
        .sparkle {
            animation: sparkleAnimation 0.8s ease-out forwards;
        }
        
        @keyframes sparkleAnimation {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
            100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.mediaBayAnimations) {
        window.mediaBayAnimations.destroy();
    }
});

console.log('MediaBay animations.js loaded successfully!');