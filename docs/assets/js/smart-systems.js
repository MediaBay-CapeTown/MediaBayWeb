// MediaBay Complete Smart Systems & Advanced Tools
class MediaBaySmartSystems {
    constructor() {
        this.darkMode = localStorage.getItem('mediabay_dark_mode') === 'true';
        this.abTestVariants = {};
        this.currentOnboardingStep = 0;
        this.projectStatus = {};
        this.notifications = [];
        this.userPreferences = this.loadUserPreferences();
        this.autoSaveData = {};
        this.feedbackSystem = {};
        this.currentLanguage = localStorage.getItem('mediabay_language') || 'en';
        this.projects = JSON.parse(localStorage.getItem('mediabay_projects') || '[]');
        
        this.init();
    }

    init() {
        this.initializeDarkMode();
        this.initializeABTesting();
        this.initializeOnboardingWizard();
        this.initializeProjectDashboard();
        this.initializeNotificationSystem();
        this.initializeUserProfile();
        this.initializeNewsletterIntegration();
        this.initializeFeedbackSystem();
        this.initializeAutoSave();
        this.initializeAIFormSuggestions();
        this.initializeLocationFinder();
        this.initializeAdvancedPricing();
        this.initializeAnalytics();
        this.initializeLanguageSelector();
        this.initializeCalendarIntegration();
        this.initializePaymentGateway();
        
        console.log('MediaBay Smart Systems initialized');
    }

