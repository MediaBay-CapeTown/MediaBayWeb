// MediaBay Advanced Form Handler & Email Integration
class MediaBayFormHandler {
    constructor() {
        this.forms = {
            contact: document.getElementById('contact-form'),
            newsletter: document.querySelector('.newsletter-form'),
            payment: document.getElementById('payment-form'),
            auth: document.querySelectorAll('.auth-form'),
            onboarding: document.getElementById('onboarding-form'),
            feedback: document.getElementById('feedback-form')
        };
        
        this.emailConfig = {
            serviceID: 'mediabay_service',
            templateID: 'mediabay_template',
            userID: 'mediabay_user_key',
            endpoint: 'https://formspree.io/f/mediabay3@gmail.com' // Fallback endpoint
        };
        
        this.autoSaveData = {};
        this.validationRules = {};
        this.submitAttempts = {};
        this.rateLimits = new Map();
        
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmissions();
        this.setupHoneypotProtection();
        this.setupFormEnhancements();
        this.setupAutoSave();
        this.setupPaymentIntegration();
        this.setupNewsletterIntegration();
        this.setupAuthForms();
        this.setupFeedbackSystem();
        this.initializeEmailJS();
        this.addFormStyles();
        this.setupRateLimiting();
        this.setupSecurityFeatures();
        
        console.log('MediaBay Advanced Form Handler initialized');
    }

