// Main application script
import { config } from './config.js';
import { YouTubeChatMonitor } from './chat-monitor.js';
import { ChatUtils } from './utils.js';
import { ChatUtilities } from './chat-utilities.js';
import { DownloadHandler } from './download-handler.js';

// Global flag to track if ad has been shown
let adShown = false;
// Track clicks for each button to manage ad display
let buttonClicks = {
    mainDownload: 0, // Added for the main download button
    subscribe: 0,
    chat: 0
};

document.addEventListener('DOMContentLoaded', () => {
    // Set file information from config
    const fileNameEl = document.getElementById('file-name');
    const fileSizeEl = document.getElementById('file-size');
    if (fileNameEl) fileNameEl.textContent = config.FILE_NAME;
    if (fileSizeEl) fileSizeEl.textContent = config.FILE_SIZE;
    
    // Initialize download handler
    const downloadHandler = new DownloadHandler();
    window.downloadHandler = downloadHandler; // Make it available globally
    
    // Adjust page content to avoid scrolling
    adjustPageLayout();

    let chatMonitorInstance = null; // Declare a variable to hold the chat monitor instance

    // Initial download button click handler
    const mainDownloadBtn = document.getElementById('main-download-btn');
    if (mainDownloadBtn) {
        mainDownloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            buttonClicks.mainDownload++; // Increment click count for this button
            
            if (buttonClicks.mainDownload === 1) {
                // First click - show ad
                window.open(config.AD_DIRECT_LINK, '_blank');
                return; // Stop here for the first click
            }

            // Second click and beyond - proceed with intended action
            const initialContainer = document.getElementById('initial-download-container');
            const verificationContainer = document.getElementById('verification-container');
            
            if (initialContainer) initialContainer.style.display = 'none';
            if (verificationContainer) verificationContainer.style.display = 'block';
            
            // Initialize the monitor without auto-starting
            if (!chatMonitorInstance) {
                chatMonitorInstance = new YouTubeChatMonitor();
                window.chatMonitor = chatMonitorInstance; // Make it available if needed
            }

            // Set initial status message
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) {
                ChatUtils.updateBilingualElement(
                    statusMessage,
                    config.TRANSLATIONS.readyToMonitor.en,
                    config.TRANSLATIONS.readyToMonitor.ar
                );
            }
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none'; // Ensure loader is hidden initially
        });
    }
    
    // Copy keyword button - Always copies
    const copyKeywordBtn = document.getElementById('copy-keyword');
    if (copyKeywordBtn) {
        copyKeywordBtn.addEventListener('click', function() {
            const keywordDisplay = document.getElementById('keyword-display');
            if (!keywordDisplay) return;
            
            const keyword = keywordDisplay.textContent;
            ChatUtilities.copyToClipboard(keyword);
            
            // Visual feedback on button
            const oldText = this.innerHTML;
            ChatUtils.updateBilingualElement(this, 
                '<i class="fas fa-check"></i> Copied!', 
                '<i class="fas fa-check"></i> تم النسخ!');
                
            setTimeout(() => {
                this.innerHTML = oldText;
            }, 2000);
        });
    }

    // Subscribe button click handler - First click shows ad, second click opens YouTube
    const subscribeButton = document.getElementById('subscribe-button');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', function(e) {
            e.preventDefault();
            buttonClicks.subscribe++;
            
            if (buttonClicks.subscribe === 1) {
                // First click - show ad
                window.open(config.AD_DIRECT_LINK, '_blank');
                return; // Stop here for the first click
            }

            // Second click - open YouTube channel
            window.open(this.href, '_blank');
            
            // Show subscription verification progress
            const subscribeStep = document.querySelector('.step:nth-child(1)');
            if (subscribeStep) {
                const subscriptionProgress = document.createElement('div');
                subscriptionProgress.className = 'subscription-progress';
                subscriptionProgress.innerHTML = '<div class="subscription-bar"></div>';
                subscribeStep.appendChild(subscriptionProgress);
                
                subscriptionProgress.style.display = 'block';
                
                // Start progress animation
                setTimeout(() => {
                    const bar = subscriptionProgress.querySelector('.subscription-bar');
                    if (bar) bar.style.width = '100%';
                }, 100);
                
                // Simulate verification completion after 3 seconds
                setTimeout(() => {
                    // Mark step as completed
                    subscribeStep.classList.add('completed');
                    
                    // Add checkmark to the step
                    const checkmark = document.createElement('span');
                    checkmark.className = 'step-checkmark';
                    checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
                    subscribeStep.appendChild(checkmark);
                    
                    // Remove progress bar
                    setTimeout(() => {
                        subscriptionProgress.style.display = 'none';
                        
                        // Show chat button
                        const chatButtonContainer = document.querySelector('.chat-button-container');
                        if (chatButtonContainer) chatButtonContainer.style.display = 'block';
                        
                        // Show toast notification
                        ChatUtilities.showToast('Subscription verified successfully!');
                    }, 500);
                }, 3000);
            }
        });
    }
    
    // Chat button click handler - First click shows ad, second click opens YouTube chat
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', function(e) {
            e.preventDefault();
            buttonClicks.chat++;
            
            if (buttonClicks.chat === 1) {
                // First click - show ad
                window.open(config.AD_DIRECT_LINK, '_blank');
                return; // Stop here for the first click
            }

            // Second click - open YouTube chat
            window.open(this.href, '_blank');

            // Mark chat step as completed
            const chatStep = document.querySelector('.step:nth-child(2)');
            if (chatStep) {
                chatStep.classList.add('completed');
                
                // Add checkmark to the step
                const checkmark = document.createElement('span');
                checkmark.className = 'step-checkmark';
                checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
                chatStep.appendChild(checkmark);
            }
        });
    }

    // Check Chat button click handler - Always starts monitoring
    const checkChatButton = document.getElementById('check-chat-button');
    if (checkChatButton) {
        checkChatButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Start monitoring directly
            if (chatMonitorInstance) {
                chatMonitorInstance.startMonitoring();
            } else {
                // In case the monitor wasn't initialized by the main download button click
                chatMonitorInstance = new YouTubeChatMonitor();
                window.chatMonitor = chatMonitorInstance;
                chatMonitorInstance.startMonitoring();
            }
        });
    }
    
    // Function to adjust page layout
    function adjustPageLayout() {
        // Reduce padding and margins to make content fit without scrolling
        const container = document.querySelector('.container');
        if (container && window.innerHeight < 800) {
            container.style.padding = '10px';
            container.style.marginTop = '10px';
            container.style.marginBottom = '10px';
        }
        
        // Limit chat container height
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.maxHeight = '200px';
        }
    }
});