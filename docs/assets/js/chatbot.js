// MediaBay Chatbot & Voice Assistant
class MediaBayChatbot {
    constructor() {
        this.isOpen = false;
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.responses = this.initializeResponses();
        this.conversationHistory = [];
        this.userPreferences = this.loadUserPreferences();
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.setupQuickActions();
        this.loadConversationHistory();
        
        console.log('MediaBay Chatbot initialized');
    }

    setupElements() {
        this.fab = document.getElementById('chatbot-fab');
        this.interface = document.getElementById('chatbot-interface');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.voiceBtn = document.getElementById('voice-btn');
        this.sendBtn = document.getElementById('send-btn');
    }

    setupEventListeners() {
        if (this.fab) {
            this.fab.addEventListener('click', () => this.toggleChatbot());
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeChatbot());
        }

        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            this.inputField.addEventListener('input', () => {
                this.handleTyping();
            });
        }

        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        }

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.interface.contains(e.target) && 
                !this.fab.contains(e.target)) {
                this.closeChatbot();
            }
        });
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.voiceBtn.innerHTML = '🔴';
                this.voiceBtn.style.background = '#dc3545';
                this.addMessage('Listening...', 'bot', true);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.inputField.value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.addMessage('Sorry, I couldn\'t hear you clearly. Please try again.', 'bot');
                this.resetVoiceButton();
            };

            this.recognition.onend = () => {
                this.resetVoiceButton();
            };
        } else {
            // Hide voice button if not supported
            if (this.voiceBtn) {
                this.voiceBtn.style.display = 'none';
            }
        }
    }

    initializeResponses() {
        return {
            greeting: [
                "Hello! I'm your MediaBay assistant. How can I help you today?",
                "Hi there! Welcome to MediaBay. What can I do for you?",
                "Greetings! I'm here to help with your web design needs."
            ],
            pricing: {
                general: "Our pricing varies based on your needs. A simple website starts from R2,500, business sites from R5,000, and e-commerce from R15,000. Would you like a detailed quote?",
                simple: "A simple 1-3 page website starts from R2,500. This includes basic design, mobile responsiveness, and contact forms.",
                business: "Business websites (3-10 pages) range from R5,000 to R15,000, including custom design, CMS integration, and SEO optimization.",
                ecommerce: "E-commerce solutions start from R15,000 and include product catalogs, payment integration, and inventory management.",
                custom: "Custom web applications start from R50,000+ depending on complexity. Let's discuss your specific requirements!"
            },
            services: {
                overview: "We offer comprehensive web services including UI/UX Design, E-commerce Solutions, SEO Optimization, Custom Web Applications, CMS Integration, and Website Maintenance.",
                design: "Our UI/UX design service creates beautiful, user-centered designs that engage visitors and convert them into customers.",
                ecommerce: "We build complete online stores with payment integration, inventory management, and mobile-optimized shopping experiences.",
                seo: "Our SEO services help boost your online visibility and rank higher in South African search results.",
                maintenance: "We provide ongoing website maintenance, security updates, and performance optimization to keep your site running smoothly."
            },
            location: {
                address: "We're based in Cape Town, South Africa. We serve clients locally and internationally.",
                contact: "You can reach us at mediabay3@gmail.com or through our contact form. We're available Mon-Fri 9AM-6PM, Sat 10AM-2PM.",
                meeting: "We'd love to meet! You can schedule a consultation through our contact form or by calling us directly."
            },
            process: {
                steps: "Our process includes: 1) Initial consultation, 2) Design mockups, 3) Development, 4) Testing & revisions, 5) Launch & training.",
                timeline: "Most projects take 2-6 weeks depending on complexity. We'll provide a detailed timeline during consultation.",
                revisions: "We include up to 3 rounds of revisions in all our packages to ensure you're completely satisfied."
            },
            portfolio: "We've completed 50+ projects for various industries including retail, technology, hospitality, and finance. Check out our portfolio section to see our work!",
            technology: "We use modern technologies including HTML5, CSS3, JavaScript, React, WordPress, and various e-commerce platforms to build fast, secure websites.",
            support: "We provide ongoing support and maintenance for all our websites. This includes security updates, backups, and technical assistance.",
            fallback: [
                "I'm not sure about that specific question. Let me connect you with our team for detailed assistance.",
                "That's a great question! Our team would be happy to provide more specific information. Please use our contact form.",
                "I'd recommend speaking directly with our experts about that. You can reach us through the contact section."
            ]
        };
    }

    setupQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.getAttribute('data-action');
                this.handleQuickAction(actionType);
            });
        });
    }

    handleQuickAction(actionType) {
        switch (actionType) {
            case 'pricing':
                this.addMessage('I\'d like to know about your pricing', 'user');
                setTimeout(() => {
                    this.addMessage(this.responses.pricing.general, 'bot');
                    this.showPricingOptions();
                }, 500);
                break;
                
            case 'services':
                this.addMessage('What services do you offer?', 'user');
                setTimeout(() => {
                    this.addMessage(this.responses.services.overview, 'bot');
                    this.showServiceOptions();
                }, 500);
                break;
                
            case 'meeting':
                this.addMessage('I\'d like to schedule a meeting', 'user');
                setTimeout(() => {
                    this.addMessage('Great! I\'ll help you schedule a consultation. Let me take you to our contact form.', 'bot');
                    this.scrollToContact();
                }, 500);
                break;
                
            case 'location':
                this.addMessage('Where are you located?', 'user');
                setTimeout(() => {
                    this.addMessage(this.responses.location.address, 'bot');
                    this.addMessage(this.responses.location.contact, 'bot');
                }, 500);
                break;
        }
    }

    showPricingOptions() {
        const options = document.createElement('div');
        options.className = 'pricing-options';
        options.innerHTML = `
            <div class="quick-actions">
                <button class="quick-action" onclick="mediaBayChatbot.handlePricingQuery('simple')">Simple Website</button>
                <button class="quick-action" onclick="mediaBayChatbot.handlePricingQuery('business')">Business Website</button>
                <button class="quick-action" onclick="mediaBayChatbot.handlePricingQuery('ecommerce')">E-commerce Store</button>
                <button class="quick-action" onclick="mediaBayChatbot.handlePricingQuery('custom')">Custom Application</button>
            </div>
        `;
        
        const botMessage = this.createMessageElement('Which type of website are you interested in?', 'bot');
        botMessage.querySelector('.message-content').appendChild(options);
        this.messagesContainer.appendChild(botMessage);
        this.scrollToBottom();
    }

    showServiceOptions() {
        const options = document.createElement('div');
        options.className = 'service-options';
        options.innerHTML = `
            <div class="quick-actions">
                <button class="quick-action" onclick="mediaBayChatbot.handleServiceQuery('design')">UI/UX Design</button>
                <button class="quick-action" onclick="mediaBayChatbot.handleServiceQuery('ecommerce')">E-commerce</button>
                <button class="quick-action" onclick="mediaBayChatbot.handleServiceQuery('seo')">SEO Services</button>
                <button class="quick-action" onclick="mediaBayChatbot.handleServiceQuery('maintenance')">Maintenance</button>
            </div>
        `;
        
        const botMessage = this.createMessageElement('Which service would you like to know more about?', 'bot');
        botMessage.querySelector('.message-content').appendChild(options);
        this.messagesContainer.appendChild(botMessage);
        this.scrollToBottom();
    }

    handlePricingQuery(type) {
        this.addMessage(`Tell me about ${type} website pricing`, 'user');
        setTimeout(() => {
            this.addMessage(this.responses.pricing[type], 'bot');
            
            if (type !== 'custom') {
                setTimeout(() => {
                    this.addMessage('Would you like to use our quote estimator to get a more accurate price?', 'bot');
                    this.showQuoteEstimatorOption();
                }, 1000);
            }
        }, 500);
    }

    handleServiceQuery(service) {
        this.addMessage(`Tell me about ${service} services`, 'user');
        setTimeout(() => {
            this.addMessage(this.responses.services[service], 'bot');
        }, 500);
    }

    showQuoteEstimatorOption() {
        const option = document.createElement('div');
        option.className = 'estimator-option';
        option.innerHTML = `
            <div class="quick-actions">
                <button class="quick-action" onclick="mediaBayChatbot.goToEstimator()">Use Quote Estimator</button>
                <button class="quick-action" onclick="mediaBayChatbot.contactForQuote()">Contact for Custom Quote</button>
            </div>
        `;
        
        const botMessage = this.createMessageElement('', 'bot');
        botMessage.querySelector('.message-content').appendChild(option);
        this.messagesContainer.appendChild(botMessage);
        this.scrollToBottom();
    }

    goToEstimator() {
        this.addMessage('Take me to the quote estimator', 'user');
        setTimeout(() => {
            this.addMessage('Perfect! I\'ll take you to our quote estimator where you can get an instant price estimate.', 'bot');
            this.closeChatbot();
            setTimeout(() => {
                document.getElementById('quote-estimator').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }, 500);
    }

    contactForQuote() {
        this.addMessage('I\'d like a custom quote', 'user');
        setTimeout(() => {
            this.addMessage('Excellent! Let me take you to our contact form where you can provide details about your project.', 'bot');
            this.scrollToContact();
        }, 500);
    }

    scrollToContact() {
        this.closeChatbot();
        setTimeout(() => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.isOpen = true;
        this.interface.classList.add('open');
        this.fab.style.display = 'none';
        
        // Focus on input field
        setTimeout(() => {
            if (this.inputField) {
                this.inputField.focus();
            }
        }, 300);
        
        // Add welcome message if first time
        if (this.messagesContainer.children.length <= 1) {
            setTimeout(() => {
                this.addMessage(this.getRandomResponse(this.responses.greeting), 'bot');
            }, 500);
        }
    }

    closeChatbot() {
        this.isOpen = false;
        this.interface.classList.remove('open');
        this.fab.style.display = 'flex';
        
        // Stop voice recognition if active
        if (this.isListening && this.recognition) {
            this.recognition.stop();
        }
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.addMessage('Voice recognition is not supported in your browser.', 'bot');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    resetVoiceButton() {
        this.isListening = false;
        this.voiceBtn.innerHTML = '🎤';
        this.voiceBtn.style.background = '#E87A64';
        
        // Remove temporary listening message
        const messages = this.messagesContainer.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.classList.contains('temp-message')) {
            lastMessage.remove();
        }
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.inputField.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(message);
            this.addMessage(response, 'bot');
            
            // Speak response if synthesis is available
            this.speakResponse(response);
        }, 1000 + Math.random() * 1000);
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting patterns
        if (this.matchesPattern(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
            return this.getRandomResponse(this.responses.greeting);
        }
        
        // Pricing patterns
        if (this.matchesPattern(lowerMessage, ['price', 'cost', 'pricing', 'how much', 'quote', 'estimate'])) {
            if (this.matchesPattern(lowerMessage, ['simple', 'basic', 'small'])) {
                return this.responses.pricing.simple;
            } else if (this.matchesPattern(lowerMessage, ['business', 'company', 'corporate'])) {
                return this.responses.pricing.business;
            } else if (this.matchesPattern(lowerMessage, ['ecommerce', 'e-commerce', 'shop', 'store', 'online store'])) {
                return this.responses.pricing.ecommerce;
            } else if (this.matchesPattern(lowerMessage, ['custom', 'complex', 'application', 'app'])) {
                return this.responses.pricing.custom;
            }
            return this.responses.pricing.general;
        }
        
        // Services patterns
        if (this.matchesPattern(lowerMessage, ['service', 'what do you do', 'what can you do', 'offerings'])) {
            return this.responses.services.overview;
        }
        
        // Location patterns
        if (this.matchesPattern(lowerMessage, ['where', 'location', 'address', 'based', 'office'])) {
            return this.responses.location.address + ' ' + this.responses.location.contact;
        }
        
        // Meeting/Contact patterns
        if (this.matchesPattern(lowerMessage, ['meeting', 'consultation', 'contact', 'call', 'schedule'])) {
            setTimeout(() => {
                this.addMessage('I can help you get in touch with our team. Let me take you to our contact form.', 'bot');
                this.scrollToContact();
            }, 1000);
            return 'I\'d be happy to help you schedule a consultation!';
        }
        
        // Portfolio patterns
        if (this.matchesPattern(lowerMessage, ['portfolio', 'work', 'examples', 'projects', 'previous work'])) {
            return this.responses.portfolio;
        }
        
        // Technology patterns
        if (this.matchesPattern(lowerMessage, ['technology', 'tech', 'platform', 'cms', 'wordpress', 'react'])) {
            return this.responses.technology;
        }
        
        // Support patterns
        if (this.matchesPattern(lowerMessage, ['support', 'maintenance', 'help', 'assistance', 'after launch'])) {
            return this.responses.support;
        }
        
        // Process patterns
        if (this.matchesPattern(lowerMessage, ['process', 'how do you work', 'steps', 'timeline', 'how long'])) {
            if (this.matchesPattern(lowerMessage, ['timeline', 'how long', 'time', 'duration'])) {
                return this.responses.process.timeline;
            }
            return this.responses.process.steps;
        }
        
        // Thank you patterns
        if (this.matchesPattern(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Goodbye patterns
        if (this.matchesPattern(lowerMessage, ['bye', 'goodbye', 'see you', 'talk later'])) {
            return "Goodbye! Feel free to reach out anytime. Have a great day!";
        }
        
        // Default fallback
        return this.getRandomResponse(this.responses.fallback);
    }

    matchesPattern(message, patterns) {
        return patterns.some(pattern => message.includes(pattern));
    }

    getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    addMessage(text, sender, isTemp = false) {
        const messageElement = this.createMessageElement(text, sender, isTemp);
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Save to conversation history
        if (!isTemp) {
            this.conversationHistory.push({
                text,
                sender,
                timestamp: new Date().toISOString()
            });
            this.saveConversationHistory();
        }
    }

    createMessageElement(text, sender, isTemp = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message${isTemp ? ' temp-message' : ''}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        
        // Add timestamp for non-temp messages
        if (!isTemp) {
            const timestamp = document.createElement('div');
            timestamp.className = 'message-timestamp';
            timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            messageDiv.appendChild(timestamp);
        }
        
        return messageDiv;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleTyping() {
        // Show that user is typing (could be used for future enhancements)
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            // User stopped typing
        }, 1000);
    }

    speakResponse(text) {
        if (this.synthesis && this.userPreferences.voiceEnabled) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a female voice
            const voices = this.synthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') ||
                voice.name.includes('Karen')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('mediabay-chatbot-preferences');
        return saved ? JSON.parse(saved) : {
            voiceEnabled: false,
            theme: 'light',
            notifications: true
        };
    }

    saveUserPreferences() {
        localStorage.setItem('mediabay-chatbot-preferences', JSON.stringify(this.userPreferences));
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('mediabay-chatbot-history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
            
            // Restore recent messages (last 10)
            const recentMessages = this.conversationHistory.slice(-10);
            recentMessages.forEach(msg => {
                if (msg.sender !== 'bot' || !msg.text.includes('Listening...')) {
                    const messageElement = this.createMessageElement(msg.text, msg.sender);
                    this.messagesContainer.appendChild(messageElement);
                }
            });
            
            if (recentMessages.length > 0) {
                this.scrollToBottom();
            }
        }
    }

    saveConversationHistory() {
        // Keep only last 50 messages to prevent storage bloat
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        
        localStorage.setItem('mediabay-chatbot-history', JSON.stringify(this.conversationHistory));
    }

    clearHistory() {
        this.conversationHistory = [];
        this.messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    Hi! I'm your MediaBay assistant. How can I help you today?
                    <div class="quick-actions">
                        <button class="quick-action" data-action="pricing">Get Pricing</button>
                        <button class="quick-action" data-action="services">Our Services</button>
                        <button class="quick-action" data-action="meeting">Schedule Meeting</button>
                        <button class="quick-action" data-action="location">Our Location</button>
                    </div>
                </div>
            </div>
        `;
        this.setupQuickActions();
        localStorage.removeItem('mediabay-chatbot-history');
    }

    // Public methods for external access
    askAboutService(service) {
        this.openChatbot();
        setTimeout(() => {
            this.addMessage(`Tell me about ${service}`, 'user');
            setTimeout(() => {
                this.addMessage(this.processMessage(`Tell me about ${service}`), 'bot');
            }, 500);
        }, 500);
    }

    askAboutPricing(type = 'general') {
        this.openChatbot();
        setTimeout(() => {
            this.addMessage('I\'d like to know about pricing', 'user');
            setTimeout(() => {
                if (type === 'general') {
                    this.addMessage(this.responses.pricing.general, 'bot');
                    this.showPricingOptions();
                } else {
                    this.addMessage(this.responses.pricing[type], 'bot');
                }
            }, 500);
        }, 500);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mediaBayChatbot = new MediaBayChatbot();
});

// Add CSS for chatbot enhancements
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
    .message-timestamp {
        font-size: 0.7rem;
        color: rgba(0,0,0,0.5);
        margin-top: 0.25rem;
        text-align: right;
    }
    
    .bot-message .message-timestamp {
        text-align: left;
    }
    
    .temp-message {
        opacity: 0.7;
        font-style: italic;
    }
    
    .pricing-options,
    .service-options,
    .estimator-option {
        margin-top: 0.5rem;
    }
    
    .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.5rem;
    }
    
    .quick-action {
        padding: 0.5rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.2s;
    }
    
    .quick-action:hover {
        background: var(--accent-color);
    }
    
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 1rem;
        background: var(--light-gray);
        border-radius: 1rem;
        align-self: flex-start;
        max-width: 80px;
        margin-bottom: 0.5rem;
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--medium-gray);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    .typing-dot:nth-child(3) { animation-delay: 0s; }
    
    @keyframes typingBounce {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .voice-btn.listening {
        background: #dc3545 !important;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

document.head.appendChild(chatbotStyles);

console.log('MediaBay chatbot.js loaded successfully!');