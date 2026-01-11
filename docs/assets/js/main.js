// MediaBay Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoadingScreen();
    initializeScrollIndicator();
    initializeSidePanel();
    initializeScrollAnimations();
    initializeHeroAnimations();
    initializePortfolioFilters();
    initializeTestimonialSlider();
    initializeIndustrySelector();
    initializeQuoteEstimator();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializeStatsCounter();
    initializeTimelineAnimations();
    
    console.log('MediaBay website initialized successfully!');
});

// Loading Screen Management
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        scrollIndicator.classList.add('visible');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.remove();
            }
        }, 500);
    }, 2500);
}

// Scroll Indicator
function initializeScrollIndicator() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
        
        // Show/hide scroll indicator
        if (scrollIndicator) {
            if (scrollTop > 100) {
                scrollIndicator.classList.add('visible');
            } else {
                scrollIndicator.classList.remove('visible');
            }
        }
    });
}

// Side Panel Navigation
function initializeSidePanel() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidePanel = document.getElementById('side-panel');
    const panelClose = document.getElementById('panel-close');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    document.body.appendChild(overlay);
    
    // Toggle panel
    function togglePanel() {
        const isOpen = sidePanel.classList.contains('open');
        
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }
    
    function openPanel() {
        sidePanel.classList.add('open');
        menuToggle.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closePanel() {
        sidePanel.classList.remove('open');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', togglePanel);
    }
    
    if (panelClose) {
        panelClose.addEventListener('click', closePanel);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closePanel);
    }
    
    // Close panel when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    closePanel();
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    animateElements.forEach(el => observer.observe(el));
    
    // Add animation classes to elements
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.classList.add('fade-in-up', `stagger-${(index % 6) + 1}`);
    });
    
    document.querySelectorAll('.template-card').forEach((card, index) => {
        card.classList.add('scale-in', `stagger-${(index % 3) + 1}`);
    });
    
    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.classList.add('fade-in-left', `stagger-${index + 1}`);
    });
}

// Hero Animations
function initializeHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    const wordAnimates = document.querySelectorAll('.word-animate');
    
    // Trigger word animations on load
    setTimeout(() => {
        wordAnimates.forEach((word, index) => {
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 3000); // After loading screen
    
    // Hero CTA button interactions
    const ctaButtons = document.querySelectorAll('.hero-cta .btn-primary, .hero-cta .btn-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.textContent.includes('Start Your Project')) {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (button.textContent.includes('View Portfolio')) {
                e.preventDefault();
                document.getElementById('portfolio').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Portfolio Filters
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Here you would typically filter portfolio items
            // For now, we'll just show a message
            console.log(`Filtering portfolio by: ${filter}`);
            
            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play slider
    setInterval(nextSlide, 5000);
    
    // Case study expansion
    const expandButtons = document.querySelectorAll('.expand-case-study');
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Here you would typically open a modal or navigate to case study
            alert('Case study details would open here');
        });
    });
}

// Industry Selector
function initializeIndustrySelector() {
    const industryButtons = document.querySelectorAll('.industry-btn');
    const templateCards = document.querySelectorAll('.template-card');
    
    industryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            industryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const industry = button.getAttribute('data-industry');
            
            // Filter template cards
            templateCards.forEach(card => {
                const cardIndustry = card.getAttribute('data-industry');
                
                if (industry === 'all' || cardIndustry === industry) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Template card interactions
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const templateName = card.querySelector('h3').textContent;
            const templatePrice = card.querySelector('.template-price').textContent;
            
            // Here you would typically open template details or start customization
            alert(`Selected template: ${templateName} - ${templatePrice}`);
        });
    });
}