    // Auto-Save Functionality
    setupAutoSave() {
        const autoSaveForms = document.querySelectorAll('form[data-autosave], .contact-form, .auth-form');
        
        autoSaveForms.forEach(form => {
            const formId = form.id || 'form_' + Date.now();
            const inputs = form.querySelectorAll('input, textarea, select');
            
            // Load saved data
            this.loadAutoSavedData(formId, inputs);
            
            // Save on input with debouncing
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
            if (key !== 'honeypot' && key !== 'csrf_token' && key !== 'password') {
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
                        if (data[input.name] && input.type !== 'password') {
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
        indicator.innerHTML = `
            <span class="indicator-icon">💾</span>
            <span class="indicator-text">Auto-saved</span>
        `;
        indicator.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: #28a745;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        form.style.position = 'relative';
        form.appendChild(indicator);
    }

    showAutoSaveIndicator(form, status) {
        const indicator = form.querySelector('.autosave-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            
            if (status === 'saved') {
                indicator.style.background = '#28a745';
                indicator.querySelector('.indicator-text').textContent = 'Auto-saved';
            } else if (status === 'saving') {
                indicator.style.background = '#ffc107';
                indicator.querySelector('.indicator-text').textContent = 'Saving...';
            }
            
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 2000);
        }
    }

    showAutoSaveNotification(formId) {
        const notification = document.createElement('div');
        notification.className = 'autosave-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">💾</span>
                <span>We've restored your previous input</span>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Payment Integration
    setupPaymentIntegration() {
        const paymentForm = this.forms.payment;
        if (!paymentForm) return;
        
        // Payment method selection
        const paymentOptions = paymentForm.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.updatePaymentForm(option.dataset.method);
            });
        });
        
        // Payment form submission
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePaymentSubmission(paymentForm);
        });
        
        // Payment schedule options
        const scheduleOptions = paymentForm.querySelectorAll('input[name="paymentSchedule"]');
        scheduleOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updatePaymentSchedule(option.value);
            });
        });
        
        // Real-time payment validation
        const paymentInputs = paymentForm.querySelectorAll('input[data-payment]');
        paymentInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validatePaymentField(input);
            });
        });
    }

    updatePaymentForm(method) {
        const paymentDetails = document.getElementById('payment-details');
        
        switch (method) {
            case 'payfast':
                paymentDetails.innerHTML = this.getPayFastForm();
                break;
            case 'yoco':
                paymentDetails.innerHTML = this.getYocoForm();
                break;
            case 'bank':
                paymentDetails.innerHTML = this.getBankTransferForm();
                break;
            case 'crypto':
                paymentDetails.innerHTML = this.getCryptoForm();
                break;
            case 'card':
                paymentDetails.innerHTML = this.getCardForm();
                break;
        }
        
        // Re-initialize validation for new fields
        this.setupPaymentValidation();
    }

    getPayFastForm() {
        return `
            <div class="payment-method-form">
                <h4>PayFast Payment</h4>
                <p class="payment-description">Secure payment processing for South African businesses</p>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" name="payfast_email" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="payfast_phone" required>
                </div>
                <div class="security-info">
                    <span class="security-badge">🔒 SSL Secured</span>
                    <span class="security-badge">✅ PCI Compliant</span>
                </div>
            </div>
        `;
    }

    getYocoForm() {
        return `
            <div class="payment-method-form">
                <h4>Yoco Payment</h4>
                <p class="payment-description">Fast and secure card payments</p>
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" name="yoco_card" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" name="yoco_expiry" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" name="yoco_cvv" placeholder="123" maxlength="4" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" name="yoco_name" required>
                </div>
            </div>
        `;
    }

    getBankTransferForm() {
        return `
            <div class="payment-method-form">
                <h4>Bank Transfer</h4>
                <p class="payment-description">Direct bank transfer - manual verification required</p>
                <div class="bank-details">
                    <h5>MediaBay Banking Details:</h5>
                    <div class="bank-info">
                        <div class="bank-row">
                            <span class="label">Bank:</span>
                            <span class="value">First National Bank</span>
                        </div>
                        <div class="bank-row">
                            <span class="label">Account Name:</span>
                            <span class="value">MediaBay (Pty) Ltd</span>
                        </div>
                        <div class="bank-row">
                            <span class="label">Account Number:</span>
                            <span class="value">1234567890</span>
                        </div>
                        <div class="bank-row">
                            <span class="label">Branch Code:</span>
                            <span class="value">250655</span>
                        </div>
                        <div class="bank-row">
                            <span class="label">Reference:</span>
                            <span class="value" id="payment-reference">MB-${Date.now()}</span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Upload Proof of Payment</label>
                    <input type="file" name="payment_proof" accept=".pdf,.jpg,.jpeg,.png" required>
                </div>
            </div>
        `;
    }

    getCryptoForm() {
        return `
            <div class="payment-method-form">
                <h4>Cryptocurrency Payment</h4>
                <p class="payment-description">Pay with Bitcoin, Ethereum, or other cryptocurrencies</p>
                <div class="crypto-options">
                    <div class="crypto-option" data-crypto="btc">
                        <span class="crypto-icon">₿</span>
                        <span class="crypto-name">Bitcoin</span>
                    </div>
                    <div class="crypto-option" data-crypto="eth">
                        <span class="crypto-icon">Ξ</span>
                        <span class="crypto-name">Ethereum</span>
                    </div>
                    <div class="crypto-option" data-crypto="usdt">
                        <span class="crypto-icon">₮</span>
                        <span class="crypto-name">USDT</span>
                    </div>
                </div>
                <div class="crypto-address" id="crypto-address" style="display: none;">
                    <div class="address-info">
                        <label>Send payment to:</label>
                        <div class="address-display">
                            <input type="text" id="crypto-wallet" readonly>
                            <button type="button" onclick="copyToClipboard('crypto-wallet')">Copy</button>
                        </div>
                    </div>
                    <div class="qr-code">
                        <div id="crypto-qr"></div>
                    </div>
                </div>
            </div>
        `;
    }

    getCardForm() {
        return `
            <div class="payment-method-form">
                <h4>Credit/Debit Card</h4>
                <p class="payment-description">Secure card payment processing</p>
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" name="card_number" placeholder="1234 5678 9012 3456" maxlength="19" data-payment="card" required>
                    <div class="card-types">
                        <span class="card-type visa">VISA</span>
                        <span class="card-type mastercard">MasterCard</span>
                        <span class="card-type amex">AMEX</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" name="card_expiry" placeholder="MM/YY" maxlength="5" data-payment="expiry" required>
                    </div>
                    <div class="form-group">
                        <label>Security Code</label>
                        <input type="text" name="card_cvv" placeholder="123" maxlength="4" data-payment="cvv" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" name="card_name" data-payment="name" required>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="save_card" value="1">
                        Save card for future payments (secure)
                    </label>
                </div>
            </div>
        `;
    }

    validatePaymentField(input) {
        const type = input.dataset.payment;
        const value = input.value;
        
        switch (type) {
            case 'card':
                this.validateCardNumber(input);
                break;
            case 'expiry':
                this.validateExpiryDate(input);
                break;
            case 'cvv':
                this.validateCVV(input);
                break;
            case 'name':
                this.validateCardholderName(input);
                break;
        }
    }

    validateCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        
        // Format with spaces
        value = value.replace(/(.{4})/g, '$1 ').trim();
        input.value = value;
        
        // Validate using Luhn algorithm
        const cleanValue = value.replace(/\s/g, '');
        const isValid = this.luhnCheck(cleanValue);
        
        if (cleanValue.length >= 13 && isValid) {
            this.showFieldSuccess(input);
            this.detectCardType(cleanValue);
        } else if (cleanValue.length >= 13) {
            this.showFieldError(input, 'Invalid card number');
        } else {
            this.clearFieldValidation(input);
        }
    }

    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    detectCardType(cardNumber) {
        const cardTypes = document.querySelectorAll('.card-type');
        cardTypes.forEach(type => type.classList.remove('active'));
        
        if (cardNumber.startsWith('4')) {
            document.querySelector('.card-type.visa')?.classList.add('active');
        } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
            document.querySelector('.card-type.mastercard')?.classList.add('active');
        } else if (cardNumber.startsWith('3')) {
            document.querySelector('.card-type.amex')?.classList.add('active');
        }
    }

    validateExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
        
        if (value.length === 5) {
            const [month, year] = value.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            const expMonth = parseInt(month);
            const expYear = parseInt(year);
            
            if (expMonth < 1 || expMonth > 12) {
                this.showFieldError(input, 'Invalid month');
            } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                this.showFieldError(input, 'Card has expired');
            } else {
                this.showFieldSuccess(input);
            }
        }
    }

    validateCVV(input) {
        const value = input.value.replace(/\D/g, '');
        input.value = value;
        
        if (value.length >= 3 && value.length <= 4) {
            this.showFieldSuccess(input);
        } else if (value.length > 0) {
            this.showFieldError(input, 'Invalid security code');
        }
    }

    validateCardholderName(input) {
        const value = input.value.trim();
        
        if (value.length >= 2 && /^[a-zA-Z\s]+$/.test(value)) {
            this.showFieldSuccess(input);
        } else if (value.length > 0) {
            this.showFieldError(input, 'Enter valid cardholder name');
        }
    }

    handlePaymentSubmission(form) {
        const submitBtn = form.querySelector('.payment-btn');
        const selectedMethod = form.querySelector('.payment-option.selected');
        
        if (!selectedMethod) {
            this.showNotification('Please select a payment method', 'error');
            return;
        }
        
        // Show loading state
        this.setButtonLoading(submitBtn, true);
        
        // Validate all fields
        const isValid = this.validateForm(form);
        
        if (!isValid) {
            this.setButtonLoading(submitBtn, false);
            return;
        }
        
        // Process payment based on method
        const method = selectedMethod.dataset.method;
        this.processPayment(method, form).then(result => {
            if (result.success) {
                this.showPaymentSuccess(result);
                this.clearAutoSavedData(form.id);
            } else {
                this.showPaymentError(result.error);
            }
        }).catch(error => {
            this.showPaymentError('Payment processing failed. Please try again.');
            console.error('Payment error:', error);
        }).finally(() => {
            this.setButtonLoading(submitBtn, false);
        });
    }

    async processPayment(method, form) {
        const formData = new FormData(form);
        
        // Simulate payment processing
        await this.delay(2000 + Math.random() * 3000);
        
        // In a real implementation, this would integrate with actual payment gateways
        switch (method) {
            case 'payfast':
                return this.processPayFast(formData);
            case 'yoco':
                return this.processYoco(formData);
            case 'bank':
                return this.processBankTransfer(formData);
            case 'crypto':
                return this.processCrypto(formData);
            case 'card':
                return this.processCard(formData);
            default:
                return { success: false, error: 'Invalid payment method' };
        }
    }

    async processPayFast(formData) {
        // PayFast integration would go here
        return {
            success: true,
            transactionId: 'PF_' + Date.now(),
            method: 'PayFast',
            message: 'Payment processed successfully via PayFast'
        };
    }

    async processYoco(formData) {
        // Yoco integration would go here
        return {
            success: true,
            transactionId: 'YC_' + Date.now(),
            method: 'Yoco',
            message: 'Payment processed successfully via Yoco'
        };
    }

    async processBankTransfer(formData) {
        // Bank transfer processing
        return {
            success: true,
            transactionId: 'BT_' + Date.now(),
            method: 'Bank Transfer',
            message: 'Bank transfer details received. Payment will be verified within 24 hours.'
        };
    }

    async processCrypto(formData) {
        // Cryptocurrency processing
        return {
            success: true,
            transactionId: 'CR_' + Date.now(),
            method: 'Cryptocurrency',
            message: 'Cryptocurrency payment initiated. Please complete the transaction.'
        };
    }

    async processCard(formData) {
        // Card processing
        return {
            success: true,
            transactionId: 'CD_' + Date.now(),
            method: 'Credit Card',
            message: 'Card payment processed successfully'
        };
    }

    showPaymentSuccess(result) {
        const modal = document.createElement('div');
        modal.className = 'payment-success-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="success-icon">✅</div>
                <h3>Payment Successful!</h3>
                <p>${result.message}</p>
                <div class="transaction-details">
                    <div class="detail-row">
                        <span>Transaction ID:</span>
                        <span>${result.transactionId}</span>
                    </div>
                    <div class="detail-row">
                        <span>Method:</span>
                        <span>${result.method}</span>
                    </div>
                    <div class="detail-row">
                        <span>Date:</span>
                        <span>${new Date().toLocaleString()}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="downloadInvoice('${result.transactionId}')">Download Invoice</button>
                    <button class="btn-secondary" onclick="closeModal(this.closest('.payment-success-modal'))">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Global functions
        window.downloadInvoice = (transactionId) => {
            this.generateInvoice(transactionId);
        };
        
        window.closeModal = (modal) => {
            modal.remove();
        };
    }

    showPaymentError(error) {
        this.showNotification(error, 'error');
    }

    generateInvoice(transactionId) {
        // Generate PDF invoice
        const invoiceData = {
            transactionId: transactionId,
            date: new Date().toISOString(),
            company: 'MediaBay',
            amount: document.querySelector('#total-amount')?.textContent || 'R0.00'
        };
        
        // In a real implementation, this would generate a proper PDF
        const invoiceContent = `
            MediaBay Invoice
            
            Transaction ID: ${invoiceData.transactionId}
            Date: ${new Date(invoiceData.date).toLocaleDateString()}
            Amount: ${invoiceData.amount}
            
            Thank you for your business!
        `;
        
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MediaBay_Invoice_${transactionId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Newsletter Integration
    setupNewsletterIntegration() {
        const newsletterForms = document.querySelectorAll('.newsletter-form, #newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(form);
            });
        });
    }

    async handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            // Integrate with newsletter service (Mailchimp, Brevo, etc.)
            const result = await this.subscribeToNewsletter(email);
            
            if (result.success) {
                this.showNotification('Successfully subscribed to newsletter!', 'success');
                form.reset();
            } else {
                this.showNotification(result.error || 'Subscription failed', 'error');
            }
        } catch (error) {
            this.showNotification('Subscription failed. Please try again.', 'error');
            console.error('Newsletter subscription error:', error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async subscribeToNewsletter(email) {
        // Simulate API call
        await this.delay(1000);
        
        // In a real implementation, integrate with:
        // - Mailchimp API
        // - Brevo (Sendinblue) API
        // - ConvertKit API
        // - Custom newsletter service
        
        return {
            success: true,
            message: 'Subscribed successfully'
        };
    }

    // Authentication Forms
    setupAuthForms() {
        const loginForms = document.querySelectorAll('.login-form');
        const signupForms = document.querySelectorAll('.signup-form');
        
        loginForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                // Allow the main server-submitted login form to proceed normally
                if (form.id === 'login-form') return;

                e.preventDefault();
                this.handleLogin(form);
            });
        });
        
        signupForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(form);
            });
        });
        
        // Password strength indicator
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePasswordStrength(input);
            });
        });
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await this.authenticateUser(email, password);
            
            if (result.success) {
                this.showNotification('Login successful!', 'success');
                this.updateAuthUI(result.user);
                this.closeModal(form.closest('.auth-modal'));
            } else {
                this.showNotification(result.error || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleSignup(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!this.isPasswordStrong(password)) {
            this.showNotification('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await this.createUser(formData);
            
            if (result.success) {
                this.showNotification('Account created successfully!', 'success');
                this.updateAuthUI(result.user);
                this.closeModal(form.closest('.auth-modal'));
            } else {
                this.showNotification(result.error || 'Signup failed', 'error');
            }
        } catch (error) {
            this.showNotification('Signup failed. Please try again.', 'error');
            console.error('Signup error:', error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async authenticateUser(email, password) {
        // Simulate authentication
        await this.delay(1500);
        
        // In a real implementation, this would call your authentication API
        return {
            success: true,
            user: {
                id: Date.now(),
                email: email,
                name: email.split('@')[0],
                avatar: `https://ui-avatars.com/api/?name=${email}&background=E87A64&color=fff`
            },
            token: 'jwt_token_here'
        };
    }

    async createUser(formData) {
        // Simulate user creation
        await this.delay(2000);
        
        const email = formData.get('email');
        
        return {
            success: true,
            user: {
                id: Date.now(),
                email: email,
                name: formData.get('name') || email.split('@')[0],
                avatar: `https://ui-avatars.com/api/?name=${email}&background=E87A64&color=fff`
            },
            token: 'jwt_token_here'
        };
    }

    updatePasswordStrength(input) {
        const password = input.value;
        const strength = this.calculatePasswordStrength(password);
        
        let indicator = input.parentNode.querySelector('.password-strength');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'password-strength';
            input.parentNode.appendChild(indicator);
        }
        
        indicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill strength-${strength.level}" style="width: ${strength.percentage}%"></div>
            </div>
            <div class="strength-text">${strength.text}</div>
        `;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 25;
        if (/[a-z]/.test(password)) score += 12.5;
        if (/[A-Z]/.test(password)) score += 12.5;
        if (/[0-9]/.test(password)) score += 12.5;
        if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
        
        let level, text;
        if (score < 30) {
            level = 'weak';
            text = 'Weak';
        } else if (score < 60) {
            level = 'fair';
            text = 'Fair';
        } else if (score < 90) {
            level = 'good';
            text = 'Good';
        } else {
            level = 'strong';
            text = 'Strong';
        }
        
        return { percentage: score, level, text };
    }

    isPasswordStrong(password) {
        return password.length >= 8 &&
               /[a-z]/.test(password) &&
               /[A-Z]/.test(password) &&
               /[0-9]/.test(password);
    }

    updateAuthUI(user) {
        // Update navigation
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            userProfile.querySelector('#user-name').textContent = user.name;
            userProfile.querySelector('#user-email').textContent = user.email;
            userProfile.querySelector('#user-avatar').src = user.avatar;
        }
        
        // Store user data
        localStorage.setItem('mediabay_user', JSON.stringify(user));
        localStorage.setItem('mediabay_token', user.token);
    }

    // Feedback System
    setupFeedbackSystem() {
        const feedbackForms = document.querySelectorAll('.feedback-form, #feedback-form');
        
        feedbackForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFeedbackSubmission(form);
            });
            
            // Star rating
            const stars = form.querySelectorAll('.star-rating .star');
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    this.setStarRating(form, index + 1);
                });
                
                star.addEventListener('mouseover', () => {
                    this.highlightStars(form, index + 1);
                });
            });
            
            const starContainer = form.querySelector('.star-rating');
            if (starContainer) {
                starContainer.addEventListener('mouseleave', () => {
                    const rating = form.querySelector('input[name="rating"]').value;
                    this.highlightStars(form, parseInt(rating) || 0);
                });
            }
        });
    }

    setStarRating(form, rating) {
        const ratingInput = form.querySelector('input[name="rating"]');
        if (ratingInput) {
            ratingInput.value = rating;
        }
        
        this.highlightStars(form, rating);
    }

    highlightStars(form, rating) {
        const stars = form.querySelectorAll('.star-rating .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    async handleFeedbackSubmission(form) {
        const formData = new FormData(form);
        const rating = formData.get('rating');
        const comment = formData.get('comment');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!rating) {
            this.showNotification('Please select a rating', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await this.submitFeedback({
                rating: parseInt(rating),
                comment: comment,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });
            
            if (result.success) {
                this.showNotification('Thank you for your feedback!', 'success');
                form.reset();
                this.highlightStars(form, 0);
            } else {
                this.showNotification('Failed to submit feedback', 'error');
            }
        } catch (error) {
            this.showNotification('Failed to submit feedback', 'error');
            console.error('Feedback error:', error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async submitFeedback(feedbackData) {
        // Simulate feedback submission
        await this.delay(1000);
        
        // Store feedback locally (in a real app, send to server)
        const existingFeedback = JSON.parse(localStorage.getItem('mediabay_feedback') || '[]');
        existingFeedback.push(feedbackData);
        localStorage.setItem('mediabay_feedback', JSON.stringify(existingFeedback));
        
        return { success: true };
    }

    // Contact Form Handling
    setupFormSubmissions() {
        const contactForm = this.forms.contact;
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
        }
        
        // Setup other form submissions
        Object.values(this.forms).forEach(form => {
            if (form && form.nodeType === Node.ELEMENT_NODE) {
                form.addEventListener('submit', (e) => {
                    if (!e.defaultPrevented) {
                        this.logFormSubmission(form);
                    }
                });
            }
        });
    }

    async handleContactFormSubmission(form) {
        const submitBtn = form.querySelector('.submit-btn, button[type="submit"]');
        const formData = new FormData(form);
        
        // Check honeypot
        if (formData.get('honeypot')) {
            console.log('Bot detected via honeypot');
            return;
        }
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Check rate limiting
        if (!this.checkRateLimit('contact_form')) {
            this.showNotification('Too many submissions. Please wait before trying again.', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await this.sendEmail(formData);
            
            if (result.success) {
                this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
                this.clearAutoSavedData(form.id);
            } else {
                this.showNotification(result.error || 'Failed to send message', 'error');
            }
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
            console.error('Contact form error:', error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async sendEmail(formData) {
        // Simulate email sending
        await this.delay(2000);
        
        // In a real implementation, this would integrate with:
        // - EmailJS
        // - Formspree
        // - Netlify Forms
        // - Custom email API
        
        const emailData = {
            to: 'mediabay3@gmail.com',
            from: formData.get('email'),
            subject: `New Contact Form Submission - ${formData.get('projectType')}`,
            message: `
                Name: ${formData.get('fullName')}
                Email: ${formData.get('email')}
                Phone: ${formData.get('phone') || 'Not provided'}
                Project Type: ${formData.get('projectType')}
                Budget: ${formData.get('budget')}
                Message: ${formData.get('message')}
                
                Submitted: ${new Date().toLocaleString()}
            `
        };
        
        return { success: true };
    }

    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Clear existing errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if ((fieldType === 'email' || fieldName.includes('email')) && value) {
            if (!this.validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if ((fieldType === 'tel' || fieldName.includes('phone')) && value) {
            if (!this.validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Name validation
        if (fieldName.includes('name') || fieldName.includes('Name')) {
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        }

        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
        }

        // URL validation
        if (fieldType === 'url' && value) {
            if (!this.validateURL(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else if (value) {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);

        // Add shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        // Remove error message
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearFieldValidation(field) {
        field.classList.remove('error', 'success');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
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
                honeypot.style.cssText = 'position: absolute; left: -9999px; opacity: 0; pointer-events: none;';
                honeypot.tabIndex = -1;
                honeypot.autocomplete = 'off';
                
                form.appendChild(honeypot);
            }
        });
    }

    // Rate Limiting
    setupRateLimiting() {
        // Clear old rate limit data
        setInterval(() => {
            const now = Date.now();
            for (let [key, data] of this.rateLimits.entries()) {
                if (now - data.timestamp > 60000) { // 1 minute
                    this.rateLimits.delete(key);
                }
            }
        }, 60000);
    }

    checkRateLimit(action, limit = 5) {
        const key = `${action}_${this.getClientId()}`;
        const now = Date.now();
        
        if (!this.rateLimits.has(key)) {
            this.rateLimits.set(key, { count: 1, timestamp: now });
            return true;
        }
        
        const data = this.rateLimits.get(key);
        
        // Reset if more than 1 minute has passed
        if (now - data.timestamp > 60000) {
            this.rateLimits.set(key, { count: 1, timestamp: now });
            return true;
        }
        
        // Check if limit exceeded
        if (data.count >= limit) {
            return false;
        }
        
        // Increment count
        data.count++;
        return true;
    }

    getClientId() {
        let clientId = localStorage.getItem('mediabay_client_id');
        if (!clientId) {
            clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('mediabay_client_id', clientId);
        }
        return clientId;
    }

    // Security Features
    setupSecurityFeatures() {
        // Input sanitization on paste
        document.addEventListener('paste', (e) => {
            const target = e.target;
            if (target.matches('input, textarea')) {
                setTimeout(() => {
                    const type = this.getInputType(target);
                    target.value = this.sanitizeInput(target.value, type);
                }, 0);
            }
        });
        
        // Prevent form resubmission
        window.addEventListener('beforeunload', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && submitBtn.disabled) {
                    submitBtn.disabled = false;
                }
            });
        });
    }

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
                // Remove potentially dangerous content
                sanitized = sanitized
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .replace(/data:text\/html/gi, '');
                break;
        }

        return sanitized;
    }

    getInputType(input) {
        if (input.type === 'email' || input.name.includes('email')) return 'email';
        if (input.type === 'tel' || input.name.includes('phone')) return 'phone';
        if (input.name.includes('name') || input.name.includes('Name')) return 'name';
        return 'text';
    }

    // Email Integration
    initializeEmailJS() {
        // EmailJS would be initialized here
        // For now, we'll use a fallback method
        console.log('Email service initialized');
    }

    // Utility Functions
    setButtonLoading(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = `
                <span class="btn-loading">
                    <span class="spinner"></span>
                    Processing...
                </span>
            `;
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Submit';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    }

    clearAutoSavedData(formId) {
        localStorage.removeItem(`mediabay_autosave_${formId}`);
    }

    logFormSubmission(form) {
        const logData = {
            formId: form.id || 'unknown',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log('Form submission logged:', logData);
        
        // In a real implementation, send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                form_id: logData.formId,
                page_location: logData.url
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    // Form Enhancement Styles
    addFormStyles() {
        const styles = `
            <style>
                .error-message {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                
                .form-group input.error,
                .form-group textarea.error,
                .form-group select.error {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                }
                
                .form-group input.success,
                .form-group textarea.success,
                .form-group select.success {
                    border-color: #28a745;
                    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                .btn-loading {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .password-strength {
                    margin-top: 0.5rem;
                }
                
                .strength-bar {
                    height: 4px;
                    background: #e9ecef;
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .strength-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }
                
                .strength-weak { background: #dc3545; }
                .strength-fair { background: #ffc107; }
                .strength-good { background: #17a2b8; }
                .strength-strong { background: #28a745; }
                
                .strength-text {
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }
                
                .star-rating {
                    display: flex;
                    gap: 0.25rem;
                    margin: 0.5rem 0;
                }
                
                .star {
                    font-size: 1.5rem;
                    color: #ddd;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }
                
                .star:hover,
                .star.active {
                    color: #ffc107;
                }
                
                .card-types {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                
                .card-type {
                    padding: 0.25rem 0.5rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    opacity: 0.5;
                    transition: opacity 0.3s ease;
                }
                
                .card-type.active {
                    opacity: 1;
                    background: #E87A64;
                    color: white;
                }
                
                .character-count {
                    text-align: right;
                    font-size: 0.75rem;
                    color: #6c757d;
                    margin-top: 0.25rem;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize the form handler
document.addEventListener('DOMContentLoaded', () => {
    window.mediaBayFormHandler = new MediaBayFormHandler();
});