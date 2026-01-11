// Register Service Worker for PWA functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('MediaBay SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, show update notification
                                    showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch((registrationError) => {
                        console.log('MediaBay SW registration failed: ', registrationError);
                    });
            });
        }
        
        // Show update notification
        function showUpdateNotification() {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #132541;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
                font-family: 'Poppins', sans-serif;
            `;
            
            notification.innerHTML = `
                <div style="margin-bottom: 0.5rem; font-weight: 600;">Update Available</div>
                <div style="margin-bottom: 1rem; font-size: 0.9rem;">A new version of MediaBay is available.</div>
                <button onclick="window.location.reload()" style="
                    background: #E87A64;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 0.5rem;
                ">Update Now</button>
                <button onclick="this.parentElement.remove()" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                ">Later</button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }
        
        // Install prompt for PWA
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button after 30 seconds
            setTimeout(() => {
                showInstallPrompt();
            }, 30000);
        });
        
        function showInstallPrompt() {
            if (!deferredPrompt) return;
            
            const installPrompt = document.createElement('div');
            installPrompt.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #132541, #E87A64);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 320px;
                font-family: 'Poppins', sans-serif;
                animation: slideInLeft 0.5s ease-out;
            `;
            
            installPrompt.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <div style="font-size: 1.5rem; margin-right: 0.5rem;">📱</div>
                    <div style="font-weight: 600;">Install MediaBay App</div>
                </div>
                <div style="margin-bottom: 1rem; font-size: 0.9rem; opacity: 0.9;">
                    Get quick access to our services and quote estimator right from your home screen!
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="install-btn" style="
                        background: white;
                        color: #132541;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        flex: 1;
                    ">Install</button>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: transparent;
                        color: white;
                        border: 1px solid rgba(255,255,255,0.5);
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Not Now</button>
                </div>
            `;
            
            document.body.appendChild(installPrompt);
            
            // Handle install button click
            installPrompt.querySelector('#install-btn').addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to install prompt: ${outcome}`);
                    deferredPrompt = null;
                    installPrompt.remove();
                }
            });
            
            // Auto-remove after 15 seconds
            setTimeout(() => {
                if (installPrompt.parentElement) {
                    installPrompt.remove();
                }
            }, 15000);
        }
        
        // Add slide animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);