// Quote Estimator
function initializeQuoteEstimator() {
    const pageRadios = document.querySelectorAll('input[name="pages"]');
    const featureCheckboxes = document.querySelectorAll('input[name="features"]');
    const basePriceElement = document.getElementById('base-price');
    const featuresPriceElement = document.getElementById('features-price');
    const totalPriceElement = document.getElementById('total-price');
    const getQuoteBtn = document.querySelector('.get-quote-btn');
    
    function updatePricing() {
        let basePrice = 0;
        let featuresPrice = 0;
        
        // Get base price from selected pages
        const selectedPageOption = document.querySelector('input[name="pages"]:checked');
        if (selectedPageOption) {
            basePrice = parseInt(selectedPageOption.getAttribute('data-price')) || 0;
        }
        
        // Get features price
        featureCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                featuresPrice += parseInt(checkbox.getAttribute('data-price')) || 0;
            }
        });
        
        const totalPrice = basePrice + featuresPrice;
        
        // Update display with animation
        if (basePriceElement) {
            animateNumber(basePriceElement, basePrice);
        }
        
        if (featuresPriceElement) {
            animateNumber(featuresPriceElement, featuresPrice);
        }
        
        if (totalPriceElement) {
            animateNumber(totalPriceElement, totalPrice);
        }
    }
    
    function animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || 
                (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = `R${Math.round(current).toLocaleString()}`;
        }, 50);
    }
    
    // Event listeners
    pageRadios.forEach(radio => {
        radio.addEventListener('change', updatePricing);
    });
    
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePricing);
    });
    
    // Get quote button
 /*   if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            const totalPrice = totalPriceElement ? totalPriceElement.textContent : 'R0';
            
            // Scroll to contact form and pre-fill some information
            const contactSection = document.getElementById('contact');
            const messageField = document.getElementById('message');
            
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                if (messageField) {
                    setTimeout(() => {
                        messageField.value = `I'm interested in getting a quote for a website. Based on the estimator, the estimated cost is ${totalPrice}. Please provide more details.`;
                        messageField.focus();
                    }, 1000);
                }
            }
        });
    }*/
    
    // Initialize with default values
    updatePricing();
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-elements .element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Stats Counter Animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateCounter(target, 0, numericValue, finalValue);
                }
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, start, end, originalText) {
    const duration = 2000;
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= end) {
            current = end;
            clearInterval(timer);
            element.textContent = originalText;
        } else {
            const suffix = originalText.includes('+') ? '+' : 
                          originalText.includes('%') ? '%' : '';
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Timeline Animations
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 100);

const throttledScrollHandler = throttle(() => {
    initializeScrollIndicator();
}, 16);

// Replace direct scroll event listeners with optimized versions
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
    console.error('MediaBay Error:', e.error);
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Escape key closes side panel
    if (e.key === 'Escape') {
        const sidePanel = document.getElementById('side-panel');
        if (sidePanel && sidePanel.classList.contains('open')) {
            const panelClose = document.getElementById('panel-close');
            if (panelClose) {
                panelClose.click();
            }
        }
    }
});

// Focus management for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trapping to side panel
const sidePanel = document.getElementById('side-panel');
if (sidePanel) {
    trapFocus(sidePanel);
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            // Here you would typically send the email to your backend
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
}

// Social media link tracking
const socialLinks = document.querySelectorAll('.social-links a');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = link.getAttribute('aria-label');
        console.log(`Social media click: ${platform}`);
        // Here you would typically send analytics data
    });
});

// Service card interactions
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const service = card.getAttribute('data-service');
        const serviceName = card.querySelector('h3').textContent;
        
        // Scroll to contact form and pre-fill service type
        const contactSection = document.getElementById('contact');
        const projectTypeSelect = document.getElementById('project-type');
        
        if (contactSection && projectTypeSelect) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                // Try to match service to project type options
                const options = projectTypeSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.toLowerCase().includes(serviceName.toLowerCase().split(' ')[0])) {
                        option.selected = true;
                    }
                });
                
                projectTypeSelect.focus();
            }, 1000);
        }
    });
});

console.log('MediaBay main.js loaded successfully!');