    // Dark Mode Toggle
    initializeDarkMode() {
        this.createDarkModeToggle();
        this.applyDarkMode();
        
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('mediabay_dark_mode_manual')) {
                    this.darkMode = e.matches;
                    this.applyDarkMode();
                }
            });
        }
    }

    createDarkModeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = `
            <button id="dark-mode-btn" class="dark-mode-btn" aria-label="Toggle dark mode">
                <span class="sun-icon" style="display: ${this.darkMode ? 'none' : 'block'};"></span>
                <span class="moon-icon" style="display: ${this.darkMode ? 'block' : 'none'};"></span>
            </button>
        `;
        
        toggle.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1300;
        `;
        
        document.body.appendChild(toggle);
        
        document.getElementById('dark-mode-btn').addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('mediabay_dark_mode', this.darkMode);
        localStorage.setItem('mediabay_dark_mode_manual', 'true');
        this.applyDarkMode();
        
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    applyDarkMode() {
        const darkModeStyles = `
            :root {
                --primary-color: ${this.darkMode ? '#1e3a5f' : '#132541'};
                --accent-color: ${this.darkMode ? '#ff8a6b' : '#E87A64'};
                --white: ${this.darkMode ? '#1a1a1a' : '#ffffff'};
                --light-gray: ${this.darkMode ? '#2d2d2d' : '#f8f9fa'};
                --medium-gray: ${this.darkMode ? '#888888' : '#6c757d'};
                --dark-gray: ${this.darkMode ? '#e0e0e0' : '#343a40'};
                --text-color: ${this.darkMode ? '#e0e0e0' : '#343a40'};
                --bg-color: ${this.darkMode ? '#1a1a1a' : '#ffffff'};
            }
            
            ${this.darkMode ? `
                body { background-color: var(--bg-color); color: var(--text-color); }
                .hero-section { background: linear-gradient(135deg, #0f1419 0%, #1e3a5f 50%, #0f1419 100%); }
                .loading-screen { background: linear-gradient(135deg, #0f1419 0%, #1e3a5f 100%); }
                .service-card, .template-card, .contact-item, .project-card { 
                    background: var(--light-gray); 
                    border: 1px solid #333;
                }
                .side-panel { background: var(--light-gray); border-right: 1px solid #333; }
                input, textarea, select { 
                    background: var(--light-gray); 
                    color: var(--text-color); 
                    border: 1px solid #444;
                }
                .modal-content { background: var(--light-gray); color: var(--text-color); }
                .payment-option { background: var(--light-gray); border-color: #444; }
                .dashboard-content { background: var(--light-gray); }
            ` : ''}
        `;
        
        let styleSheet = document.getElementById('dark-mode-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'dark-mode-styles';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = darkModeStyles;
        
        const btn = document.getElementById('dark-mode-btn');
        if (btn) {
            btn.style.cssText = `
                background: ${this.darkMode ? '#333' : '#fff'};
                color: ${this.darkMode ? '#fff' : '#333'};
                border: 2px solid var(--accent-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            
            btn.querySelector('.sun-icon').style.display = this.darkMode ? 'none' : 'block';
            btn.querySelector('.moon-icon').style.display = this.darkMode ? 'block' : 'none';
        }
    }

    // A/B Testing System
    initializeABTesting() {
        this.abTests = {
            hero_layout: {
                variants: ['default', 'centered', 'split'],
                weights: [0.4, 0.3, 0.3]
            },
            cta_text: {
                variants: ['Get Started', 'Start Your Project', 'Begin Now'],
                weights: [0.33, 0.33, 0.34]
            },
            pricing_display: {
                variants: ['table', 'cards', 'slider'],
                weights: [0.33, 0.33, 0.34]
            }
        };

        // Apply A/B tests
        Object.keys(this.abTests).forEach(testName => {
            const variant = this.getABTestVariant(testName);
            this.applyABTestVariant(testName, variant);
        });
    }

    getABTestVariant(testName) {
        const stored = localStorage.getItem(`mediabay_ab_${testName}`);
        if (stored) return stored;

        const test = this.abTests[testName];
        const random = Math.random();
        let cumulative = 0;

        for (let i = 0; i < test.variants.length; i++) {
            cumulative += test.weights[i];
            if (random <= cumulative) {
                const variant = test.variants[i];
                localStorage.setItem(`mediabay_ab_${testName}`, variant);
                return variant;
            }
        }

        return test.variants[0];
    }

    applyABTestVariant(testName, variant) {
        switch (testName) {
            case 'hero_layout':
                this.applyHeroLayoutVariant(variant);
                break;
            case 'cta_text':
                this.applyCTATextVariant(variant);
                break;
            case 'pricing_display':
                this.applyPricingDisplayVariant(variant);
                break;
        }
    }

    applyHeroLayoutVariant(variant) {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add(`hero-${variant}`);
        }
    }

    applyCTATextVariant(variant) {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(btn => {
            if (btn.textContent.includes('Start') || btn.textContent.includes('Get')) {
                btn.textContent = variant;
            }
        });
    }

    applyPricingDisplayVariant(variant) {
        const pricingSection = document.querySelector('.quote-estimator-section');
        if (pricingSection) {
            pricingSection.classList.add(`pricing-${variant}`);
        }
    }

    // Client Onboarding Wizard
    initializeOnboardingWizard() {
        window.startOnboarding = () => {
            this.showOnboardingWizard();
        };
    }

    showOnboardingWizard() {
        const wizard = document.createElement('div');
        wizard.className = 'onboarding-wizard';
        wizard.innerHTML = `
            <div class="wizard-overlay"></div>
            <div class="wizard-container">
                <div class="wizard-header">
                    <h2>Welcome to MediaBay!</h2>
                    <p>Let's get your project started in just a few steps</p>
                    <button class="wizard-close" onclick="this.closest('.onboarding-wizard').remove()">&times;</button>
                </div>
                
                <div class="wizard-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 20%"></div>
                    </div>
                    <div class="progress-text">Step 1 of 5</div>
                </div>
                
                <div class="wizard-content">
                    <div class="wizard-step active" data-step="1">
                        <h3>What type of website do you need?</h3>
                        <div class="option-grid">
                            <div class="option-card" data-value="business">
                                <div class="option-icon">🏢</div>
                                <div class="option-title">Business Website</div>
                                <div class="option-desc">Professional site for your company</div>
                            </div>
                            <div class="option-card" data-value="ecommerce">
                                <div class="option-icon">🛒</div>
                                <div class="option-title">E-commerce Store</div>
                                <div class="option-desc">Online store to sell products</div>
                            </div>
                            <div class="option-card" data-value="portfolio">
                                <div class="option-icon">🎨</div>
                                <div class="option-title">Portfolio</div>
                                <div class="option-desc">Showcase your work and skills</div>
                            </div>
                            <div class="option-card" data-value="blog">
                                <div class="option-icon">📝</div>
                                <div class="option-title">Blog/News Site</div>
                                <div class="option-desc">Share content and articles</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="wizard-step" data-step="2">
                        <h3>What's your budget range?</h3>
                        <div class="budget-options">
                            <div class="budget-card" data-value="2500-5000">
                                <div class="budget-amount">R2,500 - R5,000</div>
                                <div class="budget-desc">Basic website with essential features</div>
                            </div>
                            <div class="budget-card" data-value="5000-15000">
                                <div class="budget-amount">R5,000 - R15,000</div>
                                <div class="budget-desc">Professional site with custom design</div>
                            </div>
                            <div class="budget-card" data-value="15000-50000">
                                <div class="budget-amount">R15,000 - R50,000</div>
                                <div class="budget-desc">Advanced features and e-commerce</div>
                            </div>
                            <div class="budget-card" data-value="50000+">
                                <div class="budget-amount">R50,000+</div>
                                <div class="budget-desc">Custom web application</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="wizard-step" data-step="3">
                        <h3>Tell us about your business</h3>
                        <div class="form-group">
                            <label>Business Name</label>
                            <input type="text" id="business-name" placeholder="Your business name">
                        </div>
                        <div class="form-group">
                            <label>Industry</label>
                            <select id="business-industry">
                                <option value="">Select your industry</option>
                                <option value="retail">Retail</option>
                                <option value="technology">Technology</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="finance">Finance</option>
                                <option value="education">Education</option>
                                <option value="hospitality">Hospitality</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Brief Description</label>
                            <textarea id="business-description" placeholder="Tell us about your business and goals"></textarea>
                        </div>
                    </div>
                    
                    <div class="wizard-step" data-step="4">
                        <h3>Upload your brand assets (optional)</h3>
                        <div class="upload-area">
                            <div class="upload-zone" onclick="document.getElementById('logo-upload').click()">
                                <div class="upload-icon">📁</div>
                                <div class="upload-text">Click to upload logo</div>
                                <input type="file" id="logo-upload" accept="image/*" style="display: none;">
                            </div>
                        </div>
                        <div class="color-picker-section">
                            <label>Brand Colors</label>
                            <div class="color-inputs">
                                <input type="color" id="primary-color" value="#132541">
                                <input type="color" id="accent-color" value="#E87A64">
                            </div>
                        </div>
                    </div>
                    
                    <div class="wizard-step" data-step="5">
                        <h3>Review and Submit</h3>
                        <div class="review-summary">
                            <div class="summary-item">
                                <strong>Project Type:</strong> <span id="summary-type"></span>
                            </div>
                            <div class="summary-item">
                                <strong>Budget:</strong> <span id="summary-budget"></span>
                            </div>
                            <div class="summary-item">
                                <strong>Business:</strong> <span id="summary-business"></span>
                            </div>
                            <div class="summary-item">
                                <strong>Industry:</strong> <span id="summary-industry"></span>
                            </div>
                        </div>
                        <div class="contact-info">
                            <div class="form-group">
                                <label>Your Email</label>
                                <input type="email" id="contact-email" placeholder="your@email.com">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="contact-phone" placeholder="+27 XX XXX XXXX">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wizard-actions">
                    <button class="btn-secondary" id="wizard-prev" onclick="this.closest('.onboarding-wizard').querySelector('.wizard-container').previousStep()" style="display: none;">Previous</button>
                    <button class="btn-primary" id="wizard-next" onclick="this.closest('.onboarding-wizard').querySelector('.wizard-container').nextStep()">Next</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(wizard);
        this.setupWizardLogic(wizard);
    }

    setupWizardLogic(wizard) {
        const container = wizard.querySelector('.wizard-container');
        let currentStep = 1;
        const totalSteps = 5;
        const wizardData = {};

        container.nextStep = () => {
            if (this.validateWizardStep(currentStep, wizardData)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    this.updateWizardStep(wizard, currentStep, totalSteps);
                } else {
                    this.submitOnboarding(wizardData);
                }
            }
        };

        container.previousStep = () => {
            if (currentStep > 1) {
                currentStep--;
                this.updateWizardStep(wizard, currentStep, totalSteps);
            }
        };

        // Setup option selection
        wizard.addEventListener('click', (e) => {
            if (e.target.closest('.option-card')) {
                const card = e.target.closest('.option-card');
                const step = card.closest('.wizard-step');
                step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardData.projectType = card.dataset.value;
            }
            
            if (e.target.closest('.budget-card')) {
                const card = e.target.closest('.budget-card');
                const step = card.closest('.wizard-step');
                step.querySelectorAll('.budget-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardData.budget = card.dataset.value;
            }
        });

        // Setup file upload
        wizard.querySelector('#logo-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    wizardData.logo = e.target.result;
                    wizard.querySelector('.upload-text').textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    validateWizardStep(step, data) {
        switch (step) {
            case 1:
                return data.projectType;
            case 2:
                return data.budget;
            case 3:
                const businessName = document.getElementById('business-name').value;
                const industry = document.getElementById('business-industry').value;
                if (businessName && industry) {
                    data.businessName = businessName;
                    data.industry = industry;
                    data.description = document.getElementById('business-description').value;
                    return true;
                }
                return false;
            case 4:
                data.primaryColor = document.getElementById('primary-color').value;
                data.accentColor = document.getElementById('accent-color').value;
                return true;
            case 5:
                const email = document.getElementById('contact-email').value;
                const phone = document.getElementById('contact-phone').value;
                if (email && phone) {
                    data.email = email;
                    data.phone = phone;
                    return true;
                }
                return false;
            default:
                return true;
        }
    }

    updateWizardStep(wizard, currentStep, totalSteps) {
        // Update progress
        const progressFill = wizard.querySelector('.progress-fill');
        const progressText = wizard.querySelector('.progress-text');
        const progress = (currentStep / totalSteps) * 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;

        // Update steps
        wizard.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        // Update buttons
        const prevBtn = wizard.querySelector('#wizard-prev');
        const nextBtn = wizard.querySelector('#wizard-next');
        
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.textContent = currentStep === totalSteps ? 'Submit Project' : 'Next';

        // Update summary on last step
        if (currentStep === 5) {
            this.updateWizardSummary(wizard);
        }
    }

    updateWizardSummary(wizard) {
        const data = this.getWizardData();
        wizard.querySelector('#summary-type').textContent = data.projectType || 'Not selected';
        wizard.querySelector('#summary-budget').textContent = data.budget || 'Not selected';
        wizard.querySelector('#summary-business').textContent = data.businessName || 'Not provided';
        wizard.querySelector('#summary-industry').textContent = data.industry || 'Not selected';
    }

    getWizardData() {
        return {
            projectType: document.querySelector('.option-card.selected')?.dataset.value,
            budget: document.querySelector('.budget-card.selected')?.dataset.value,
            businessName: document.getElementById('business-name')?.value,
            industry: document.getElementById('business-industry')?.value,
            description: document.getElementById('business-description')?.value,
            primaryColor: document.getElementById('primary-color')?.value,
            accentColor: document.getElementById('accent-color')?.value,
            email: document.getElementById('contact-email')?.value,
            phone: document.getElementById('contact-phone')?.value
        };
    }

    submitOnboarding(data) {
        // Create new project
        const project = {
            id: 'proj_' + Date.now(),
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString(),
            timeline: this.generateProjectTimeline(data.projectType),
            estimatedCost: this.calculateProjectCost(data.budget)
        };

        this.projects.push(project);
        localStorage.setItem('mediabay_projects', JSON.stringify(this.projects));

        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Project submitted successfully! We\'ll be in touch soon.', 'success');
        }

        // Close wizard
        document.querySelector('.onboarding-wizard').remove();

        // Redirect to user portal
        setTimeout(() => {
            window.location.hash = '#user-portal';
        }, 2000);
    }

    generateProjectTimeline(projectType) {
        const baseTimeline = [
            { phase: 'Discovery & Planning', duration: '1-2 weeks', status: 'pending' },
            { phase: 'Design & Mockups', duration: '2-3 weeks', status: 'pending' },
            { phase: 'Development', duration: '3-4 weeks', status: 'pending' },
            { phase: 'Testing & Review', duration: '1 week', status: 'pending' },
            { phase: 'Launch & Deployment', duration: '1 week', status: 'pending' }
        ];

        if (projectType === 'ecommerce') {
            baseTimeline.splice(3, 0, { phase: 'E-commerce Integration', duration: '1-2 weeks', status: 'pending' });
        }

        return baseTimeline;
    }

    calculateProjectCost(budgetRange) {
        const ranges = {
            '2500-5000': { min: 2500, max: 5000 },
            '5000-15000': { min: 5000, max: 15000 },
            '15000-50000': { min: 15000, max: 50000 },
            '50000+': { min: 50000, max: 100000 }
        };

        const range = ranges[budgetRange];
        if (range) {
            return Math.floor((range.min + range.max) / 2);
        }
        return 0;
    }

    // Project Dashboard
    initializeProjectDashboard() {
        this.updateProjectDashboard();
        
        // Update dashboard every 30 seconds
        setInterval(() => {
            this.updateProjectDashboard();
        }, 30000);
    }

    updateProjectDashboard() {
        const dashboardContent = document.getElementById('dashboard-content');
        if (!dashboardContent) return;

        const projects = this.projects;
        const activeProjects = projects.filter(p => p.status !== 'completed');
        const completedProjects = projects.filter(p => p.status === 'completed');

        dashboardContent.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number">${activeProjects.length}</div>
                    <div class="stat-label">Active Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${completedProjects.length}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">R${projects.reduce((sum, p) => sum + (p.estimatedCost || 0), 0).toLocaleString()}</div>
                    <div class="stat-label">Total Value</div>
                </div>
            </div>
            
            <div class="projects-section">
                <div class="section-header">
                    <h3>Your Projects</h3>
                    <button class="btn-primary" onclick="startOnboarding()">New Project</button>
                </div>
                
                <div class="projects-grid">
                    ${projects.length > 0 ? projects.map(project => this.renderProjectCard(project)).join('') : 
                      '<div class="empty-state">No projects yet. <a href="#" onclick="startOnboarding()">Start your first project</a></div>'}
                </div>
            </div>
        `;
    }

    renderProjectCard(project) {
        const progress = this.calculateProjectProgress(project);
        const statusClass = project.status.replace(' ', '-');
        
        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h4>${project.businessName || 'Unnamed Project'}</h4>
                    <span class="project-status status-${statusClass}">${project.status}</span>
                </div>
                
                <div class="project-details">
                    <div class="project-info">
                        <div class="label">Type</div>
                        <div class="value">${project.projectType}</div>
                    </div>
                    <div class="project-info">
                        <div class="label">Budget</div>
                        <div class="value">${project.budget}</div>
                    </div>
                    <div class="project-info">
                        <div class="label">Started</div>
                        <div class="value">${new Date(project.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                
                <div class="project-progress">
                    <div class="progress-label">Progress: ${progress}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="btn-secondary" onclick="viewProject('${project.id}')">View Details</button>
                    <button class="btn-primary" onclick="contactAboutProject('${project.id}')">Contact</button>
                </div>
            </div>
        `;
    }

    calculateProjectProgress(project) {
        if (!project.timeline) return 0;
        
        const completedPhases = project.timeline.filter(phase => phase.status === 'completed').length;
        return Math.round((completedPhases / project.timeline.length) * 100);
    }

    // Notification System
    initializeNotificationSystem() {
        this.createNotificationContainer();
        this.setupPushNotifications();
        this.loadStoredNotifications();
        
        // Global notification function
        window.showNotification = (message, type = 'info', duration = 5000) => {
            this.showNotification(message, type, duration);
        };
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.getElementById('notification-container').appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        // Store notification
        this.storeNotification(message, type);
    }

    storeNotification(message, type) {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        
        localStorage.setItem('mediabay_notifications', JSON.stringify(this.notifications));
        
        this.updateNotificationBadge();
    }

    loadStoredNotifications() {
        const stored = localStorage.getItem('mediabay_notifications');
        if (stored) {
            this.notifications = JSON.parse(stored);
            this.updateNotificationBadge();
        }
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Request permission
            if (Notification.permission === 'default') {
                setTimeout(() => {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            this.showNotification('Push notifications enabled!', 'success');
                        }
                    });
                }, 10000); // Ask after 10 seconds
            }
        }
    }

    sendPushNotification(title, body, icon = '/assets/images/logo.jpeg') {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon,
                badge: icon,
                tag: 'mediabay-notification'
            });
        }
    }

    // User Preferences
    loadUserPreferences() {
        const stored = localStorage.getItem('mediabay_preferences');
        return stored ? JSON.parse(stored) : {
            theme: 'auto',
            language: 'en',
            notifications: true,
            emailUpdates: true,
            marketingEmails: false
        };
    }

    saveUserPreferences() {
        localStorage.setItem('mediabay_preferences', JSON.stringify(this.userPreferences));
    }

    // Newsletter Integration
    initializeNewsletterIntegration() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(form);
            });
        });
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        this.showNotification('Subscribing...', 'info', 1000);
        
        setTimeout(() => {
            // Store subscription
            const subscriptions = JSON.parse(localStorage.getItem('mediabay_subscriptions') || '[]');
            subscriptions.push({
                email,
                timestamp: new Date().toISOString(),
                source: 'website'
            });
            localStorage.setItem('mediabay_subscriptions', JSON.stringify(subscriptions));
            
            this.showNotification('Successfully subscribed to our newsletter!', 'success');
            form.reset();
        }, 2000);
    }

    // Feedback System
    initializeFeedbackSystem() {
        this.createFeedbackWidget();
        this.loadFeedbackHistory();
    }

    createFeedbackWidget() {
        const widget = document.createElement('div');
        widget.className = 'feedback-widget';
        widget.innerHTML = `
            <button class="feedback-trigger" onclick="this.nextElementSibling.classList.toggle('show')">
                💬 Feedback
            </button>
            <div class="feedback-panel">
                <div class="feedback-header">
                    <h4>How are we doing?</h4>
                    <button class="feedback-close" onclick="this.closest('.feedback-panel').classList.remove('show')">×</button>
                </div>
                <div class="feedback-content">
                    <div class="rating-section">
                        <div class="rating-stars">
                            ${[1,2,3,4,5].map(i => `<span class="star" data-rating="${i}">⭐</span>`).join('')}
                        </div>
                        <div class="rating-text">Rate your experience</div>
                    </div>
                    <textarea placeholder="Tell us what you think..." rows="3"></textarea>
                    <button class="btn-primary" onclick="submitFeedback(this.closest('.feedback-panel'))">Submit Feedback</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Setup star rating
        widget.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                const rating = parseInt(e.target.dataset.rating);
                const stars = widget.querySelectorAll('.star');
                
                stars.forEach((star, index) => {
                    star.style.opacity = index < rating ? '1' : '0.3';
                });
                
                widget.dataset.rating = rating;
            }
        });
        
        // Global submit function
        window.submitFeedback = (panel) => {
            const rating = parseInt(panel.closest('.feedback-widget').dataset.rating || '0');
            const comment = panel.querySelector('textarea').value;
            
            if (rating === 0) {
                this.showNotification('Please select a rating', 'warning');
                return;
            }
            
            this.storeFeedback(rating, comment);
            panel.classList.remove('show');
            panel.querySelector('textarea').value = '';
            this.showNotification('Thank you for your feedback!', 'success');
        };
    }

    storeFeedback(rating, comment) {
        const feedback = {
            id: Date.now(),
            rating,
            comment,
            timestamp: new Date().toISOString(),
            page: window.location.pathname + window.location.hash
        };
        
        const feedbackHistory = JSON.parse(localStorage.getItem('mediabay_feedback') || '[]');
        feedbackHistory.push(feedback);
        localStorage.setItem('mediabay_feedback', JSON.stringify(feedbackHistory));
    }

    loadFeedbackHistory() {
        const stored = localStorage.getItem('mediabay_feedback');
        return stored ? JSON.parse(stored) : [];
    }

    // Language Selector
    initializeLanguageSelector() {
        window.changeLanguage = (lang) => {
            this.currentLanguage = lang;
            localStorage.setItem('mediabay_language', lang);
            this.applyLanguage(lang);
            this.showNotification(`Language changed to ${this.getLanguageName(lang)}`, 'success');
        };
        
        // Apply saved language
        this.applyLanguage(this.currentLanguage);
    }

    getLanguageName(code) {
        const names = {
            'en': 'English',
            'af': 'Afrikaans',
            'fr': 'Français',
            'de': 'Deutsch'
        };
        return names[code] || 'English';
    }

    applyLanguage(lang) {
        // This would typically load translation files
        // For now, we'll just update the selector
        const selector = document.getElementById('language-select');
        if (selector) {
            selector.value = lang;
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    // Location Finder
    initializeLocationFinder() {
        const mapContainer = document.getElementById('location-map');
        if (mapContainer) {
            this.loadGoogleMaps();
        }
    }

    loadGoogleMaps() {
        // Load Google Maps API
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
        script.async = true;
        script.defer = true;
        
        window.initMap = () => {
            const capeTown = { lat: -33.9249, lng: 18.4241 };
            const map = new google.maps.Map(document.getElementById('location-map'), {
                zoom: 12,
                center: capeTown,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#132541' }]
                    }
                ]
            });
            
            new google.maps.Marker({
                position: capeTown,
                map: map,
                title: 'MediaBay Office',
                icon: {
                    url: 'assets/images/logo.jpeg',
                    scaledSize: new google.maps.Size(40, 40)
                }
            });
        };
        
        document.head.appendChild(script);
    }

    // Calendar Integration
    initializeCalendarIntegration() {
        window.scheduleConsultation = () => {
            this.showCalendarModal();
        };
    }

    showCalendarModal() {
        const modal = document.createElement('div');
        modal.className = 'calendar-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Schedule a Consultation</h3>
                    <button class="modal-close" onclick="this.closest('.calendar-modal').remove()">×</button>
                </div>
                <div class="calendar-content">
                    <div class="calendar-grid">
                        ${this.generateCalendarDays()}
                    </div>
                    <div class="time-slots">
                        <h4>Available Times</h4>
                        <div class="time-grid">
                            ${this.generateTimeSlots()}
                        </div>
                    </div>
                    <div class="consultation-form">
                        <input type="text" placeholder="Your Name" id="consultation-name">
                        <input type="email" placeholder="Your Email" id="consultation-email">
                        <textarea placeholder="What would you like to discuss?" id="consultation-notes"></textarea>
                        <button class="btn-primary" onclick="bookConsultation()">Book Consultation</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        window.bookConsultation = () => {
            const selectedDate = modal.querySelector('.calendar-day.selected')?.dataset.date;
            const selectedTime = modal.querySelector('.time-slot.selected')?.dataset.time;
            const name = modal.querySelector('#consultation-name').value;
            const email = modal.querySelector('#consultation-email').value;
            const notes = modal.querySelector('#consultation-notes').value;
            
            if (!selectedDate || !selectedTime || !name || !email) {
                this.showNotification('Please fill in all required fields', 'warning');
                return;
            }
            
            const consultation = {
                id: Date.now(),
                date: selectedDate,
                time: selectedTime,
                name,
                email,
                notes,
                status: 'pending'
            };
            
            const consultations = JSON.parse(localStorage.getItem('mediabay_consultations') || '[]');
            consultations.push(consultation);
            localStorage.setItem('mediabay_consultations', JSON.stringify(consultations));
            
            this.showNotification('Consultation booked successfully! We\'ll send you a confirmation email.', 'success');
            modal.remove();
        };
    }

    generateCalendarDays() {
        const today = new Date();
        const days = [];
        
        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            const dayNumber = date.getDate();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            days.push(`
                <div class="calendar-day ${isWeekend ? 'weekend' : ''}" 
                     data-date="${date.toISOString().split('T')[0]}"
                     onclick="selectCalendarDay(this)">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number">${dayNumber}</div>
                </div>
            `);
        }
        
        return days.join('');
    }

    generateTimeSlots() {
        const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        return slots.map(time => `
            <div class="time-slot" data-time="${time}" onclick="selectTimeSlot(this)">
                ${time}
            </div>
        `).join('');
    }

    // Payment Gateway Integration
    initializePaymentGateway() {
        this.setupPaymentMethods();
        this.initializeInvoiceSystem();
    }

    setupPaymentMethods() {
        // PayFast integration
        window.processPayFastPayment = (amount, description) => {
            const paymentData = {
                merchant_id: 'YOUR_PAYFAST_MERCHANT_ID',
                merchant_key: 'YOUR_PAYFAST_MERCHANT_KEY',
                amount: amount,
                item_name: description,
                return_url: window.location.origin + '/payment-success',
                cancel_url: window.location.origin + '/payment-cancel',
                notify_url: window.location.origin + '/payment-notify'
            };
            
            // Create PayFast form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://www.payfast.co.za/eng/process';
            
            Object.keys(paymentData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = paymentData[key];
                form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
        };
        
        // Yoco integration
        window.processYocoPayment = (amount, description) => {
            // This would integrate with Yoco's JavaScript SDK
            this.showNotification('Redirecting to Yoco payment...', 'info');
            
            setTimeout(() => {
                // Simulate payment process
                this.showNotification('Payment processed successfully!', 'success');
            }, 3000);
        };
    }

    initializeInvoiceSystem() {
        window.generateInvoice = (projectId) => {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) return;
            
            const invoice = {
                id: 'INV-' + Date.now(),
                projectId,
                amount: project.estimatedCost,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                items: [
                    {
                        description: `${project.projectType} website development`,
                        quantity: 1,
                        rate: project.estimatedCost,
                        amount: project.estimatedCost
                    }
                ]
            };
            
            this.downloadInvoicePDF(invoice, project);
        };
    }

    downloadInvoicePDF(invoice, project) {
        // This would generate a PDF invoice
        // For now, we'll create a simple HTML version
        const invoiceHTML = this.generateInvoiceHTML(invoice, project);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
    }

    generateInvoiceHTML(invoice, project) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoice.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .logo { font-size: 24px; font-weight: bold; color: #132541; }
                    .invoice-details { text-align: right; }
                    .client-details { margin-bottom: 40px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">MediaBay</div>
                    <div class="invoice-details">
                        <h2>Invoice ${invoice.id}</h2>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                        <p>Due: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="client-details">
                    <h3>Bill To:</h3>
                    <p>${project.businessName}</p>
                    <p>${project.email}</p>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>R${item.rate.toLocaleString()}</td>
                                <td>R${item.amount.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    Total: R${invoice.amount.toLocaleString()}
                </div>
            </body>
            </html>
        `;
    }

    // Advanced Pricing Calculator
    initializeAdvancedPricing() {
        const calculator = document.getElementById('advanced-calculator');
        if (!calculator) return;
        
        this.setupPricingLogic();
        this.loadPricingData();
    }

    setupPricingLogic() {
        // Base pricing structure
        this.pricingMatrix = {
            pages: {
                '1-3': { base: 2500, multiplier: 1 },
                '4-6': { base: 4000, multiplier: 1.2 },
                '7-10': { base: 6000, multiplier: 1.4 },
                '11+': { base: 8000, multiplier: 1.6 }
            },
            features: {
                'contact-form': 500,
                'blog': 1500,
                'ecommerce': 8000,
                'booking-system': 3000,
                'user-accounts': 2500,
                'payment-gateway': 2000,
                'cms': 1500,
                'seo-optimization': 1000,
                'analytics': 500,
                'social-media': 300,
                'multilingual': 2000,
                'api-integration': 3000
            },
            design: {
                'template': 0,
                'custom': 2000,
                'premium': 5000
            },
            timeline: {
                'standard': 1,
                'rush': 1.5,
                'express': 2
            }
        };
        
        // Update pricing when inputs change
        document.addEventListener('change', (e) => {
            if (e.target.closest('#advanced-calculator')) {
                this.updatePricing();
            }
        });
    }

    updatePricing() {
        const calculator = document.getElementById('advanced-calculator');
        if (!calculator) return;
        
        let totalPrice = 0;
        
        // Pages
        const pages = calculator.querySelector('select[name="pages"]')?.value;
        if (pages && this.pricingMatrix.pages[pages]) {
            totalPrice += this.pricingMatrix.pages[pages].base;
        }
        
        // Features
        const features = calculator.querySelectorAll('input[name="features"]:checked');
        features.forEach(feature => {
            const cost = this.pricingMatrix.features[feature.value];
            if (cost) totalPrice += cost;
        });
        
        // Design
        const design = calculator.querySelector('input[name="design"]:checked')?.value;
        if (design && this.pricingMatrix.design[design]) {
            totalPrice += this.pricingMatrix.design[design];
        }
        
        // Timeline multiplier
        const timeline = calculator.querySelector('input[name="timeline"]:checked')?.value;
        if (timeline && this.pricingMatrix.timeline[timeline]) {
            totalPrice *= this.pricingMatrix.timeline[timeline];
        }
        
        // Update display
        const priceDisplay = calculator.querySelector('.price-display');
        if (priceDisplay) {
            priceDisplay.innerHTML = `
                <div class="estimated-price">
                    <div class="price-label">Estimated Cost</div>
                    <div class="price-amount">R${Math.round(totalPrice).toLocaleString()}</div>
                    <div class="price-note">*Final price may vary based on specific requirements</div>
                </div>
            `;
        }
        
        // Store calculation
        this.storeCalculation({
            pages,
            features: Array.from(features).map(f => f.value),
            design,
            timeline,
            totalPrice: Math.round(totalPrice),
            timestamp: new Date().toISOString()
        });
    }

    storeCalculation(calculation) {
        const calculations = JSON.parse(localStorage.getItem('mediabay_calculations') || '[]');
        calculations.unshift(calculation);
        
        // Keep only last 10 calculations
        if (calculations.length > 10) {
            calculations.splice(10);
        }
        
        localStorage.setItem('mediabay_calculations', JSON.stringify(calculations));
    }

    loadPricingData() {
        // Load saved calculations for comparison
        const calculations = JSON.parse(localStorage.getItem('mediabay_calculations') || '[]');
        
        if (calculations.length > 0) {
            const lastCalculation = calculations[0];
            this.showNotification(`Your last estimate was R${lastCalculation.totalPrice.toLocaleString()}`, 'info', 3000);
        }
    }

    // Analytics Integration
    initializeAnalytics() {
        this.trackPageView();
        this.setupEventTracking();
        this.setupConversionTracking();
        this.setupHeatmapTracking();
    }

    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                    'dimension1': 'user_type',
                    'dimension2': 'ab_test_variant'
                }
            });
        }
        
        // Track custom events
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            user_type: this.getUserType(),
            ab_test_variant: this.getActiveABTests()
        });
    }

    setupEventTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn-primary, .btn-secondary, a[href^="#"]')) {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent.trim(),
                    button_type: e.target.className,
                    page_section: this.getPageSection(e.target)
                });
            }
        });
        
        // Track form interactions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.trackEvent('form_submit', {
                form_id: form.id || 'unknown',
                form_type: this.getFormType(form),
                page_section: this.getPageSection(form)
            });
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', this.debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    this.trackEvent('scroll_depth', {
                        percent: maxScroll,
                        page_title: document.title
                    });
                }
            }
        }, 1000));
    }

    setupConversionTracking() {
        // Track quote requests
        document.addEventListener('quote_requested', (e) => {
            this.trackEvent('conversion', {
                type: 'quote_request',
                value: e.detail.estimatedValue || 0,
                currency: 'ZAR'
            });
        });
        
        // Track consultation bookings
        document.addEventListener('consultation_booked', (e) => {
            this.trackEvent('conversion', {
                type: 'consultation_booking',
                value: 500, // Estimated value of consultation
                currency: 'ZAR'
            });
        });
        
        // Track project submissions
        document.addEventListener('project_submitted', (e) => {
            this.trackEvent('conversion', {
                type: 'project_submission',
                value: e.detail.projectValue || 0,
                currency: 'ZAR'
            });
        });
    }

    setupHeatmapTracking() {
        // Simple heatmap tracking
        let clickData = JSON.parse(localStorage.getItem('mediabay_heatmap') || '[]');
        
        document.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const clickPoint = {
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now(),
                page: window.location.pathname + window.location.hash
            };
            
            clickData.push(clickPoint);
            
            // Keep only last 1000 clicks
            if (clickData.length > 1000) {
                clickData = clickData.slice(-1000);
            }
            
            localStorage.setItem('mediabay_heatmap', JSON.stringify(clickData));
        });
    }

    trackEvent(eventName, parameters) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Custom analytics
        const event = {
            name: eventName,
            parameters,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            user_id: this.getUserId()
        };
        
        // Store locally
        const events = JSON.parse(localStorage.getItem('mediabay_events') || '[]');
        events.push(event);
        
        // Keep only last 500 events
        if (events.length > 500) {
            events.splice(0, events.length - 500);
        }
        
        localStorage.setItem('mediabay_events', JSON.stringify(events));
        
        // Send to server (if available)
        this.sendAnalyticsData(event);
    }

    sendAnalyticsData(event) {
        // This would send data to your analytics server
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        }).catch(() => {
            // Fail silently for analytics
        });
    }

    getUserType() {
        const user = JSON.parse(localStorage.getItem('mediabay_user') || 'null');
        return user ? 'registered' : 'anonymous';
    }

    getActiveABTests() {
        return Object.keys(this.abTests).map(test => 
            `${test}:${this.getABTestVariant(test)}`
        ).join(',');
    }

    getPageSection(element) {
        const section = element.closest('section');
        return section ? section.id : 'unknown';
    }

    getFormType(form) {
        if (form.classList.contains('contact-form')) return 'contact';
        if (form.classList.contains('auth-form')) return 'authentication';
        if (form.classList.contains('payment-form')) return 'payment';
        if (form.classList.contains('newsletter-form')) return 'newsletter';
        return 'other';
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('mediabay_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('mediabay_session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        let userId = localStorage.getItem('mediabay_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('mediabay_user_id', userId);
        }
        return userId;
    }

    // Utility Functions
    debounce(func, wait) {
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

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    formatCurrency(amount, currency = 'ZAR') {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Auto-Save System
    initializeAutoSave() {
        const autoSaveForms = document.querySelectorAll('form[data-autosave]');
        
        autoSaveForms.forEach(form => {
            const formId = form.id || 'form_' + Date.now();
            const inputs = form.querySelectorAll('input, textarea, select');
            
            // Load saved data
            this.loadAutoSavedData(formId, inputs);
            
            // Save on input
            inputs.forEach(input => {
                input.addEventListener('input', this.debounce(() => {
                    this.saveFormData(formId, form);
                }, 1000));
            });
            
            // Show auto-save indicator
            this.createAutoSaveIndicator(form);
        });
    }

    saveFormData(formId, form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'honeypot' && key !== 'csrf_token') {
                data[key] = value;
            }
        }
        
        localStorage.setItem(`mediabay_autosave_${formId}`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        this.showAutoSaveIndicator(form, 'saved');
    }

    loadAutoSavedData(formId, inputs) {
        const saved = localStorage.getItem(`mediabay_autosave_${formId}`);
        if (saved) {
            try {
                const { data, timestamp } = JSON.parse(saved);
                
                // Only load if saved within last 24 hours
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    inputs.forEach(input => {
                        if (data[input.name]) {
                            input.value = data[input.name];
                        }
                    });
                    
                    this.showAutoSaveNotification(formId);
                }
            } catch (error) {
                console.error('Error loading auto-saved data:', error);
            }
        }
    }

    createAutoSaveIndicator(form) {
        const indicator = document.createElement('div');
        indicator.className = 'autosave-indicator';
        indicator.innerHTML = '💾 Auto-saved';
        indicator.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: var(--success);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        form.style.position = 'relative';
        form.appendChild(indicator);
    }

    showAutoSaveIndicator(form, status) {
        const indicator = form.querySelector('.autosave-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 2000);
        }
    }

    showAutoSaveNotification(formId) {
        this.showNotification('We\'ve restored your previous input', 'info', 3000);
    }

    // AI Form Suggestions
    initializeAIFormSuggestions() {
        const textInputs = document.querySelectorAll('textarea, input[type="text"]');
        
        textInputs.forEach(input => {
            input.addEventListener('input', this.debounce((e) => {
                const text = e.target.value;
                if (text.length > 20) {
                    const suggestions = this.generateAISuggestions(text, e.target);
                    if (suggestions.length > 0) {
                        this.showAISuggestions(e.target, suggestions);
                    }
                }
            }, 2000));
        });
    }

    generateAISuggestions(text, field) {
        const suggestions = [];
        const lowerText = text.toLowerCase();
        
        // Project description suggestions
        if (field.name === 'description' || field.placeholder?.includes('describe')) {
            if (lowerText.includes('ecommerce') || lowerText.includes('shop') || lowerText.includes('store')) {
                suggestions.push('Consider adding: Product catalog, Shopping cart, Payment gateway, Inventory management');
                suggestions.push('Recommended features: Customer reviews, Wishlist, Order tracking, Multi-currency support');
            }
            
            if (lowerText.includes('business') || lowerText.includes('corporate')) {
                suggestions.push('Consider adding: Contact forms, Team profiles, Service pages, Client testimonials');
                suggestions.push('Recommended features: Blog section, Newsletter signup, Social media integration');
            }
            
            if (lowerText.includes('portfolio') || lowerText.includes('gallery')) {
                suggestions.push('Consider adding: Image galleries, Project showcases, Client testimonials, Contact forms');
                suggestions.push('Recommended features: Lightbox galleries, Category filtering, Social sharing');
            }
            
            if (lowerText.includes('restaurant') || lowerText.includes('food')) {
                suggestions.push('Consider adding: Online menu, Reservation system, Location map, Photo gallery');
                suggestions.push('Recommended features: Online ordering, Delivery integration, Customer reviews');
            }
        }
        
        // Budget suggestions
        if (field.name === 'budget' || lowerText.includes('budget')) {
            suggestions.push('Tip: Basic websites start from R2,500, e-commerce from R15,000');
            suggestions.push('Consider: Monthly payment plans available for larger projects');
        }
        
        // Timeline suggestions
        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('quickly')) {
            suggestions.push('Rush delivery available with 50% surcharge');
            suggestions.push('Standard timeline: 4-6 weeks, Rush: 2-3 weeks');
        }
        
        return suggestions;
    }

    showAISuggestions(field, suggestions) {
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.ai-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'ai-suggestions';
        suggestionsContainer.innerHTML = `
            <div class="suggestions-header">
                <span class="ai-icon">🤖</span>
                <span>AI Suggestions</span>
                <button class="suggestions-close" onclick="this.closest('.ai-suggestions').remove()">×</button>
            </div>
            <div class="suggestions-list">
                ${suggestions.map((suggestion, index) => `
                    <div class="suggestion-item" onclick="applySuggestion('${suggestion.replace(/'/g, "\\'")}', '${field.name}')">
                        <span class="suggestion-icon">💡</span>
                        <span class="suggestion-text">${suggestion}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Position suggestions
        const rect = field.getBoundingClientRect();
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: ${rect.bottom + window.scrollY + 5}px;
            left: ${rect.left + window.scrollX}px;
            width: ${Math.max(300, rect.width)}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;
        
        document.body.appendChild(suggestionsContainer);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (suggestionsContainer.parentNode) {
                suggestionsContainer.remove();
            }
        }, 15000);
        
        // Global apply function
        window.applySuggestion = (suggestion, fieldName) => {
            const targetField = document.querySelector(`[name="${fieldName}"]`);
            if (targetField) {
                const currentValue = targetField.value;
                const newValue = currentValue + (currentValue ? '\n\n' : '') + suggestion;
                targetField.value = newValue;
                targetField.focus();
                
                // Trigger input event for auto-save
                targetField.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            suggestionsContainer.remove();
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mediaBaySmartSystems = new MediaBaySmartSystems();
});

// Global utility functions
window.selectCalendarDay = function(dayElement) {
    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
    dayElement.classList.add('selected');
};

window.selectTimeSlot = function(slotElement) {
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    slotElement.classList.add('selected');
};

window.viewProject = function(projectId) {
    const project = JSON.parse(localStorage.getItem('mediabay_projects') || '[]')
        .find(p => p.id === projectId);
    
    if (project) {
        // Show project details modal
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${project.businessName} - Project Details</h3>
                    <button class="modal-close" onclick="this.closest('.project-modal').remove()">×</button>
                </div>
                <div class="project-details-content">
                    <div class="detail-section">
                        <h4>Project Information</h4>
                        <p><strong>Type:</strong> ${project.projectType}</p>
                        <p><strong>Budget:</strong> ${project.budget}</p>
                        <p><strong>Industry:</strong> ${project.industry}</p>
                        <p><strong>Status:</strong> ${project.status}</p>
                        <p><strong>Created:</strong> ${new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Description</h4>
                        <p>${project.description || 'No description provided'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Timeline</h4>
                        <div class="timeline-list">
                            ${project.timeline ? project.timeline.map(phase => `
                                <div class="timeline-phase ${phase.status}">
                                    <span class="phase-name">${phase.phase}</span>
                                    <span class="phase-duration">${phase.duration}</span>
                                    <span class="phase-status">${phase.status}</span>
                                </div>
                            `).join('') : 'Timeline not available'}
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="contactAboutProject('${projectId}')">Contact About Project</button>
                    <button class="btn-secondary" onclick="generateInvoice('${projectId}')">Generate Invoice</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
};

window.contactAboutProject = function(projectId) {
    const project = JSON.parse(localStorage.getItem('mediabay_projects') || '[]')
        .find(p => p.id === projectId);
    
    if (project) {
        // Pre-fill contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            const messageField = contactForm.querySelector('textarea[name="message"]');
            if (messageField) {
                messageField.value = `Hi, I'd like to discuss my project "${project.businessName}" (ID: ${projectId}). `;
            }
            
            // Scroll to contact section
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    }
};