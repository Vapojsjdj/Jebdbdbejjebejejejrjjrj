import { config } from './config.js';
import { ChatUtils } from './utils.js';

export class YouTubeChatMonitor {
    constructor() {
        // DOM elements
        this.statusMessage = document.getElementById('status-message');
        this.loader = document.getElementById('loader');
        this.downloadContainer = document.getElementById('download-container');
        this.downloadLink = document.getElementById('download-link');
        this.downloadWarning = document.getElementById('download-warning');
        this.keywordDisplay = document.getElementById('keyword-display');
        this.conditionsContainer = document.getElementById('conditions-container');
        this.subscribeButton = document.getElementById('subscribe-button');
        this.checkChatButton = document.getElementById('check-chat-button'); // Reference the new button
        
        // Chat state
        this.liveChatId = null;
        this.seenMessages = [];
        this.monitoringInterval = null;
        this.targetUserFound = false;
        this.currentKeyword = '';
        this.foundMessages = new Set();
        this.claimedWords = new Map(); // Track claimed words and timestamps
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Set download link from config
        if (this.downloadLink) {
            this.downloadLink.href = config.DOWNLOAD_LINK;
        }
        
        // Generate initial random keyword
        this.generateRandomKeyword();
        
        // Update UI with bilingual text
        this.updateUIText();
        
        // *** Do NOT start monitoring automatically here ***
        // It will be started by script.js when the 'check-chat-button' is clicked.
    }
    
    initEventListeners() {
        // Removed refresh keyword button event listener since the button is removed
        // Add check button event listener, but it's handled in script.js now for orchestration
    }
    
    updateUIText() {
        // Update all UI elements with bilingual text
        // The document title and header title are removed as per previous instructions to simplify the UI.
        
        ChatUtils.updateBilingualElement(this.downloadLink,
            config.TRANSLATIONS.downloadFile.en,
            config.TRANSLATIONS.downloadFile.ar);
            
        ChatUtils.updateBilingualElement(this.subscribeButton,
            config.TRANSLATIONS.subscribeChannel.en,
            config.TRANSLATIONS.subscribeChannel.ar);

        // Update the check button text
        if (this.checkChatButton) {
            ChatUtils.updateBilingualElement(this.checkChatButton,
                `<i class="fas fa-search"></i> ${config.TRANSLATIONS.checkButton.en}`,
                `<i class="fas fa-search"></i> ${config.TRANSLATIONS.checkButton.ar}`
            );
        }
    }
    
    generateRandomKeyword() {
        const keywords = config.RANDOM_KEYWORDS;
        this.currentKeyword = keywords[Math.floor(Math.random() * keywords.length)];
        this.keywordDisplay.textContent = this.currentKeyword;
    }
    
    async startMonitoring() {
        // Disable the check button and update its text when monitoring starts
        if (this.checkChatButton) {
            this.checkChatButton.disabled = true;
            ChatUtils.updateBilingualElement(this.checkChatButton, 
                `<i class="fas fa-spinner fa-spin"></i> ${config.TRANSLATIONS.checking.en}`, 
                `<i class="fas fa-spinner fa-spin"></i> ${config.TRANSLATIONS.checking.ar}`);
        }

        const videoId = config.DEFAULT_VIDEO_ID.trim();
        
        if (!videoId) {
            this.updateStatus(config.TRANSLATIONS.invalidVideoId.en + ' | ' + config.TRANSLATIONS.invalidVideoId.ar, false);
            if (this.checkChatButton) this.checkChatButton.disabled = false;
            return;
        }
        
        this.updateStatus(config.TRANSLATIONS.connecting.en + ' | ' + config.TRANSLATIONS.connecting.ar, true);
        
        try {
            this.liveChatId = await this.getLiveChatId(videoId);
            
            if (this.liveChatId) {
                this.updateStatus(config.TRANSLATIONS.chatConnected.en + ' | ' + config.TRANSLATIONS.chatConnected.ar, true);
                // Clear any existing interval to prevent duplicates
                if (this.monitoringInterval) {
                    clearInterval(this.monitoringInterval);
                }
                this.monitoringInterval = setInterval(() => this.getChatMessages(), config.UPDATE_INTERVAL);
            } else {
                this.updateStatus(config.TRANSLATIONS.noChatFound.en + ' | ' + config.TRANSLATIONS.noChatFound.ar, false);
                if (this.checkChatButton) this.checkChatButton.disabled = false;
            }
        } catch (error) {
            console.error('Error starting monitoring:', error);
            this.updateStatus(config.TRANSLATIONS.errorOccurred.en + ' | ' + config.TRANSLATIONS.errorOccurred.ar + ' ' + error.message, false);
            if (this.checkChatButton) this.checkChatButton.disabled = false;
        }
    }
    