//new
window.generateMail = function () {
  // Determine which option is active
  const isOption2 = document.getElementById("option-2").style.display !== "none";

  let subject, body;

  if (isOption2) {
    // Basic package email
    subject = encodeURIComponent("Basic Website Package Quote Request");
    body = encodeURIComponent(
`Hi, I'd like to request a consultation for the Basic Website Package.

Package Details:
- Basic Website (up to 3 pages)
- Responsive design
- Simple professional layout
- Basic SEO setup
- Contact form integration
- One round of minor revisions

No extra animations or advanced features requested at this time.

Please get in touch to schedule a date and time for the consultation.

Thank you.`
    );
  } else {
    // Option 1: full estimator with validation
    // Clear previous warning if any
    const radioGroup = document.querySelector('.radio-group');
    const existingError = document.querySelector('.pages-error');
    if (existingError) existingError.remove();
    if (radioGroup) radioGroup.classList.remove('invalid');

    const pages = document.querySelector('input[name="pages"]:checked');
    if (!pages) {
      if (radioGroup) radioGroup.classList.add('invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'pages-error';
      errorDiv.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" style="margin-right:6px;">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5a.75.75 0 10-1.5 0v5a.75.75 0 001.5 0V7zm0 8a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/>
        </svg>
        <div>Please select the number of pages to proceed.</div>
      `;
      if (radioGroup && radioGroup.parentElement) {
        radioGroup.parentElement.appendChild(errorDiv);
      } else {
        alert("Please select the number of pages to proceed.");
      }
      return;
    }

    const selectedPages = `${pages.labels[0].innerText}`;

    const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
    let selectedFeatures = Array.from(featureCheckboxes)
      .map(cb => `- ${cb.labels[0].innerText}`)
      .join("\n");
    if (!selectedFeatures) selectedFeatures = "None";

    subject = encodeURIComponent("Website Quote Request – Estimator Summary");
    body = encodeURIComponent(
        
`Hi, I'd like to request a consultation for a website project.

Selected Pages: ${selectedPages}

Additional Features:
${selectedFeatures}

Please get in touch to schedule a date and time for the consultation.

Thank you.`
    );
  }

  // Launch email
  window.location.href = `mailto:mediabay3@gmail.com?subject=${subject}&body=${body}`;
};

function clearPagesError() {
  const radioGroup = document.querySelector('.radio-group');
  const existingError = document.querySelector('.pages-error');
  if (existingError) existingError.remove();
  if (radioGroup) radioGroup.classList.remove('invalid');
}

function showPagesError() {
  const radioGroup = document.querySelector('.radio-group');
  if (radioGroup) radioGroup.classList.add('invalid');

  // remove existing if any
  const existingError = document.querySelector('.pages-error');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'pages-error';
  errorDiv.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5a.75.75 0 10-1.5 0v5a.75.75 0 001.5 0V7zm0 8a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/>
    </svg>
    <div>Please select the number of pages to proceed.</div>
  `;
  if (radioGroup && radioGroup.parentElement) {
    radioGroup.parentElement.appendChild(errorDiv);
  } else {
    alert("Please select the number of pages to proceed.");
  }
}

function buildEstimatorSummary() {
  const pages = document.querySelector('input[name="pages"]:checked');
  const selectedPages = pages ? pages.labels[0].innerText : null;

  const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
  const selectedFeaturesArr = Array.from(featureCheckboxes).map(cb => cb.labels[0].innerText);
  const featureText = selectedFeaturesArr.length
    ? selectedFeaturesArr.map(f => `- ${f}`).join("\n")
    : "None";

  const bodyText =
`Hi, I'd like to request a consultation for a website project.

Selected Pages: ${selectedPages || "Not specified"}

Additional Features:
${featureText}

Please get in touch to schedule a date and time for the consultation.

Regards,
[Your Name]`;

  return { selectedPages, bodyText };
}

function sendWhatsApp() {
  clearPagesError();
  const { selectedPages, bodyText } = buildEstimatorSummary();
  if (!selectedPages) {
    showPagesError();
    return;
  }

  // WhatsApp number in international format : 27831234567
  const number = "27831234567";
  const message = `Hi, I'd like to schedule a consultation for a website project.\n\n${bodyText}`;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encoded}`;
  window.open(url, "_blank");
}

// optional: clear error once user selects pages
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="pages"]').forEach(r => {
    r.addEventListener('change', clearPagesError);
  });
});

// Clear error when user picks a page option (only relevant for option 1)
document.addEventListener('DOMContentLoaded', () => {
  const pageRadios = document.querySelectorAll('input[name="pages"]');
  pageRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const radioGroup = document.querySelector('.radio-group');
      if (radioGroup) radioGroup.classList.remove('invalid');
      const existingError = document.querySelector('.pages-error');
      if (existingError) existingError.remove();
    });
  });
});




function showOption(optionNumber) {
  // Hide both
  document.getElementById("option-1").style.display = "none";
  document.getElementById("option-2").style.display = "none";

  // Show selected
  document.getElementById("option-" + optionNumber).style.display = "block";
}



document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.carousel-item');
  const carousel = document.getElementById('carousel');
  const total = items.length;
  const angle = 360 / total;
  let rotationOffset = 0;

  let currentSpeed = -0.5;
  let targetSpeed = -0.5;

  // read depth from CSS if you want dynamic scaling, fallback to 300
  const rootStyles = getComputedStyle(document.documentElement);
  const depth = parseFloat(rootStyles.getPropertyValue('--depth')) || 300;

  function positionItems() {
    items.forEach((item, index) => {
      const rotation = (index * angle + rotationOffset) % 360;
      item.style.transform = `rotateY(${rotation}deg) translateZ(${depth}px)`;

      const normalized = (rotation + 360) % 360;
      const inFront = normalized <= 90 || normalized >= 270;

      if (inFront) {
        item.style.opacity = 1;
        item.style.pointerEvents = 'auto';
        item.classList.add('visible');
      } else {
        item.style.opacity = 0;
        item.style.pointerEvents = 'none';
        item.classList.remove('visible');
      }
    });
  }

  function animate() {
    currentSpeed += (targetSpeed - currentSpeed) * 0.05; // easing
    rotationOffset += currentSpeed;
    positionItems();
    requestAnimationFrame(animate);
  }

  carousel.addEventListener('mouseenter', () => {
    targetSpeed = 0;
  });

  carousel.addEventListener('mouseleave', () => {
    targetSpeed = -0.5;
  });

  positionItems();
  animate();
});

//LOGIN AND SIGNUP
// auth.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginBtn = document.querySelector('.btn-login');
  const signupBtn = document.querySelector('.btn-signup');
  const closeBtn = document.querySelector('.close-auth');

  // Helpers for errors
  function showError(input, msg) {
    const err = document.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    const err = document.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  // Modal control (accessibility-aware)
  let _lastFocusedElement = null;
  function openModal(mode) {
    // Remember last focused element so we can restore focus on close
    _lastFocusedElement = document.activeElement;

    // Show the appropriate form
    if (mode === 'signup') {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    } else {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    }

    // Make modal interactive - remove inert and hidden states first
    modal.removeAttribute('inert');
    modal.removeAttribute('aria-hidden');
    modal.classList.remove('hidden');

    // Focus the first input field in the modal
    // Use setTimeout to ensure modal is fully visible before focusing
    setTimeout(() => {
      const focusTarget = document.getElementById(mode === 'signup' ? 'signup-email' : 'login-email');
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      } else {
        // Fallback to first focusable element inside modal
        const firstFocusable = modal.querySelector('button:not([disabled]), a, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (firstFocusable && typeof firstFocusable.focus === 'function') {
          firstFocusable.focus();
        }
      }
    }, 10);
  }

  function closeModal() {
    // First, blur any focused element inside the modal to prevent aria-hidden warning
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement)) {
      activeElement.blur();
    }

    // Move focus to a safe element outside the modal (accessibility)
    // Prefer the login/signup buttons that opened the modal
    if (loginBtn && loginBtn.offsetParent !== null) {
      // Check if button is visible (offsetParent is null if hidden)
      loginBtn.focus();
    } else if (signupBtn && signupBtn.offsetParent !== null) {
      signupBtn.focus();
    } else if (_lastFocusedElement && typeof _lastFocusedElement.focus === 'function') {
      // Fallback to the element that had focus before opening modal
      _lastFocusedElement.focus();
    } else {
      // Last resort: focus the body
      document.body.focus();
    }

    // Then disable and hide the modal
    modal.setAttribute('inert', '');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  // React to server-side login success (set by PHP as window.mediabayLoginSuccess)
  if (window.mediabayLoginSuccess) {
    // Ensure modal is closed (it should already be closed from form submission, but be safe)
    if (modal && !modal.classList.contains('hidden')) {
      // Only close if modal is actually open
      const activeElement = document.activeElement;
      if (activeElement && modal.contains(activeElement)) {
        activeElement.blur();
      }
      closeModal();
    }

    // Simple toast so user sees confirmation clearly
    (function showServerToast() {
      const text = window.mediabayLoginSuccess;
      const toast = document.createElement('div');
      toast.className = 'server-toast success';
      toast.textContent = text;
      Object.assign(toast.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        zIndex: 99999,
        opacity: 0,
        transition: 'opacity 200ms ease'
      });
      document.body.appendChild(toast);
      setTimeout(() => toast.style.opacity = '1', 50);
      setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 250); }, 4200);
    })();

    // Toggle UI elements (server-rendered content should already match session but ensure visibility)
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    if (authButtons) authButtons.style.display = 'none';
    if (userProfile) userProfile.style.display = 'block';
  }

  // Check session state on page load and update UI accordingly
  function updateAuthUIFromSession() {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    // If user-profile exists in DOM, user is logged in (PHP rendered it)
    // If auth-buttons exists in DOM, user is not logged in (PHP rendered it)
    if (userProfile && userProfile.offsetParent !== null) {
      // User is logged in - ensure profile is visible and buttons are hidden
      userProfile.style.display = 'block';
      if (authButtons) authButtons.style.display = 'none';
      
      // IMPORTANT: Ensure modal is closed if user is logged in
      // This prevents aria-hidden warnings if browser tries to restore focus
      if (modal) {
        // Always ensure modal is closed when user is logged in
        const activeElement = document.activeElement;
        
        // If modal is open or if there's focus inside it, close it properly
        if (!modal.classList.contains('hidden') || (activeElement && modal.contains(activeElement))) {
          // Blur any focused element inside modal
          if (activeElement && modal.contains(activeElement)) {
            activeElement.blur();
          }
          
          // Use inert first (handles focus automatically)
          modal.setAttribute('inert', '');
          modal.classList.add('hidden');
          
          // Set aria-hidden after a tiny delay to ensure focus has moved
          setTimeout(() => {
            const currentFocus = document.activeElement;
            if (!modal.contains(currentFocus)) {
              modal.setAttribute('aria-hidden', 'true');
            } else {
              // Force blur if still inside
              if (currentFocus && modal.contains(currentFocus)) {
                currentFocus.blur();
              }
              modal.setAttribute('aria-hidden', 'true');
            }
          }, 0);
        } else {
          // Modal is already closed, just ensure attributes are set
          if (!modal.hasAttribute('aria-hidden')) {
            modal.setAttribute('aria-hidden', 'true');
          }
          if (!modal.hasAttribute('inert')) {
            modal.setAttribute('inert', '');
          }
        }
      }
    } else if (authButtons && authButtons.offsetParent !== null) {
      // User is not logged in - ensure buttons are visible and profile is hidden
      authButtons.style.display = 'block';
      if (userProfile) userProfile.style.display = 'none';
    }
  }

  // Update UI on page load
  updateAuthUIFromSession();

  // Attach triggers
  if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
  if (signupBtn) signupBtn.addEventListener('click', () => openModal('signup'));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal.querySelector('.auth-backdrop')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Switch links inside forms
  document.querySelectorAll('[data-switch="signup"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal('signup');
    });
  });
  document.querySelectorAll('[data-switch="login"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal('login');
    });
  });

  // LOGIN submission
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      const email = document.getElementById('login-email');
      const pwd = document.getElementById('login-password');

      clearError(email);
      clearError(pwd);

      let valid = true;
      if (!email.value || !email.value.includes('@')) {
        showError(email, 'Valid email required.');
        valid = false;
      }
      if (!pwd.value) {
        showError(pwd, 'Password required.');
        valid = false;
      }
      if (!valid) {
        // block submission when client-side validation fails
        e.preventDefault();
        return;
      }

      // CRITICAL: Use inert attribute to handle focus automatically, then close modal
      e.preventDefault();
      
      const activeElement = document.activeElement;
      
      // Step 1: Set inert FIRST - this automatically removes focus from descendants
      modal.setAttribute('inert', '');
      
      // Step 2: Blur any focused element (inert should handle this, but be explicit)
      if (activeElement && modal.contains(activeElement)) {
        activeElement.blur();
      }
      
      // Step 3: Move focus outside modal
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.focus();
      }
      
      // Step 4: Wait one frame for inert to take effect, then set aria-hidden and submit
      requestAnimationFrame(() => {
        // Now safe to set aria-hidden - inert has already handled focus
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        
        // Submit form after modal is properly closed
        setTimeout(() => {
          loginForm.submit();
        }, 50);
      });
    });
  }

  // SIGNUP submission
  if (signupForm) {
    const signupSubmitBtn = signupForm.querySelector('button[type="submit"]');
    
    // Handle button click instead of form submit for more control
    if (signupSubmitBtn) {
      signupSubmitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = document.getElementById('signup-email');
        const pwd = document.getElementById('signup-password');
        const confirm = document.getElementById('signup-confirm');

        if (!email || !pwd || !confirm) {
          console.error('Signup form fields not found');
          return false;
        }

        clearError(email);
        clearError(pwd);
        clearError(confirm);

        let valid = true;

        // Validate email
        if (!email.value || !email.value.includes('@')) {
          showError(email, 'Valid email required.');
          valid = false;
        }
        
        // Validate password
        if (!pwd.value || pwd.value.length < 8) {
          showError(pwd, 'Password must be 8+ characters.');
          valid = false;
        }
        
        // Validate password confirmation
        if (pwd.value !== confirm.value) {
          showError(confirm, 'Passwords must match.');
          valid = false;
        }
        
        // If validation fails, stop here
        if (!valid) {
          console.log('Signup validation failed');
          return false;
        }
        
        // If validation passes, submit the form to PHP
        console.log('Signup validation passed, submitting form to PHP');
        signupForm.submit();
      });
    }
    
    // Also handle form submit as fallback
    signupForm.addEventListener('submit', function(e) {
      // Only prevent if we haven't already handled it via button click
      if (!signupSubmitBtn || !signupSubmitBtn.dataset.handled) {
        const email = document.getElementById('signup-email');
        const pwd = document.getElementById('signup-password');
        const confirm = document.getElementById('signup-confirm');

        if (!email || !pwd || !confirm) {
          e.preventDefault();
          return false;
        }

        clearError(email);
        clearError(pwd);
        clearError(confirm);

        let valid = true;

        if (!email.value || !email.value.includes('@')) {
          showError(email, 'Valid email required.');
          valid = false;
        }
        
        if (!pwd.value || pwd.value.length < 8) {
          showError(pwd, 'Password must be 8+ characters.');
          valid = false;
        }
        
        if (pwd.value !== confirm.value) {
          showError(confirm, 'Passwords must match.');
          valid = false;
        }
        
        if (!valid) {
          e.preventDefault();
          return false;
        }
      }
    });
  } else {
    console.warn('Signup form not found');
  }

  // Eye toggle (login + signup)
  document.querySelectorAll('.eye-toggle').forEach(toggle => {
    const targetId = toggle.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) {
      console.warn('eye-toggle target missing input:', targetId);
      return;
    }

    const openIcon = toggle.dataset.openIcon;
    const closedIcon = toggle.dataset.closedIcon;
    const img = toggle.querySelector('.eye-icon');

    // initialize
    input.type = 'password';
    if (img && closedIcon) img.src = closedIcon;
    toggle.setAttribute('aria-label', 'Show password');

    const flip = () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      if (img) {
        if (isPassword && openIcon) {
          img.src = openIcon;
        } else if (!isPassword && closedIcon) {
          img.src = closedIcon;
        }
      }
      toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    };

    toggle.addEventListener('click', flip);
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });
});
