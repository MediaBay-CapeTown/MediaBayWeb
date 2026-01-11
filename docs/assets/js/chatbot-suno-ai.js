// MediaBay Advanced AI Chatbot & Voice Assistant "Suna AI"
class MediaBayAdvancedChatbot {
    constructor() {
        this.isOpen = false;
        this.isListening = false;
        this.isTyping = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.conversationHistory = [];
        this.userContext = {};
        this.aiPersonality = 'helpful';
        this.humanHandoffRequested = false;
        this.sessionId = this.generateSessionId();
        this.messageQueue = [];
        this.isProcessing = false;
        
        this.responses = this.initializeAdvancedResponses();
        this.contextualMemory = this.loadContextualMemory();
        this.userPreferences = this.loadUserPreferences();
        
        this.init();
    }

    init() {
        this.createAdvancedChatbotInterface();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.initializeAIProcessing();
        this.setupContextualAwareness();
        this.setupLiveChatIntegration();
        this.setupProactiveEngagement();
        this.loadConversationHistory();
        this.addChatbotStyles();
        
        console.log('MediaBay Advanced Chatbot "Suna AI by MediaBay" initialized');
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createAdvancedChatbotInterface() {
        // Remove old chatbot if exists
        const oldChatbot = document.getElementById('chatbot-interface');
        if (oldChatbot) oldChatbot.remove();

        // Create floating action button
        const fab = document.createElement('div');
        fab.id = 'chatbot-fab';
        fab.className = 'chatbot-fab';
        fab.innerHTML = `
            <div class="fab-icon">💬</div>
            <div class="fab-notification" id="fab-notification" style="display: none;">1</div>
            <div class="fab-tooltip">Chat with MediaBay Suna AI!</div>
        `;
        
        // Create advanced chatbot interface
        const chatbot = document.createElement('div');
        chatbot.id = 'chatbot-interface';
        chatbot.className = 'chatbot-interface';
        chatbot.innerHTML = `
            <div class="chatbot-header">
                <div class="agent-info">
                    <div class="agent-avatar">🤖</div>
                    <div class="agent-details">
                        <div class="agent-name">MediaBay Suna AI</div>
                        <div class="agent-status" id="agent-status">Online</div>
                    </div>
                </div>
                <div class="chatbot-controls">
                    <button id="voice-toggle" class="control-btn" title="Voice Chat">🎤</button>
                    <button id="settings-btn" class="control-btn" title="Settings">⚙️</button>
                    <button id="chatbot-minimize" class="control-btn" title="Minimize">−</button>
                    <button id="chatbot-close" class="control-btn" title="Close">×</button>
                </div>
            </div>
            
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="welcome-message">
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <div class="message-text">Hi! I'm MediaBay Suna, your AI assistant at MediaBay. I can help you with pricing, services, project planning, and more. How can I assist you today?</div>
                            <div class="message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="quick-actions" id="quick-actions">
                <button class="quick-action" data-action="pricing">💰 Get Pricing</button>
                <button class="quick-action" data-action="services">🛠️ Our Services</button>
                <button class="quick-action" data-action="portfolio">📁 View Portfolio</button>
                <button class="quick-action" data-action="meeting">📅 Book Meeting</button>
            </div>
            
            <div class="typing-indicator" id="typing-indicator" style="display: none;">
                <div class="message bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <div class="typing-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span class="typing-text">Suna is thinking...</span>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-input-area">
                <div class="input-container">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." autocomplete="off" maxlength="500">
                    <button id="attach-btn" class="input-btn" title="Attach File">📎</button>
                    <button id="emoji-btn" class="input-btn" title="Emoji">😊</button>
                    <button id="voice-btn" class="input-btn" title="Voice Message">🎤</button>
                    <button id="send-btn" class="input-btn" title="Send">➤</button>
                </div>
                <div class="input-suggestions" id="input-suggestions"></div>
                <div class="character-count">
                    <span id="char-count">0</span>/500
                </div>
            </div>
            
            <div class="chatbot-footer">
                <div class="powered-by">Powered by MediaBay AI</div>
                <button id="human-handoff" class="handoff-btn">💬 Chat with Human</button>
            </div>
            
            <!-- Settings Panel -->
            <div class="settings-panel" id="settings-panel" style="display: none;">
                <div class="settings-header">
                    <h4>Chat Settings</h4>
                    <button class="settings-close" onclick="this.closest('.settings-panel').style.display='none'">×</button>
                </div>
                <div class="settings-content">
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="voice-enabled" checked>
                            Enable Voice Responses
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="notifications-enabled" checked>
                            Enable Notifications
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>AI Personality:</label>
                        <select id="personality-select">
                            <option value="helpful">Helpful</option>
                            <option value="friendly">Friendly</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <button class="btn-secondary" onclick="clearChatHistory()">Clear Chat History</button>
                    </div>
                </div>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(fab);
        document.body.appendChild(chatbot);
        
        // Store references
        this.fab = fab;
        this.interface = chatbot;
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
    }

    addChatbotStyles() {
        const styles = `
            <style id="chatbot-styles">
                .chatbot-fab {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 1500;
                    transition: all 0.3s ease;
                    animation: fabPulse 2s infinite;
                }
                
                .chatbot-fab:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
                }
                
                .chatbot-fab .fab-icon {
                    font-size: 1.5rem;
                    color: white;
                }
                
                .chatbot-fab .fab-notification {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .chatbot-fab .fab-tooltip {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }
                
                .chatbot-fab:hover .fab-tooltip {
                    opacity: 1;
                    visibility: visible;
                }
                
                @keyframes fabPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .chatbot-interface {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 380px;
                    height: 600px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 1400;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(20px) scale(0.9);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    overflow: hidden;
                }
                
                .chatbot-interface.open {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                    visibility: visible;
                }
                
                .chatbot-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                    color: white;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .agent-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .agent-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                
                .agent-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                
                .agent-status {
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                
                .chatbot-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .control-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }
                
                .control-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                
                .chatbot-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .message {
                    display: flex;
                    gap: 8px;
                    animation: messageSlideIn 0.3s ease-out;
                }
                
                .message.user-message {
                    flex-direction: row-reverse;
                }
                
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }
                
                .bot-message .message-avatar {
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                    color: white;
                }
                
                .user-message .message-avatar {
                    background: var(--light-gray);
                    color: var(--dark-gray);
                }
                
                .message-content {
                    max-width: 70%;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .message-text {
                    background: var(--light-gray);
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    word-wrap: break-word;
                }
                
                .user-message .message-text {
                    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                    color: white;
                }
                
                .message-time {
                    font-size: 0.75rem;
                    color: var(--medium-gray);
                    padding: 0 16px;
                }
                
                .quick-actions {
                    padding: 12px 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    border-top: 1px solid var(--light-gray);
                }
                
                .quick-action {
                    background: var(--light-gray);
                    border: none;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: var(--dark-gray);
                }
                
                .quick-action:hover {
                    background: var(--accent-color);
                    color: white;
                    transform: translateY(-1px);
                }
                
                .typing-indicator {
                    padding: 0 16px;
                }
                
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                    background: var(--light-gray);
                    border-radius: 18px;
                    width: fit-content;
                }
                
                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: var(--medium-gray);
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                
                .typing-text {
                    font-size: 0.75rem;
                    color: var(--medium-gray);
                    margin-left: 8px;
                }
                
                .chatbot-input-area {
                    padding: 16px;
                    border-top: 1px solid var(--light-gray);
                }
                
                .input-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--light-gray);
                    border-radius: 24px;
                    padding: 8px 12px;
                }
                
                #chatbot-input {
                    flex: 1;
                    border: none;
                    background: none;
                    outline: none;
                    font-size: 0.9rem;
                    padding: 8px 0;
                    font-family: inherit;
                }
                
                .input-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }
                
                .input-btn:hover {
                    background: rgba(0,0,0,0.1);
                    transform: scale(1.1);
                }
                
                .input-btn.active {
                    background: var(--accent-color);
                    color: white;
                }
                
                .character-count {
                    font-size: 0.75rem;
                    color: var(--medium-gray);
                    text-align: right;
                    margin-top: 4px;
                }
                
                .chatbot-footer {
                    padding: 12px 16px;
                    border-top: 1px solid var(--light-gray);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .powered-by {
                    font-size: 0.75rem;
                    color: var(--medium-gray);
                }
                
                .handoff-btn {
                    background: none;
                    border: 1px solid var(--accent-color);
                    color: var(--accent-color);
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .handoff-btn:hover {
                    background: var(--accent-color);
                    color: white;
                }
                
                .settings-panel {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    border-radius: 16px;
                    z-index: 10;
                }
                
                .settings-header {
                    background: var(--primary-color);
                    color: white;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 16px 16px 0 0;
                }
                
                .settings-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 4px;
                }
                
                .settings-content {
                    padding: 20px;
                }
                
                .setting-item {
                    margin-bottom: 16px;
                }
                
                .setting-item label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                .setting-item select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid var(--light-gray);
                    border-radius: 6px;
                    font-size: 0.9rem;
                    margin-top: 4px;
                }
                
                @keyframes messageSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .chatbot-interface {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                        right: 10px;
                        bottom: 80px;
                    }
                    
                    .chatbot-fab {
                        bottom: 15px;
                        right: 15px;
                        width: 55px;
                        height: 55px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        // FAB click
        this.fab.addEventListener('click', () => this.toggleChatbot());
        
        // Close button
        document.getElementById('chatbot-close').addEventListener('click', () => this.closeChatbot());
        
        // Minimize button
        document.getElementById('chatbot-minimize').addEventListener('click', () => this.minimizeChatbot());
        
        // Send button
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Input field
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character count
        this.inputField.addEventListener('input', () => {
            const count = this.inputField.value.length;
            document.getElementById('char-count').textContent = count;
            
            if (count > 450) {
                document.getElementById('char-count').style.color = '#dc3545';
            } else {
                document.getElementById('char-count').style.color = '';
            }
            
            this.handleTyping();
        });
        
        // Voice button
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        
        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            const panel = document.getElementById('settings-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        // Quick actions
        document.getElementById('quick-actions').addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });
        
        // Human handoff
        document.getElementById('human-handoff').addEventListener('click', () => this.requestHumanHandoff());
        
        // Settings changes
        document.getElementById('voice-enabled').addEventListener('change', (e) => {
            this.userPreferences.voiceEnabled = e.target.checked;
            this.saveUserPreferences();
        });
        
        document.getElementById('notifications-enabled').addEventListener('change', (e) => {
            this.userPreferences.notificationsEnabled = e.target.checked;
            this.saveUserPreferences();
        });
        
        document.getElementById('personality-select').addEventListener('change', (e) => {
            this.aiPersonality = e.target.value;
            this.userPreferences.personality = e.target.value;
            this.saveUserPreferences();
            this.addMessage('Personality updated! I\'ll adjust my responses accordingly.', 'bot');
        });
        
        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.interface.contains(e.target) && 
                !this.fab.contains(e.target)) {
                this.closeChatbot();
            }
        });
        
        // Global clear function
        window.clearChatHistory = () => {
            this.conversationHistory = [];
            this.saveConversationHistory();
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <div class="message-text">Chat history cleared! How can I help you today?</div>
                            <div class="message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('settings-panel').style.display = 'none';
        };
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.voiceBtn.classList.add('active');
                this.voiceBtn.innerHTML = '🔴';
                this.addMessage('🎤 Listening...', 'bot', true);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                
                this.inputField.value = transcript;
                
                if (confidence > 0.7) {
                    this.sendMessage();
                } else {
                    this.addMessage(`I heard: "${transcript}" (${Math.round(confidence * 100)}% confidence). Please confirm or retype.`, 'bot');
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.addMessage('Sorry, I couldn\'t hear you clearly. Please try again or type your message.', 'bot');
                this.resetVoiceButton();
            };

            this.recognition.onend = () => {
                this.resetVoiceButton();
            };
        } else {
            this.voiceBtn.style.display = 'none';
        }
    }

    initializeAIProcessing() {
        // Advanced NLP patterns and responses
        this.nlpPatterns = {
            greeting: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
            pricing: /(price|cost|how much|budget|quote|estimate)/i,
            services: /(service|what do you do|capabilities|offer)/i,
            portfolio: /(portfolio|work|examples|previous projects)/i,
            contact: /(contact|phone|email|address|location)/i,
            meeting: /(meeting|consultation|appointment|schedule)/i,
            urgent: /(urgent|asap|quickly|rush|emergency)/i,
            thanks: /(thank|thanks|appreciate)/i,
            goodbye: /(bye|goodbye|see you|farewell)/i,
            help: /(help|support|assist|guidance)/i
        };
        
        // Context-aware responses
        this.contextResponses = {
            first_visit: [
                "Welcome to MediaBay! I'm Suna, your AI assistant. I can help you with pricing, services, and project planning.",
                "Hi there! New to MediaBay? I'd love to help you explore our web design services.",
                "Hello! I'm here to make your MediaBay experience smooth. What brings you here today?"
            ],
            returning_user: [
                "Welcome back! How can I assist you today?",
                "Great to see you again! What can I help you with?",
                "Hello again! Ready to continue where we left off?"
            ],
            after_quote: [
                "I see you've been looking at pricing. Would you like to discuss your specific project needs?",
                "Based on your quote request, I can help you refine your requirements or schedule a consultation.",
                "Ready to move forward with your project? I can connect you with our team."
            ]
        };
    }

    setupContextualAwareness() {
        // Track user behavior
        this.userContext = {
            visitCount: parseInt(localStorage.getItem('mediabay_visit_count') || '0') + 1,
            lastVisit: localStorage.getItem('mediabay_last_visit'),
            currentPage: window.location.hash || '#home',
            timeOnSite: 0,
            actionsPerformed: [],
            interests: []
        };
        
        localStorage.setItem('mediabay_visit_count', this.userContext.visitCount);
        localStorage.setItem('mediabay_last_visit', new Date().toISOString());
        
        // Track page changes
        window.addEventListener('hashchange', () => {
            this.userContext.currentPage = window.location.hash;
            this.updateContextualSuggestions();
        });
        
        // Track time on site
        setInterval(() => {
            this.userContext.timeOnSite += 1;
        }, 1000);
        
        // Proactive engagement based on context
        this.setupProactiveEngagement();
    }

    setupProactiveEngagement() {
        // Show proactive messages based on user behavior
        setTimeout(() => {
            if (!this.isOpen && this.userContext.visitCount === 1) {
                this.showProactiveMessage("👋 New here? I can help you find the perfect web solution!");
            }
        }, 30000); // After 30 seconds
        
        setTimeout(() => {
            if (!this.isOpen && this.userContext.timeOnSite > 120) {
                this.showProactiveMessage("💡 Need help with pricing? I can give you an instant estimate!");
            }
        }, 120000); // After 2 minutes
        
        // Page-specific proactive messages
        setTimeout(() => {
            if (window.location.hash === '#quote-estimator' && !this.isOpen) {
                this.showProactiveMessage("🧮 Need help with the quote calculator? I'm here to assist!");
            }
        }, 15000);
    }

    showProactiveMessage(message) {
        const notification = document.getElementById('fab-notification');
        notification.style.display = 'flex';
        notification.textContent = '!';
        
        // Add pulsing animation
        this.fab.style.animation = 'fabPulse 1s infinite';
        
        // Store the proactive message
        this.proactiveMessage = message;
    }

    setupLiveChatIntegration() {
        // Simulate live chat availability
        this.liveAgentAvailable = Math.random() > 0.3; // 70% chance agent is available
        
        if (this.liveAgentAvailable) {
            document.getElementById('agent-status').textContent = 'Online';
            document.getElementById('agent-status').style.color = '#28a745';
        } else {
            document.getElementById('agent-status').textContent = 'AI Only';
            document.getElementById('agent-status').style.color = '#ffc107';
        }
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
        
        // Hide notification
        const notification = document.getElementById('fab-notification');
        notification.style.display = 'none';
        this.fab.style.animation = '';
        
        // Show proactive message if exists
        if (this.proactiveMessage) {
            setTimeout(() => {
                this.addMessage(this.proactiveMessage, 'bot');
                this.proactiveMessage = null;
            }, 500);
        }
        
        // Focus input
        setTimeout(() => {
            this.inputField.focus();
        }, 300);
        
        // Track opening
        this.userContext.actionsPerformed.push({
            action: 'chatbot_opened',
            timestamp: Date.now()
        });
    }

    closeChatbot() {
        this.isOpen = false;
        this.interface.classList.remove('open');
        
        // Stop any ongoing speech recognition
        if (this.isListening && this.recognition) {
            this.recognition.stop();
        }
        
        // Save conversation
        this.saveConversationHistory();
    }

    minimizeChatbot() {
        this.closeChatbot();
        this.showProactiveMessage("💬 I'm still here if you need me!");
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.inputField.value = '';
        document.getElementById('char-count').textContent = '1';
        
        // Process message
        this.processMessage(message);
        
        // Save to history
        this.conversationHistory.push({
            message: message,
            sender: 'user',
            timestamp: Date.now()
        });
    }

    addMessage(text, sender, isTemporary = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? '🤖' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        
        // Remove temporary messages
        if (isTemporary) {
            messageDiv.classList.add('temporary-message');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to history (non-temporary messages)
        if (!isTemporary) {
            this.conversationHistory.push({
                message: text,
                sender: sender,
                timestamp: Date.now()
            });
        }
    }

    processMessage(message) {
        this.showTypingIndicator();
        
        // Simulate processing delay
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            
            // Text-to-speech if enabled
            if (this.userPreferences.voiceEnabled && this.synthesis) {
                this.speakResponse(response);
            }
        }, 1000 + Math.random() * 2000); // 1-3 second delay
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for patterns
        if (this.nlpPatterns.greeting.test(message)) {
            return this.getContextualGreeting();
        }
        
        if (this.nlpPatterns.pricing.test(message)) {
            return this.getPricingResponse(message);
        }
        
        if (this.nlpPatterns.services.test(message)) {
            return this.getServicesResponse();
        }
        
        if (this.nlpPatterns.portfolio.test(message)) {
            return this.getPortfolioResponse();
        }
        
        if (this.nlpPatterns.contact.test(message)) {
            return this.getContactResponse();
        }
        
        if (this.nlpPatterns.meeting.test(message)) {
            return this.getMeetingResponse();
        }
        
        if (this.nlpPatterns.thanks.test(message)) {
            return this.getThankYouResponse();
        }
        
        if (this.nlpPatterns.goodbye.test(message)) {
            return this.getGoodbyeResponse();
        }
        
        if (this.nlpPatterns.help.test(message)) {
            return this.getHelpResponse();
        }
        
        // Default response with suggestions
        return this.getDefaultResponse(message);
    }

    getContextualGreeting() {
        const greetings = this.userContext.visitCount === 1 ? 
            this.contextResponses.first_visit : 
            this.contextResponses.returning_user;
            
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getPricingResponse(message) {
        const responses = [
            "Our pricing starts from R2,500 for simple websites, R5,000-R15,000 for business sites, and R15,000+ for e-commerce. Would you like a personalized quote?",
            "I can help you get an accurate quote! Our prices range from R2,500 to R50,000+ depending on your needs. What type of website are you looking for?",
            "Great question! Our pricing is based on South African market rates. Simple sites start at R2,500, while custom applications can go up to R50,000+. Shall I help you calculate a quote?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getServicesResponse() {
        return "We offer comprehensive web services including:\n\n🎨 UI/UX Design\n💻 Custom Web Development\n🛒 E-commerce Solutions\n📱 Mobile-Responsive Design\n🔍 SEO Optimization\n⚡ Performance Optimization\n🔧 Maintenance & Support\n\nWhich service interests you most?";
    }

    getPortfolioResponse() {
        return "I'd love to show you our work! We've completed projects across various industries including retail, hospitality, finance, and tech startups. You can view our portfolio section on this page, or I can schedule a call where our team can walk you through specific case studies. What industry are you in?";
    }

    getContactResponse() {
        return "Here's how to reach MediaBay:\n\n📧 Email: mediabay3@gmail.com\n📍 Location: Cape Town, South Africa\n🕒 Hours: Mon-Fri 9AM-6PM, Sat 10AM-2PM\n\nWould you like me to schedule a consultation or connect you with our team directly?";
    }

    getMeetingResponse() {
        return "I'd be happy to help you schedule a consultation! We offer:\n\n📞 Phone consultations (30 min)\n💻 Video calls (45 min)\n🏢 In-person meetings (Cape Town area)\n\nWhat works best for your schedule? I can check our availability and send you a calendar link.";
    }

    getThankYouResponse() {
        const responses = [
            "You're very welcome! I'm here whenever you need assistance. 😊",
            "My pleasure! Feel free to ask if you have any other questions.",
            "Happy to help! Is there anything else I can assist you with today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getGoodbyeResponse() {
        return "Thanks for chatting with me! Feel free to reach out anytime. Have a great day! 👋";
    }

    getHelpResponse() {
        return "I'm here to help! I can assist you with:\n\n💰 Pricing and quotes\n🛠️ Service information\n📁 Portfolio examples\n📅 Scheduling consultations\n📞 Contact details\n🗺️ Location and directions\n\nWhat would you like to know more about?";
    }

    getDefaultResponse(message) {
        const responses = [
            "That's an interesting question! Let me connect you with our team for a detailed answer. In the meantime, is there anything specific about our web design services I can help with?",
            "I want to make sure I give you the most accurate information. Would you like me to have one of our specialists reach out to you about this?",
            "Great question! While I can help with general information about our services and pricing, our team would be better equipped to give you a detailed answer. Shall I arrange a callback?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleQuickAction(action) {
        switch (action) {
            case 'pricing':
                this.addMessage("I'd like to know about your pricing", 'user');
                this.processMessage("pricing information");
                break;
            case 'services':
                this.addMessage("What services do you offer?", 'user');
                this.processMessage("services");
                break;
            case 'portfolio':
                this.addMessage("Can I see your portfolio?", 'user');
                this.processMessage("portfolio examples");
                break;
            case 'meeting':
                this.addMessage("I'd like to schedule a meeting", 'user');
                this.processMessage("schedule meeting");
                break;
        }
    }

    requestHumanHandoff() {
        if (this.liveAgentAvailable) {
            this.addMessage("I'm connecting you with a human agent. Please hold on...", 'bot');
            
            setTimeout(() => {
                this.addMessage("👋 Hi! I'm Sarah from MediaBay. I see you were chatting with Suna. How can I help you today?", 'bot');
                document.getElementById('agent-status').textContent = 'Human Agent';
                document.querySelector('.agent-name').textContent = 'Sarah (Human)';
                this.humanHandoffRequested = true;
            }, 3000);
        } else {
            this.addMessage("Our human agents are currently offline, but I've logged your request. Someone will get back to you within 24 hours. In the meantime, I'm here to help with any questions!", 'bot');
        }
    }

    toggleVoiceRecognition() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            if (this.recognition) {
                this.recognition.start();
            } else {
                this.addMessage("Voice recognition is not supported in your browser. Please type your message instead.", 'bot');
            }
        }
    }

    resetVoiceButton() {
        this.isListening = false;
        this.voiceBtn.classList.remove('active');
        this.voiceBtn.innerHTML = '🎤';
    }

    speakResponse(text) {
        if (this.synthesis && this.userPreferences.voiceEnabled) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            // Clean text for speech
            const cleanText = text.replace(/[🎨💻🛒📱🔍⚡🔧📧📍🕒📞💻🏢💰🛠️📁📅👋😊]/g, '').replace(/\n/g, ' ');
            
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a female voice
            const voices = this.synthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') || 
                voice.name.includes('Karen') ||
                voice.name.includes('Zira')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'block';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'none';
    }

    handleTyping() {
        // Show typing suggestions based on input
        const input = this.inputField.value.toLowerCase();
        const suggestions = [];
        
        if (input.includes('price') || input.includes('cost')) {
            suggestions.push('Get a quote', 'View pricing tiers', 'Calculate estimate');
        }
        
        if (input.includes('service') || input.includes('what')) {
            suggestions.push('Our services', 'Web design', 'E-commerce', 'SEO');
        }
        
        if (input.includes('meet') || input.includes('call')) {
            suggestions.push('Schedule consultation', 'Book a call', 'In-person meeting');
        }
        
        this.showInputSuggestions(suggestions);
    }

    showInputSuggestions(suggestions) {
        const container = document.getElementById('input-suggestions');
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => 
            `<button class="suggestion-btn" onclick="applySuggestion('${suggestion}')">${suggestion}</button>`
        ).join('');
        
        // Global function for applying suggestions
        window.applySuggestion = (suggestion) => {
            this.inputField.value = suggestion;
            this.inputField.focus();
            document.getElementById('input-suggestions').innerHTML = '';
        };
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    loadUserPreferences() {
        const defaults = {
            voiceEnabled: true,
            notificationsEnabled: true,
            personality: 'helpful'
        };
        
        const saved = localStorage.getItem('mediabay_chatbot_preferences');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    saveUserPreferences() {
        localStorage.setItem('mediabay_chatbot_preferences', JSON.stringify(this.userPreferences));
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('mediabay_conversation_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
            
            // Restore recent messages (last 10)
            const recentMessages = this.conversationHistory.slice(-10);
            recentMessages.forEach(msg => {
                if (msg.sender !== 'system') {
                    this.addMessage(msg.message, msg.sender);
                }
            });
        }
    }

    saveConversationHistory() {
        // Keep only last 50 messages to prevent storage bloat
        const trimmedHistory = this.conversationHistory.slice(-50);
        localStorage.setItem('mediabay_conversation_history', JSON.stringify(trimmedHistory));
    }

    loadContextualMemory() {
        const saved = localStorage.getItem('mediabay_contextual_memory');
        return saved ? JSON.parse(saved) : {};
    }

    initializeAdvancedResponses() {
        return {
            // This would typically connect to a more sophisticated AI service
            // For now, we use the pattern-based responses defined above
        };
    }
}

// Initialize the advanced chatbot
document.addEventListener('DOMContentLoaded', function() {
    window.mediaBayChatbot = new MediaBayAdvancedChatbot();
});