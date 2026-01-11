// Initialize all systems when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize security system
            window.mediaBaySecurity = new MediaBaySecurity();
            
            // Initialize smart systems
            window.smartSystems = new MediaBaySmartSystems();
            
            // Initialize advanced chatbot
            window.mediaBayChatbot = new MediaBayAdvancedChatbot();
            
            // Initialize animations
            window.mediaBayAnimations = new MediaBayAnimations();
            
            // Initialize form handler
            window.formHandler = new MediaBayFormHandler();
            
            console.log('All MediaBay systems initialized successfully!');
        });