    updateStatus(message, isLoading) {
        this.statusMessage.textContent = message;
        this.loader.style.display = isLoading ? 'inline-block' : 'none';
        
        // Re-enable check button and restore text if not loading/successful after an error/failure
        if (!isLoading && this.checkChatButton && !this.targetUserFound) {
            this.checkChatButton.disabled = false;
            ChatUtils.updateBilingualElement(this.checkChatButton,
                `<i class="fas fa-search"></i> ${config.TRANSLATIONS.checkButton.en}`,
                `<i class="fas fa-search"></i> ${config.TRANSLATIONS.checkButton.ar}`
            );
        } else if (this.targetUserFound && this.checkChatButton) {
            // If user found, keep button disabled as monitoring is effectively complete
            this.checkChatButton.disabled = true;
            ChatUtils.updateBilingualElement(this.checkChatButton,
                `<i class="fas fa-check"></i> ${config.TRANSLATIONS.verified.en}`,
                `<i class="fas fa-check"></i> ${config.TRANSLATIONS.verified.ar}`
            );
        }
    }
    
    async getLiveChatId(videoId) {
        try {
            this.updateStatus(config.TRANSLATIONS.searching.en + ' | ' + config.TRANSLATIONS.searching.ar, true);
            
            // Always fetch the live chat ID from the YouTube API
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=liveStreamingDetails&key=${config.API_KEY}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            if (data.items && data.items.length > 0 && data.items[0].liveStreamingDetails && data.items[0].liveStreamingDetails.activeLiveChatId) {
                return data.items[0].liveStreamingDetails.activeLiveChatId;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching live chat ID:', error);
            throw error;
        }
    }
    
    async getChatMessages() {
        if (!this.liveChatId) return;
        
        // If target user already found, stop interval
        if (this.targetUserFound) {
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
                this.monitoringInterval = null;
            }
            return;
        }

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${this.liveChatId}&part=snippet,authorDetails&maxResults=200&key=${config.API_KEY}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            if (data.items && data.items.length > 0) {
                let newMessages = 0;
                let keywordFoundInNewBatch = false;
                let keywordAuthor = null;
                
                const currentTime = new Date().getTime();
                
                data.items.forEach(message => {
                    const messageId = message.id;
                    const username = message.authorDetails.displayName;
                    const messageText = message.snippet.displayMessage.toLowerCase();
                    const publishedAt = new Date(message.snippet.publishedAt).getTime();
                    
                    // Check if message is fresh (within the configured timeframe)
                    const messageAge = (currentTime - publishedAt) / 1000; // age in seconds
                    const isFreshMessage = messageAge <= config.MESSAGE_FRESHNESS_SECONDS;
                    
                    // Check if message has already been processed
                    if (!this.seenMessages.includes(messageId)) {
                        this.seenMessages.push(messageId);
                        
                        // Check if the keyword exists in the message
                        const isKeywordMatch = messageText.includes(this.currentKeyword.toLowerCase());

                        if (isKeywordMatch) {
                             // Mark the "Type the magic word" step as completed
                             const typeStep = document.querySelector('.step:nth-child(3)');
                             if (typeStep && !typeStep.classList.contains('completed')) {
                                 typeStep.classList.add('completed');
                                 
                                 // Add checkmark to the step
                                 const checkmark = document.createElement('span');
                                 checkmark.className = 'step-checkmark';
                                 checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
                                 typeStep.appendChild(checkmark);
                             }
                        }
                        
                        // Check if the word has already been claimed by someone else
                        const isWordClaimed = this.claimedWords.has(this.currentKeyword) && 
                                            this.claimedWords.get(this.currentKeyword).username !== username;
                        
                        // Check if the claim has expired (after MAX_CLAIM_TIME_SECONDS)
                        const claimData = this.claimedWords.get(this.currentKeyword);
                        const isClaimExpired = claimData && 
                                              ((currentTime - claimData.timestamp) / 1000 > config.MAX_CLAIM_TIME_SECONDS);
                        
                        // If claim expired, remove it
                        if (isClaimExpired) {
                            this.claimedWords.delete(this.currentKeyword);
                        }
                        
                        // Register first found message that contains the keyword if:
                        // - It contains the keyword
                        // - Target user not found yet
                        // - Message is not already found
                        // - Message is fresh
                        // - Word is not claimed or is claimed by this same user
                        if (isKeywordMatch && !this.targetUserFound && !this.foundMessages.has(messageId) && 
                            isFreshMessage && (!isWordClaimed || isClaimExpired)) {
                            
                            keywordFoundInNewBatch = true;
                            keywordAuthor = username;
                            this.foundMessages.add(messageId);
                            
                            // Mark this word as claimed by this user
                            this.claimedWords.set(this.currentKeyword, {
                                username: username,
                                timestamp: currentTime
                            });
                        }
                        // If message is found but too old
                        else if (isKeywordMatch && !this.targetUserFound && !this.foundMessages.has(messageId) && 
                                !isFreshMessage) {
                            this.downloadWarning.textContent = ChatUtils.formatBilingualMessage(
                                config.TRANSLATIONS.messageExpired.en, 
                                config.TRANSLATIONS.messageExpired.ar, {}).en; // Display English as a fallback if direction is not applied
                            this.downloadWarning.style.display = 'block';
                        }
                        // If message is found but word already claimed
                        else if (isKeywordMatch && !this.targetUserFound && !this.foundMessages.has(messageId) && 
                                isWordClaimed && !isClaimExpired) {
                            this.downloadWarning.textContent = ChatUtils.formatBilingualMessage(
                                config.TRANSLATIONS.claimedBy.en, 
                                config.TRANSLATIONS.claimedBy.ar, {}).en; // Display English as a fallback if direction is not applied
                            this.downloadWarning.style.display = 'block';
                        }
                        
                        newMessages++;
                    }
                });
                
                // Show download link and username if keyword is found
                if (keywordFoundInNewBatch && !this.targetUserFound) {
                    this.targetUserFound = true;
                    
                    // Update download message to include username
                    const formattedMessage = ChatUtils.formatBilingualMessage(
                        config.TRANSLATIONS.keywordFound.en,
                        config.TRANSLATIONS.keywordFound.ar,
                        { keyword: this.currentKeyword, user: keywordAuthor }
                    );
                    this.updateStatus(`${formattedMessage.en} | ${formattedMessage.ar}`, false);
                    
                    // Show verification success and download container
                    if (window.downloadHandler) {
                        window.downloadHandler.showVerificationSuccess(keywordAuthor, this.currentKeyword);
                    } else {
                        // Fallback if window.downloadHandler is not available
                        this.downloadContainer.classList.remove('download-incomplete');
                        this.downloadContainer.style.display = 'block';
                        this.downloadWarning.style.display = 'none';
                        this.downloadLink.classList.remove('disabled');
                    }
                    
                    // Stop monitoring once keyword is found
                    if (this.monitoringInterval) {
                        clearInterval(this.monitoringInterval);
                        this.monitoringInterval = null;
                    }
                } 
                // Show not found message if we haven't found the keyword yet
                else if (!this.targetUserFound) {
                    this.downloadContainer.classList.add('download-incomplete');
                    this.downloadWarning.style.display = 'block';
                    const keywordNotFoundMessage = ChatUtils.formatBilingualMessage(
                        config.TRANSLATIONS.keywordNotFound.en,
                        config.TRANSLATIONS.keywordNotFound.ar,
                        { keyword: this.currentKeyword }
                    );
                    this.downloadWarning.textContent = `${keywordNotFoundMessage.en} | ${keywordNotFoundMessage.ar}`;
                    this.updateStatus(config.TRANSLATIONS.noNewMessages.en + ' | ' + config.TRANSLATIONS.noNewMessages.ar, true);
                }
                
                // Limit the number of stored message IDs to prevent memory issues
                if (this.seenMessages.length > config.MAX_CHAT_MESSAGES * 3) {
                    this.seenMessages = this.seenMessages.slice(-config.MAX_CHAT_MESSAGES * 2);
                }
                
                if (newMessages > 0 && !this.targetUserFound) {
                    const newMessagesText = ChatUtils.formatBilingualMessage(
                        config.TRANSLATIONS.newMessages.en,
                        config.TRANSLATIONS.newMessages.ar,
                        { count: newMessages }
                    );
                    this.updateStatus(`${newMessagesText.en} | ${newMessagesText.ar}`, true);
                } else if (!this.targetUserFound) { // Only update if keyword not found yet
                    this.updateStatus(config.TRANSLATIONS.noMessages.en + ' | ' + config.TRANSLATIONS.noMessages.ar, true);
                }
            } else if (!this.targetUserFound) { // Only update if keyword not found yet
                this.updateStatus(config.TRANSLATIONS.noMessages.en + ' | ' + config.TRANSLATIONS.noMessages.ar, true);
            }
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            this.updateStatus(config.TRANSLATIONS.errorOccurred.en + ' | ' + config.TRANSLATIONS.errorOccurred.ar + ' ' + error.message, true);
        }
    }
}