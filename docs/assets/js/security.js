// MediaBay Advanced Security System
class MediaBaySecurity {
    constructor() {
        this.rateLimits = new Map();
        this.sessionToken = null;
        this.csrfToken = this.generateCSRFToken();
        this.activityLog = [];
        this.loginAttempts = new Map();
        this.securityConfig = {
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            maxRequestsPerMinute: 60,
            passwordMinLength: 8,
            requireSpecialChars: true,
            require2FA: false
        };
        
        this.init();
    }

    init() {
        this.setupCSRFProtection();
        this.setupXSSProtection();
        this.setupRateLimiting();
        this.setupSecureCookies();
        this.setupHTTPSEnforcement();
        this.setupInputSanitization();
        this.setupHoneypotProtection();
        this.initializeActivityLogging();
        this.setupSessionManagement();
        this.setupPasswordValidation();
        this.setup2FA();
        this.setupSecurityHeaders();
        
        console.log('MediaBay Security System initialized');
    }

    // CSRF Protection
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    setupCSRFProtection() {
        // Add CSRF token to all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = this.csrfToken;
                form.appendChild(csrfInput);
            }
        });

        // Add CSRF token to AJAX requests
        const originalFetch = window.fetch;
        window.fetch = (url, options = {}) => {
            if (options.method && options.method.toUpperCase() !== 'GET') {
                options.headers = options.headers || {};
                options.headers['X-CSRF-Token'] = this.csrfToken;
            }
            return originalFetch(url, options);
        };

        // Validate CSRF token on form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const csrfToken = form.querySelector('input[name="csrf_token"]');
            
            if (csrfToken && csrfToken.value !== this.csrfToken) {
                e.preventDefault();
                this.logSecurityEvent('csrf_token_mismatch', {
                    form: form.id || 'unknown',
                    expected: this.csrfToken,
                    received: csrfToken.value
                });
                this.showSecurityAlert('Security token mismatch. Please refresh the page.');
                return false;
            }
        });
    }

    // XSS Protection
    setupXSSProtection() {
        // Content Security Policy
        const csp = document.createElement('meta');
        csp.httpEquiv = 'Content-Security-Policy';
        csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://kit.fontawesome.com https://challenges.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; media-src 'self'; object-src 'none'; frame-src 'none';";
        document.head.appendChild(csp);

        // X-Content-Type-Options
        const noSniff = document.createElement('meta');
        noSniff.httpEquiv = 'X-Content-Type-Options';
        noSniff.content = 'nosniff';
        document.head.appendChild(noSniff);

        // X-Frame-Options
        const frameOptions = document.createElement('meta');
        frameOptions.httpEquiv = 'X-Frame-Options';
        frameOptions.content = 'DENY';
        document.head.appendChild(frameOptions);

        // Referrer Policy
        const referrerPolicy = document.createElement('meta');
        referrerPolicy.name = 'referrer';
        referrerPolicy.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerPolicy);
    }

    // Input Sanitization
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') return input;

        let sanitized = input.trim();

        switch (type) {
            case 'email':
                sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
                break;
            case 'phone':
                sanitized = sanitized.replace(/[^0-9+\-\s()]/g, '');
                break;
            case 'name':
                sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
                break;
            case 'alphanumeric':
                sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
                break;
            case 'text':
            default:
                // Remove script tags and dangerous HTML
                sanitized = sanitized
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .replace(/data:text\/html/gi, '')
                    .replace(/vbscript:/gi, '')
                    .replace(/expression\s*\(/gi, '');
                break;
        }

        // HTML encode special characters
        const div = document.createElement('div');
        div.textContent = sanitized;
        return div.innerHTML;
    }

    setupInputSanitization() {
        // Sanitize all form inputs on submit
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (input.type !== 'hidden' && input.name !== 'csrf_token') {
                    const type = this.getInputType(input);
                    const originalValue = input.value;
                    const sanitizedValue = this.sanitizeInput(input.value, type);
                    
                    if (originalValue !== sanitizedValue) {
                        this.logSecurityEvent('input_sanitized', {
                            field: input.name,
                            original: originalValue,
                            sanitized: sanitizedValue
                        });
                    }
                    
                    input.value = sanitizedValue;
                }
            });
        });

        // Real-time sanitization for text inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                const type = this.getInputType(e.target);
                const sanitized = this.sanitizeInput(e.target.value, type);
                if (sanitized !== e.target.value) {
                    e.target.value = sanitized;
                }
            }
        });
    }

    getInputType(input) {
        if (input.type === 'email' || input.name.includes('email')) return 'email';
        if (input.type === 'tel' || input.name.includes('phone')) return 'phone';
        if (input.name.includes('name') || input.name.includes('Name')) return 'name';
        if (input.dataset.type) return input.dataset.type;
        return 'text';
    }

    // Rate Limiting
    setupRateLimiting() {
        const rateLimitedActions = ['form_submit', 'login_attempt', 'api_call'];
        
        rateLimitedActions.forEach(action => {
            this.rateLimits.set(action, []);
        });

        // Monitor form submissions
        document.addEventListener('submit', (e) => {
            if (!this.checkRateLimit('form_submit')) {
                e.preventDefault();
                this.showSecurityAlert('Too many requests. Please wait before trying again.');
                this.logSecurityEvent('rate_limit_exceeded', { action: 'form_submit' });
            }
        });

        // Clean up old rate limit entries every minute
        setInterval(() => {
            this.cleanupRateLimits();
        }, 60000);
    }

    checkRateLimit(action) {
        const now = Date.now();
        const attempts = this.rateLimits.get(action) || [];
        
        // Remove attempts older than 1 minute
        const recentAttempts = attempts.filter(time => now - time < 60000);
        
        if (recentAttempts.length >= this.securityConfig.maxRequestsPerMinute) {
            return false;
        }
        
        recentAttempts.push(now);
        this.rateLimits.set(action, recentAttempts);
        return true;
    }

    cleanupRateLimits() {
        const now = Date.now();
        this.rateLimits.forEach((attempts, action) => {
            const recentAttempts = attempts.filter(time => now - time < 60000);
            this.rateLimits.set(action, recentAttempts);
        });
    }

    // Secure Cookies
    setupSecureCookies() {
        // Override document.cookie to enforce secure settings
        const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || 
                                       Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        
        if (originalCookieDescriptor && originalCookieDescriptor.configurable) {
            Object.defineProperty(document, 'cookie', {
                get: originalCookieDescriptor.get,
                set: function(value) {
                    // Ensure secure flags are set
                    if (!value.includes('Secure') && location.protocol === 'https:') {
                        value += '; Secure';
                    }
                    if (!value.includes('SameSite')) {
                        value += '; SameSite=Strict';
                    }
                    if (!value.includes('HttpOnly') && !value.includes('mediabay_user')) {
                        value += '; HttpOnly';
                    }
                    
                    originalCookieDescriptor.set.call(this, value);
                },
                enumerable: true,
                configurable: true
            });
        }
    }

    // HTTPS Enforcement
    setupHTTPSEnforcement() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            // Add HSTS header simulation
            const hsts = document.createElement('meta');
            hsts.httpEquiv = 'Strict-Transport-Security';
            hsts.content = 'max-age=31536000; includeSubDomains';
            document.head.appendChild(hsts);
            
            this.logSecurityEvent('https_required', {
                current_protocol: location.protocol,
                hostname: location.hostname
            });
        }
    }

    // Honeypot Protection
    setupHoneypotProtection() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            if (!form.querySelector('input[name="honeypot"]')) {
                const honeypot = document.createElement('input');
                honeypot.type = 'text';
                honeypot.name = 'honeypot';
                honeypot.style.cssText = 'position: absolute; left: -9999px; top: -9999px; visibility: hidden;';
                honeypot.tabIndex = -1;
                honeypot.autocomplete = 'off';
                honeypot.setAttribute('aria-hidden', 'true');
                
                form.appendChild(honeypot);
            }
        });

        // Check honeypot on form submission
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const honeypot = form.querySelector('input[name="honeypot"]');
            
            if (honeypot && honeypot.value) {
                e.preventDefault();
                this.logSecurityEvent('honeypot_triggered', {
                    form: form.id || 'unknown',
                    value: honeypot.value
                });
                // Don't show alert to avoid revealing the honeypot
                return false;
            }
        });
    }

    // Activity Logging
    initializeActivityLogging() {
        // Log page views
        this.logSecurityEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent
        });

        // Log clicks on sensitive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('button[type="submit"], .btn-login, .btn-signup, .payment-btn')) {
                this.logSecurityEvent('sensitive_click', {
                    element: e.target.className,
                    text: e.target.textContent.trim()
                });
            }
        });

        // Log form focus events
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input[type="password"], input[name*="card"], input[name*="cvv"]')) {
                this.logSecurityEvent('sensitive_field_focus', {
                    field: e.target.name || e.target.type
                });
            }
        }, true);
    }

    logSecurityEvent(event, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            data: data,
            ip: this.getClientIP(),
            session: this.getSessionId(),
            user_agent: navigator.userAgent
        };
        
        this.activityLog.push(logEntry);
        
        // Keep only last 1000 entries
        if (this.activityLog.length > 1000) {
            this.activityLog = this.activityLog.slice(-1000);
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('mediabay_security_log', JSON.stringify(this.activityLog.slice(-100)));
        
        console.log('Security Event:', logEntry);
    }

    // Session Management
    setupSessionManagement() {
        this.sessionToken = localStorage.getItem('mediabay_session_token') || this.generateSessionToken();
        localStorage.setItem('mediabay_session_token', this.sessionToken);
        
        // Set session timeout
        this.resetSessionTimeout();
        
        // Monitor user activity
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => {
                this.resetSessionTimeout();
            }, { passive: true });
        });
        
        // Check session validity on page load
        this.validateSession();
    }

    generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    resetSessionTimeout() {
        clearTimeout(this.sessionTimeoutId);
        
        this.sessionTimeoutId = setTimeout(() => {
            this.expireSession();
        }, this.securityConfig.sessionTimeout);
        
        localStorage.setItem('mediabay_session_last_activity', Date.now().toString());
    }

    validateSession() {
        const lastActivity = localStorage.getItem('mediabay_session_last_activity');
        
        if (lastActivity) {
            const timeSinceActivity = Date.now() - parseInt(lastActivity);
            
            if (timeSinceActivity > this.securityConfig.sessionTimeout) {
                this.expireSession();
            }
        }
    }

    expireSession() {
        localStorage.removeItem('mediabay_session_token');
        localStorage.removeItem('mediabay_session_last_activity');
        localStorage.removeItem('mediabay_user');
        
        this.logSecurityEvent('session_expired');
        
        if (typeof showNotification === 'function') {
            showNotification('Your session has expired. Please log in again.', 'warning');
        }
        
        // Redirect to login if on protected page
        if (this.isProtectedPage()) {
            this.redirectToLogin();
        }
    }

    // Password Validation
    setupPasswordValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.type === 'password') {
                this.validatePasswordStrength(e.target);
            }
        });
    }

    validatePasswordStrength(passwordField) {
        const password = passwordField.value;
        const strength = this.calculatePasswordStrength(password);
        
        let strengthIndicator = passwordField.parentNode.querySelector('.password-strength');
        if (!strengthIndicator) {
            strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            passwordField.parentNode.appendChild(strengthIndicator);
        }
        
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill strength-${strength.level}" style="width: ${strength.score}%"></div>
            </div>
            <div class="strength-text">${strength.text}</div>
            ${strength.suggestions.length > 0 ? `
                <ul class="strength-suggestions">
                    ${strength.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            ` : ''}
        `;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const suggestions = [];
        
        if (password.length >= 8) score += 20;
        else suggestions.push('Use at least 8 characters');
        
        if (/[a-z]/.test(password)) score += 20;
        else suggestions.push('Include lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 20;
        else suggestions.push('Include uppercase letters');
        
        if (/[0-9]/.test(password)) score += 20;
        else suggestions.push('Include numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        else suggestions.push('Include special characters');
        
        let level, text;
        if (score < 40) {
            level = 'weak';
            text = 'Weak';
        } else if (score < 80) {
            level = 'medium';
            text = 'Medium';
        } else {
            level = 'strong';
            text = 'Strong';
        }
        
        return { score, level, text, suggestions };
    }

    // Two-Factor Authentication
    setup2FA() {
        window.enable2FA = () => {
            this.show2FASetup();
        };
        
        window.verify2FA = (code) => {
            return this.verify2FACode(code);
        };
    }

    show2FASetup() {
        const modal = document.createElement('div');
        modal.className = '2fa-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Enable Two-Factor Authentication</h2>
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="2fa-setup">
                        <p>Scan this QR code with your authenticator app:</p>
                        <div class="qr-code">
                            <div class="qr-placeholder">QR Code would appear here</div>
                        </div>
                        <p>Or enter this secret key manually:</p>
                        <div class="secret-key">JBSWY3DPEHPK3PXP</div>
                        <div class="form-group">
                            <label for="2fa-code">Enter verification code:</label>
                            <input type="text" id="2fa-code" maxlength="6" placeholder="123456">
                        </div>
                        <button class="btn-primary" onclick="verify2FA(document.getElementById('2fa-code').value)">Verify & Enable</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    verify2FACode(code) {
        // In a real implementation, this would verify against TOTP
        if (code === '123456') {
            localStorage.setItem('mediabay_2fa_enabled', 'true');
            if (typeof showNotification === 'function') {
                showNotification('Two-factor authentication enabled successfully!', 'success');
            }
            document.querySelector('.2fa-modal').remove();
            return true;
        } else {
            if (typeof showNotification === 'function') {
                showNotification('Invalid verification code. Please try again.', 'error');
            }
            return false;
        }
    }

    // Security Headers
    setupSecurityHeaders() {
        // Simulate security headers that would normally be set by server
        const headers = {
            'X-XSS-Protection': '1; mode=block',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };
        
        Object.entries(headers).forEach(([name, value]) => {
            const meta = document.createElement('meta');
            meta.httpEquiv = name;
            meta.content = value;
            document.head.appendChild(meta);
        });
    }

    // Utility Methods
    getClientIP() {
        // In a real implementation, this would get the actual client IP
        return 'client_ip_placeholder';
    }

    getSessionId() {
        return this.sessionToken || 'no_session';
    }

    isProtectedPage() {
        return window.location.hash.includes('user-portal') || 
               window.location.hash.includes('payment');
    }

    redirectToLogin() {
        window.location.hash = '#home';
        if (typeof showLoginModal === 'function') {
            setTimeout(showLoginModal, 500);
        }
    }

    showSecurityAlert(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // Public API
    getSecurityStatus() {
        return {
            csrfProtection: !!this.csrfToken,
            sessionActive: !!this.sessionToken,
            rateLimitStatus: Object.fromEntries(this.rateLimits),
            activityLogSize: this.activityLog.length,
            twoFactorEnabled: localStorage.getItem('mediabay_2fa_enabled') === 'true'
        };
    }

    clearSecurityLog() {
        this.activityLog = [];
        localStorage.removeItem('mediabay_security_log');
        this.logSecurityEvent('security_log_cleared');
    }

    exportSecurityLog() {
        const logData = {
            exported_at: new Date().toISOString(),
            log_entries: this.activityLog
        };
        
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mediabay_security_log_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.logSecurityEvent('security_log_exported');
    }
}

// Add security-related CSS
const securityStyles = document.createElement('style');
securityStyles.textContent = `
    .password-strength {
        margin-top: 8px;
    }
    
    .strength-bar {
        width: 100%;
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    .strength-weak { background: #dc3545; }
    .strength-medium { background: #ffc107; }
    .strength-strong { background: #28a745; }
    
    .strength-text {
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    }
    
    .strength-suggestions {
        font-size: 11px;
        color: #666;
        margin: 4px 0 0 0;
        padding-left: 16px;
    }
    
    .strength-suggestions li {
        margin: 2px 0;
    }
    
    .2fa-modal .modal-content {
        max-width: 400px;
    }
    
    .qr-placeholder {
        width: 200px;
        height: 200px;
        border: 2px dashed #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 16px auto;
        color: #666;
    }
    
    .secret-key {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 4px;
        font-family: monospace;
        text-align: center;
        margin: 16px 0;
        border: 1px solid #dee2e6;
    }
    
    .security-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
    }
`;
document.head.appendChild(securityStyles);