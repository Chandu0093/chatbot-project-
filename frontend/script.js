// // ===== CHATBOT APPLICATION =====
// class ChatbotApp {
//     constructor() {
//         // State variables
//         this.messages = [];
//         this.isLoading = false;
//         this.connectionStatus = 'checking';
        
//         // UI state
//         this.isDarkMode = false;
//         this.isMinimized = false;
//         this.showSettings = false;
//         this.showHistory = false;
        
//         // Settings
//         this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
//         this.backendUrl = "http://127.0.0.1:8081"

//         this.autoScroll = true;
        
//         // Chat history
//         this.chatHistory = [];
        
//         // DOM elements
//         this.elements = {};
        
//         // Initialize the application
//         this.init();
//     }
    
//     // ===== INITIALIZATION =====
//     init() {
//         this.initializeElements();
//         this.loadSettings();
//         this.attachEventListeners();
//         this.checkBackendConnection();
//         this.loadChatHistory();
//         this.updateWelcomeScreen();
        
//         // Initialize Lucide icons
//         if (typeof lucide !== 'undefined') {
//             lucide.createIcons();
//         }
//     }
    
//     initializeElements() {
//         // Get all DOM elements
//         this.elements = {
//             // Main containers
//             chatContainer: document.getElementById('chat-container'),
//             minimizedView: document.getElementById('minimized-view'),
            
//             // Header elements
//             statusIndicator: document.getElementById('status-indicator'),
//             statusText: document.getElementById('status-text'),
//             themeToggle: document.getElementById('theme-toggle'),
//             historyToggle: document.getElementById('history-toggle'),
//             settingsToggle: document.getElementById('settings-toggle'),
//             refreshBtn: document.getElementById('refresh-btn'),
//             minimizeBtn: document.getElementById('minimize-btn'),
//             maximizeBtn: document.getElementById('maximize-btn'),
            
//             // Panels
//             settingsPanel: document.getElementById('settings-panel'),
//             historyPanel: document.getElementById('history-panel'),
//             historyList: document.getElementById('history-list'),
            
//             // Settings inputs
//             userIdInput: document.getElementById('user-id-input'),
//             backendUrlInput: document.getElementById('backend-url-input'),
//             autoScrollCheckbox: document.getElementById('auto-scroll-checkbox'),
            
//             // Messages area
//             messagesArea: document.getElementById('messages-area'),
//             welcomeScreen: document.getElementById('welcome-screen'),
//             messagesList: document.getElementById('messages-list'),
//             loadingIndicator: document.getElementById('loading-indicator'),
//             messagesEnd: document.getElementById('messages-end'),
            
//             // Welcome screen elements
//             welcomeStatus: document.getElementById('welcome-status'),
//             welcomeUserId: document.getElementById('welcome-user-id'),
            
//             // Input area
//             messageInput: document.getElementById('message-input'),
//             sendBtn: document.getElementById('send-btn'),
//             clearChatBtn: document.getElementById('clear-chat-btn'),
//             exportChatBtn: document.getElementById('export-chat-btn'),
            
//             // Status bar
//             statusIcon: document.getElementById('status-icon'),
//             statusMessage: document.getElementById('status-message'),
//             messageCount: document.getElementById('message-count'),
            
//             // Toast
//             copyToast: document.getElementById('copy-toast')
//         };
//     }
    
//     loadSettings() {
//         const savedSettings = localStorage.getItem('chatbot_settings');
//         if (savedSettings) {
//             try {
//                 const settings = JSON.parse(savedSettings);
//                 this.isDarkMode = settings.isDarkMode || false;
//                 this.userId = settings.userId || this.userId;
//                 this.backendUrl = settings.backendUrl || this.backendUrl;
//                 this.autoScroll = settings.autoScroll !== undefined ? settings.autoScroll : true;
//             } catch (error) {
//                 console.error('Error loading settings:', error);
//             }
//         }
        
//         // Apply loaded settings
//         this.applyTheme();
//         this.updateSettingsInputs();
//     }
    
//     saveSettings() {
//         const settings = {
//             isDarkMode: this.isDarkMode,
//             userId: this.userId,
//             backendUrl: this.backendUrl,
//             autoScroll: this.autoScroll
//         };
//         localStorage.setItem('chatbot_settings', JSON.stringify(settings));
//     }
    
//     updateSettingsInputs() {
//         if (this.elements.userIdInput) this.elements.userIdInput.value = this.userId;
//         if (this.elements.backendUrlInput) this.elements.backendUrlInput.value = this.backendUrl;
//         if (this.elements.autoScrollCheckbox) this.elements.autoScrollCheckbox.checked = this.autoScroll;
//     }
    
//     // ===== EVENT LISTENERS =====
//     attachEventListeners() {
//         // Header controls
//         this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
//         this.elements.historyToggle?.addEventListener('click', () => this.toggleHistory());
//         this.elements.settingsToggle?.addEventListener('click', () => this.toggleSettings());
//         this.elements.refreshBtn?.addEventListener('click', () => this.checkBackendConnection());
//         this.elements.minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
//         this.elements.maximizeBtn?.addEventListener('click', () => this.toggleMinimize());
        
//         // Settings inputs
//         this.elements.userIdInput?.addEventListener('change', (e) => {
//             this.userId = e.target.value;
//             this.saveSettings();
//             this.updateWelcomeScreen();
//         });
        
//         this.elements.backendUrlInput?.addEventListener('change', (e) => {
//             this.backendUrl = e.target.value;
//             this.saveSettings();
//             this.checkBackendConnection();
//         });
        
//         this.elements.autoScrollCheckbox?.addEventListener('change', (e) => {
//             this.autoScroll = e.target.checked;
//             this.saveSettings();
//         });
        
//         // Message input
//         this.elements.messageInput?.addEventListener('keydown', (e) => this.handleKeyPress(e));
//         this.elements.messageInput?.addEventListener('input', () => this.autoResizeTextarea());
        
//         // Action buttons
//         this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
//         this.elements.clearChatBtn?.addEventListener('click', () => this.clearChat());
//         this.elements.exportChatBtn?.addEventListener('click', () => this.exportChat());
//     }
    
//     handleKeyPress(e) {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             this.sendMessage();
//         }
//     }
    
//     autoResizeTextarea() {
//         const textarea = this.elements.messageInput;
//         if (textarea) {
//             textarea.style.height = 'auto';
//             textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
//         }
//     }
    
//     // ===== THEME MANAGEMENT =====
//     toggleTheme() {
//         this.isDarkMode = !this.isDarkMode;
//         this.applyTheme();
//         this.saveSettings();
//     }
    
//     applyTheme() {
//         const body = document.body;
//         const themeIcon = this.elements.themeToggle?.querySelector('i');
        
//         if (this.isDarkMode) {
//             body.classList.add('dark-theme');
//             body.classList.remove('light-theme');
//             if (themeIcon) {
//                 themeIcon.setAttribute('data-lucide', 'sun');
//             }
//         } else {
//             body.classList.add('light-theme');
//             body.classList.remove('dark-theme');
//             if (themeIcon) {
//                 themeIcon.setAttribute('data-lucide', 'moon');
//             }
//         }
        
//         // Reinitialize icons if lucide is available
//         if (typeof lucide !== 'undefined') {
//             lucide.createIcons();
//         }
//     }
    
//     // ===== UI STATE MANAGEMENT =====
//     toggleMinimize() {
//         this.isMinimized = !this.isMinimized;
        
//         if (this.isMinimized) {
//             this.elements.chatContainer?.classList.add('hidden');
//             this.elements.minimizedView?.classList.remove('hidden');
//         } else {
//             this.elements.chatContainer?.classList.remove('hidden');
//             this.elements.minimizedView?.classList.add('hidden');
//             this.elements.messageInput?.focus();
//         }
//     }
    
//     toggleSettings() {
//         this.showSettings = !this.showSettings;
//         this.showHistory = false; // Close history if open
        
//         if (this.showSettings) {
//             this.elements.settingsPanel?.classList.remove('hidden');
//             this.elements.historyPanel?.classList.add('hidden');
//         } else {
//             this.elements.settingsPanel?.classList.add('hidden');
//         }
//     }
    
//     toggleHistory() {
//         this.showHistory = !this.showHistory;
//         this.showSettings = false; // Close settings if open
        
//         if (this.showHistory) {
//             this.elements.historyPanel?.classList.remove('hidden');
//             this.elements.settingsPanel?.classList.add('hidden');
//             this.loadChatHistory();
//         } else {
//             this.elements.historyPanel?.classList.add('hidden');
//         }
//     }
    
//     updateWelcomeScreen() {
//         if (this.elements.welcomeStatus) {
//             this.elements.welcomeStatus.textContent = this.connectionStatus;
//         }
//         if (this.elements.welcomeUserId) {
//             this.elements.welcomeUserId.textContent = this.userId;
//         }
//     }
    
//     // ===== CONNECTION MANAGEMENT =====
//     async checkBackendConnection() {
//         this.setConnectionStatus('checking');
        
//         try {
//             const response = await fetch(`${this.backendUrl}/health`);
//             if (response.ok) {
//                 this.setConnectionStatus('connected');
//             } else {
//                 this.setConnectionStatus('error');
//             }
//         } catch (error) {
//             console.error('Connection error:', error);
//             this.setConnectionStatus('error');
//         }
//     }
    
//     setConnectionStatus(status) {
//         this.connectionStatus = status;
        
//         // Update status indicator
//         if (this.elements.statusIndicator) {
//             this.elements.statusIndicator.className = `status-dot ${status}`;
//         }
        
//         // Update status text
//         const statusTexts = {
//             connected: 'Connected',
//             error: 'Connection Error',
//             checking: 'Checking...'
//         };
        
//         if (this.elements.statusText) {
//             this.elements.statusText.textContent = statusTexts[status];
//         }
        
//         // Update refresh button
//         if (this.elements.refreshBtn) {
//             if (status === 'checking') {
//                 this.elements.refreshBtn.classList.add('spin');
//             } else {
//                 this.elements.refreshBtn.classList.remove('spin');
//             }
//         }
        
//         // Update status bar
//         if (this.elements.statusIcon && this.elements.statusMessage) {
//             if (status === 'connected') {
//                 this.elements.statusIcon.setAttribute('data-lucide', 'check-circle');
//                 this.elements.statusMessage.textContent = 'Ready to chat';
//             } else {
//                 this.elements.statusIcon.setAttribute('data-lucide', 'alert-circle');
//                 this.elements.statusMessage.textContent = 'Connection issue';
//             }
//         }
        
//         // Update input state
//         this.updateInputState();
//         this.updateWelcomeScreen();
        
//         // Reinitialize icons
//         if (typeof lucide !== 'undefined') {
//             lucide.createIcons();
//         }
//     }
    
//     updateInputState() {
//         const isDisabled = this.connectionStatus !== 'connected' || this.isLoading;
        
//         if (this.elements.messageInput) {
//             this.elements.messageInput.disabled = isDisabled;
//             this.elements.messageInput.placeholder = this.connectionStatus === 'connected' 
//                 ? 'Type your message...' 
//                 : 'Check connection first...';
//         }
        
//         if (this.elements.sendBtn) {
//             this.elements.sendBtn.disabled = isDisabled || !this.elements.messageInput?.value.trim();
//         }
//     }
    
//     // ===== MESSAGE MANAGEMENT =====
//     async sendMessage() {
//         const messageText = this.elements.messageInput?.value.trim();
//         if (!messageText || this.isLoading || this.connectionStatus !== 'connected') {
//             return;
//         }
        
//         // Create user message
//         const userMessage = {
//             id: Date.now(),
//             text: messageText,
//             sender: 'user',
//             timestamp: new Date().toISOString(),
//             localTime: new Date().toLocaleTimeString()
//         };
        
//         // Add message to UI
//         this.addMessage(userMessage);
        
//         // Clear input
//         if (this.elements.messageInput) {
//             this.elements.messageInput.value = '';
//             this.autoResizeTextarea();
//         }
        
//         // Set loading state
//         this.setLoading(true);
        
//         try {
//             const response = await fetch(`${this.backendUrl}/api/chat`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     message: messageText,
//                     user_id: this.userId
//                 })
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 const botMessage = {
//                     id: Date.now() + 1,
//                     text: data.response || 'No response received',
//                     sender: 'bot',
//                     timestamp: new Date().toISOString(),
//                     localTime: new Date().toLocaleTimeString(),
//                     category: data.category,
//                     confidence: data.confidence
//                 };
                
//                 this.addMessage(botMessage);
                
//                 // Reload history after new message
//                 setTimeout(() => this.loadChatHistory(), 500);
//             } else {
//                 throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//             const errorMessage = {
//                 id: Date.now() + 1,
//                 text: `Sorry, I encountered an error: ${error.message}. Please check your connection and try again.`,
//                 sender: 'bot',
//                 timestamp: new Date().toISOString(),
//                 localTime: new Date().toLocaleTimeString(),
//                 isError: true
//             };
            
//             this.addMessage(errorMessage);
//         } finally {
//             this.setLoading(false);
//             this.elements.messageInput?.focus();
//         }
//     }
    
//     addMessage(message) {
//         this.messages.push(message);
//         this.renderMessage(message);
//         this.updateUI();
        
//         if (this.autoScroll) {
//             this.scrollToBottom();
//         }
//     }
    
//     renderMessage(message) {
//         if (!this.elements.messagesList) return;
        
//         // Hide welcome screen if this is the first message
//         if (this.messages.length === 1) {
//             this.elements.welcomeScreen?.classList.add('hidden');
//         }
        
//         const messageElement = document.createElement('div');
//         messageElement.className = `message ${message.sender}`;
//         messageElement.dataset.messageId = message.id;
        
//         let avatarHtml = '';
//         let bubbleClass = 'message-bubble';
        
//         if (message.sender === 'bot') {
//             avatarHtml = `
//                 <div class="message-avatar">
//                     <div class="bot-avatar">
//                         <i data-lucide="bot"></i>
//                     </div>
//                 </div>
//             `;
//             bubbleClass += message.isError ? ' error-message' : ' bot-message';
//         } else {
//             avatarHtml = `
//                 <div class="message-avatar">
//                     <div class="user-avatar">
//                         <i data-lucide="user"></i>
//                     </div>
//                 </div>
//             `;
//             bubbleClass += ' user-message';
//         }
        
//         let tagsHtml = '';
//         if (message.category || message.confidence) {
//             tagsHtml = '<div class="message-tags">';
//             if (message.category) {
//                 tagsHtml += `<span class="message-tag category">${message.category}</span>`;
//             }
//             if (message.confidence) {
//                 tagsHtml += `<span class="message-tag confidence">${Math.round(message.confidence * 100)}%</span>`;
//             }
//             tagsHtml += '</div>';
//         }
        
//         messageElement.innerHTML = `
//             ${message.sender === 'bot' ? avatarHtml : ''}
//             <div class="${bubbleClass}">
//                 <div class="message-text">${this.escapeHtml(message.text)}</div>
//                 <div class="message-meta">
//                     <div class="message-time">
//                         <i data-lucide="clock"></i>
//                         <span>${message.localTime}</span>
//                     </div>
//                     ${tagsHtml}
//                 </div>
//                 <button class="copy-btn" title="Copy message">
//                     <i data-lucide="copy"></i>
//                 </button>
//             </div>
//             ${message.sender === 'user' ? avatarHtml : ''}
//         `;
        
//         // Add copy functionality
//         const copyBtn = messageElement.querySelector('.copy-btn');
//         copyBtn?.addEventListener('click', () => this.copyMessage(message.text));
        
//         this.elements.messagesList.appendChild(messageElement);
        
//         // Reinitialize icons
//         if (typeof lucide !== 'undefined') {
//             lucide.createIcons();
//         }
//     }
    
//     copyMessage(text) {
//         navigator.clipboard.writeText(text).then(() => {
//             this.showCopyToast();
//         }).catch(err => {
//             console.error('Failed to copy message:', err);
//         });
//     }
    
//     showCopyToast() {
//         if (this.elements.copyToast) {
//             this.elements.copyToast.classList.remove('hidden');
//             setTimeout(() => {
//                 this.elements.copyToast?.classList.add('hidden');
//             }, 2000);
//         }
//     }
    
//     setLoading(loading) {
//         this.isLoading = loading;
        
//         if (this.elements.loadingIndicator) {
//             if (loading) {
//                 this.elements.loadingIndicator.classList.remove('hidden');
//             } else {
//                 this.elements.loadingIndicator.classList.add('hidden');
//             }
//         }
        
//         this.updateInputState();
        
//         if (loading && this.autoScroll) {
//             this.scrollToBottom();
//         }
//     }
    
//     clearChat() {
//         if (confirm('Are you sure you want to clear all messages?')) {
//             this.messages = [];
//             if (this.elements.messagesList) {
//                 this.elements.messagesList.innerHTML = '';
//             }
//             if (this.elements.welcomeScreen) {
//                 this.elements.welcomeScreen.classList.remove('hidden');
//             }
//             this.updateUI();
//         }
//     }
    
//     exportChat() {
//         if (this.messages.length === 0) return;
        
//         const chatData = {
//             userId: this.userId,
//             timestamp: new Date().toISOString(),
//             messages: this.messages.map(msg => ({
//                 sender: msg.sender,
//                 text: msg.text,
//                 timestamp: msg.timestamp,
//                 category: msg.category,
//                 confidence: msg.confidence
//             }))
//         };
        
//         const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     }
    
//     // ===== CHAT HISTORY =====
//     async loadChatHistory() {
//         try {
//             const response = await fetch(`${this.backendUrl}/api/history?user_id=${this.userId}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 this.chatHistory = data.history || [];
//                 this.renderChatHistory();
//             }
//         } catch (error) {
//             console.error('Failed to load chat history:', error);
//         }
//     }
    
//     renderChatHistory() {
//         if (!this.elements.historyList) return;
        
//         if (this.chatHistory.length === 0) {
//             this.elements.historyList.innerHTML = '<p class="no-history">No chat history found</p>';
//             return;
//         }
        
//         const historyHtml = this.chatHistory.slice(0, 5).map(chat => `
//             <div class="history-item">
//                 <div class="history-message">${this.escapeHtml(chat.message)}</div>
//                 <div class="history-time">${new Date(chat.timestamp).toLocaleString()}</div>
//             </div>
//         `).join('');
        
//         this.elements.historyList.innerHTML = historyHtml;
//     }
    
//     // ===== UTILITY FUNCTIONS =====
//     updateUI() {
//         // Update message count
//         if (this.elements.messageCount) {
//             this.elements.messageCount.textContent = `${this.messages.length} messages`;
//         }
        
//         // Update button states
//         const hasMessages = this.messages.length > 0;
//         if (this.elements.clearChatBtn) {
//             this.elements.clearChatBtn.disabled = !hasMessages;
//         }
//         if (this.elements.exportChatBtn) {
//             this.elements.exportChatBtn.disabled = !hasMessages;
//         }
        
//         // Update send button
//         this.updateInputState();
//     }
    
//     scrollToBottom() {
//         if (this.elements.messagesEnd) {
//             this.elements.messagesEnd.scrollIntoView({ behavior: 'smooth' });
//         }
//     }
    
//     escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML.replace(/\n/g, '<br>');
//     }
// }

// // ===== APPLICATION INITIALIZATION =====
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize the chatbot application
//     window.chatbot = new ChatbotApp();
    
//     // Add input event listener for send button state
//     const messageInput = document.getElementById('message-input');
//     if (messageInput) {
//         messageInput.addEventListener('input', () => {
//             window.chatbot.updateInputState();
//         });
//     }
// });



// Chatbot JavaScript Logic
class ChatbotApp {
    constructor() {
        // State variables
        this.messages = [];
        this.isLoading = false;
        this.connectionStatus = 'checking';
        this.isDarkMode = false;
        this.isMinimized = false;
        this.showSettings = false;
        this.showHistory = false;
        
        // Settings
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.backendUrl = 'http://127.0.0.1:8000';
        this.autoScroll = true;
        
        // Chat history
        this.chatHistory = [];
        
        // DOM elements
        this.elements = {};
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadSettings();
        this.checkBackendConnection();
        this.loadChatHistory();
    }
    
    bindElements() {
        // Main app elements
        this.elements.chatApp = document.getElementById('chat-app');
        this.elements.minimizedChat = document.getElementById('minimized-chat');
        
        // Header elements
        this.elements.statusIndicator = document.getElementById('status-indicator');
        this.elements.statusText = document.getElementById('status-text');
        this.elements.themeBtn = document.getElementById('theme-btn');
        this.elements.historyBtn = document.getElementById('history-btn');
        this.elements.settingsBtn = document.getElementById('settings-btn');
        this.elements.refreshBtn = document.getElementById('refresh-btn');
        this.elements.minimizeBtn = document.getElementById('minimize-btn');
        this.elements.maximizeBtn = document.getElementById('maximize-btn');
        
        // Panel elements
        this.elements.settingsPanel = document.getElementById('settings-panel');
        this.elements.historyPanel = document.getElementById('history-panel');
        this.elements.userIdInput = document.getElementById('user-id-input');
        this.elements.backendUrlInput = document.getElementById('backend-url-input');
        this.elements.autoScrollCheckbox = document.getElementById('auto-scroll-checkbox');
        this.elements.historyList = document.getElementById('history-list');
        
        // Messages elements
        this.elements.messagesContainer = document.getElementById('messages-container');
        this.elements.welcomeScreen = document.getElementById('welcome-screen');
        this.elements.messagesList = document.getElementById('messages-list');
        this.elements.loadingMessage = document.getElementById('loading-message');
        this.elements.messagesEnd = document.getElementById('messages-end');
        
        // Welcome screen elements
        this.elements.welcomeStatus = document.getElementById('welcome-status');
        this.elements.welcomeUserId = document.getElementById('welcome-user-id');
        
        // Input elements
        this.elements.messageInput = document.getElementById('message-input');
        this.elements.sendBtn = document.getElementById('send-btn');
        this.elements.clearBtn = document.getElementById('clear-btn');
        this.elements.exportBtn = document.getElementById('export-btn');
        
        // Status elements
        this.elements.connectionInfo = document.getElementById('connection-info');
        this.elements.messageCount = document.getElementById('message-count');
        
        // Toast container
        this.elements.toastContainer = document.getElementById('toast-container');
    }
    
    bindEvents() {
        // Header button events
        this.elements.themeBtn.addEventListener('click', () => this.toggleTheme());
        this.elements.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.elements.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.elements.refreshBtn.addEventListener('click', () => this.checkBackendConnection());
        this.elements.minimizeBtn.addEventListener('click', () => this.minimizeChat());
        this.elements.maximizeBtn.addEventListener('click', () => this.maximizeChat());
        
        // Settings events
        this.elements.userIdInput.addEventListener('input', (e) => {
            this.userId = e.target.value;
            this.saveSettings();
            this.updateWelcomeScreen();
        });
        
        this.elements.backendUrlInput.addEventListener('input', (e) => {
            this.backendUrl = e.target.value;
            this.saveSettings();
        });
        
        this.elements.autoScrollCheckbox.addEventListener('change', (e) => {
            this.autoScroll = e.target.checked;
            this.saveSettings();
        });
        
        // Input events
        this.elements.messageInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.elements.messageInput.addEventListener('input', () => this.adjustTextareaHeight());
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        this.elements.clearBtn.addEventListener('click', () => this.clearChat());
        this.elements.exportBtn.addEventListener('click', () => this.exportChat());
        
        // Auto-resize textarea
        this.adjustTextareaHeight();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('chatbot_settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.isDarkMode = settings.isDarkMode || false;
                this.userId = settings.userId || this.userId;
                this.backendUrl = settings.backendUrl || this.backendUrl;
                this.autoScroll = settings.autoScroll !== false;
                
                // Apply theme
                if (this.isDarkMode) {
                    document.body.classList.add('dark');
                    this.elements.themeBtn.textContent = '☀️';
                }
                
                // Update input values
                this.elements.userIdInput.value = this.userId;
                this.elements.backendUrlInput.value = this.backendUrl;
                this.elements.autoScrollCheckbox.checked = this.autoScroll;
                
                this.updateWelcomeScreen();
                
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
        
        // Initialize welcome screen
        this.updateWelcomeScreen();
    }
    
    saveSettings() {
        const settings = {
            isDarkMode: this.isDarkMode,
            userId: this.userId,
            backendUrl: this.backendUrl,
            autoScroll: this.autoScroll
        };
        localStorage.setItem('chatbot_settings', JSON.stringify(settings));
    }
    
    updateWelcomeScreen() {
        if (this.elements.welcomeUserId) {
            this.elements.welcomeUserId.textContent = this.userId;
        }
        if (this.elements.welcomeStatus) {
            this.elements.welcomeStatus.textContent = this.connectionStatus;
        }
    }
    
    async checkBackendConnection() {
        try {
            this.connectionStatus = 'checking';
            this.updateConnectionStatus();
            
            const response = await fetch(`${this.backendUrl}/health`);
            if (response.ok) {
                this.connectionStatus = 'connected';
                this.showToast('Connected to backend successfully', 'success');
            } else {
                this.connectionStatus = 'error';
                this.showToast('Backend connection failed', 'error');
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.connectionStatus = 'error';
            this.showToast('Unable to connect to backend', 'error');
        } finally {
            this.updateConnectionStatus();
            this.updateWelcomeScreen();
        }
    }
    
    updateConnectionStatus() {
        // Update status indicator
        this.elements.statusIndicator.className = `status-dot status-${this.connectionStatus}`;
        
        // Update status text
        const statusTexts = {
            connected: 'Connected',
            error: 'Connection Error',
            checking: 'Checking...'
        };
        this.elements.statusText.textContent = statusTexts[this.connectionStatus];
        
        // Update connection info
        const connectionInfos = {
            connected: '✅ Ready to chat',
            error: '⚠️ Connection issue',
            checking: '🔄 Checking connection...'
        };
        this.elements.connectionInfo.textContent = connectionInfos[this.connectionStatus];
        
        // Update input state
        const isConnected = this.connectionStatus === 'connected';
        this.elements.messageInput.disabled = !isConnected || this.isLoading;
        this.elements.sendBtn.disabled = !isConnected || this.isLoading;
        
        if (isConnected) {
            this.elements.messageInput.placeholder = 'Type your message...';
        } else {
            this.elements.messageInput.placeholder = 'Check connection first...';
        }
    }
    
    async loadChatHistory() {
        try {
            const response = await fetch(`${this.backendUrl}/api/history?user_id=${this.userId}`);
            if (response.ok) {
                const data = await response.json();
                this.chatHistory = data.history || [];
                this.updateHistoryPanel();
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }
    
    updateHistoryPanel() {
        if (this.chatHistory.length === 0) {
            this.elements.historyList.innerHTML = '<p class="no-history">No chat history found</p>';
        } else {
            const historyHTML = this.chatHistory.slice(0, 5).map(chat => `
                <div class="history-item">
                    <div class="history-message">${this.escapeHtml(chat.user_message || chat.message || 'Message')}</div>
                    <div class="history-time">${new Date(chat.created_at || chat.timestamp).toLocaleString()}</div>
                </div>
            `).join('');
            this.elements.historyList.innerHTML = historyHTML;
        }
    }
    
    async sendMessage() {
        const messageText = this.elements.messageInput.value.trim();
        if (!messageText || this.isLoading || this.connectionStatus !== 'connected') return;
        
        // Create user message
        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date().toISOString(),
            localTime: new Date().toLocaleTimeString()
        };
        
        // Add user message to UI
        this.addMessage(userMessage);
        this.elements.messageInput.value = '';
        this.adjustTextareaHeight();
        
        // Show loading
        this.setLoading(true);
        
        try {
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    user_id: this.userId
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.response || 'No response received',
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    localTime: new Date().toLocaleTimeString(),
                    category: data.category,
                    confidence: data.confidence
                };
                
                this.addMessage(botMessage);
                
                // Reload history after new message
                setTimeout(() => this.loadChatHistory(), 500);
                
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: `Sorry, I encountered an error: ${error.message}. Please check your connection and try again.`,
                sender: 'bot',
                timestamp: new Date().toISOString(),
                localTime: new Date().toLocaleTimeString(),
                isError: true
            };
            
            this.addMessage(errorMessage);
            this.showToast('Failed to send message', 'error');
        } finally {
            this.setLoading(false);
            this.elements.messageInput.focus();
        }
    }
    
    addMessage(message) {
        this.messages.push(message);
        
        // Hide welcome screen if this is the first message
        if (this.messages.length === 1) {
            this.elements.welcomeScreen.style.display = 'none';
            this.elements.messagesList.style.display = 'flex';
        }
        
        // Create message HTML
        const messageHTML = this.createMessageHTML(message);
        this.elements.messagesList.insertAdjacentHTML('beforeend', messageHTML);
        
        // Update message count
        this.elements.messageCount.textContent = `${this.messages.length} messages`;
        
        // Update clear/export button states
        this.elements.clearBtn.disabled = this.messages.length === 0;
        this.elements.exportBtn.disabled = this.messages.length === 0;
        
        // Auto-scroll
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }
    
    createMessageHTML(message) {
        const isUser = message.sender === 'user';
        const bubbleClass = isUser ? 'user-bubble' : (message.isError ? 'error-bubble' : 'bot-bubble');
        const rowClass = isUser ? 'user-message' : 'bot-message';
        
        const avatarIcon = isUser ? '👤' : '🤖';
        
        const badges = [];
        if (message.category) {
            badges.push(`<span class="badge">${this.escapeHtml(message.category)}</span>`);
        }
        if (message.confidence) {
            badges.push(`<span class="badge confidence">${Math.round(message.confidence * 100)}%</span>`);
        }
        
        return `
            <div class="message-row ${rowClass}" data-message-id="${message.id}">
                <div class="message-avatar">${avatarIcon}</div>
                <div class="message-bubble ${bubbleClass}">
                    <div class="message-content">${this.escapeHtml(message.text)}</div>
                    <div class="message-meta">
                        <div class="message-time">
                            🕐 <span>${message.localTime}</span>
                        </div>
                        <div class="message-badges">
                            ${badges.join('')}
                        </div>
                    </div>
                    <button class="copy-btn" onclick="chatbot.copyMessage(\`${this.escapeHtml(message.text).replace(/`/g, '\\`')}\`, ${message.id})" title="Copy message">
                        📋
                    </button>
                </div>
            </div>
        `;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.elements.loadingMessage.classList.remove('hidden');
        } else {
            this.elements.loadingMessage.classList.add('hidden');
        }
        
        // Update input states
        this.elements.messageInput.disabled = loading || this.connectionStatus !== 'connected';
        this.elements.sendBtn.disabled = loading || this.connectionStatus !== 'connected';
        
        // Auto-scroll when loading starts
        if (loading && this.autoScroll) {
            this.scrollToBottom();
        }
    }
    
    scrollToBottom() {
        this.elements.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
    
    clearChat() {
        if (this.messages.length === 0) return;
        
        if (confirm('Are you sure you want to clear all messages?')) {
            this.messages = [];
            this.elements.messagesList.innerHTML = '';
            this.elements.welcomeScreen.style.display = 'flex';
            this.elements.messagesList.style.display = 'none';
            
            // Update UI
            this.elements.messageCount.textContent = '0 messages';
            this.elements.clearBtn.disabled = true;
            this.elements.exportBtn.disabled = true;
            
            this.showToast('Chat cleared', 'info');
        }
    }
    
    exportChat() {
        if (this.messages.length === 0) return;
        
        const chatData = {
            userId: this.userId,
            exportTimestamp: new Date().toISOString(),
            messageCount: this.messages.length,
            messages: this.messages.map(msg => ({
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp,
                category: msg.category,
                confidence: msg.confidence
            }))
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Chat exported successfully', 'success');
    }
    
    copyMessage(text, messageId) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Message copied to clipboard', 'success');
        }).catch(err => {
            console.error('Failed to copy message:', err);
            this.showToast('Failed to copy message', 'error');
        });
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark', this.isDarkMode);
        
        this.elements.themeBtn.textContent = this.isDarkMode ? '☀️' : '🌙';
        
        this.saveSettings();
        
        this.showToast(`Switched to ${this.isDarkMode ? 'dark' : 'light'} theme`, 'info');
    }
    
    toggleSettings() {
        this.showSettings = !this.showSettings;
        this.elements.settingsPanel.classList.toggle('hidden', !this.showSettings);
        
        // Hide history panel if settings is being shown
        if (this.showSettings && this.showHistory) {
            this.showHistory = false;
            this.elements.historyPanel.classList.add('hidden');
        }
    }
    
    toggleHistory() {
        this.showHistory = !this.showHistory;
        this.elements.historyPanel.classList.toggle('hidden', !this.showHistory);
        
        // Hide settings panel if history is being shown
        if (this.showHistory && this.showSettings) {
            this.showSettings = false;
            this.elements.settingsPanel.classList.add('hidden');
        }
        
        // Load history when panel is opened
        if (this.showHistory) {
            this.loadChatHistory();
        }
    }
    
    minimizeChat() {
        this.isMinimized = true;
        this.elements.chatApp.classList.add('hidden');
        this.elements.minimizedChat.classList.remove('hidden');
    }
    
    maximizeChat() {
        this.isMinimized = false;
        this.elements.chatApp.classList.remove('hidden');
        this.elements.minimizedChat.classList.add('hidden');
        
        // Focus on input
        this.elements.messageInput.focus();
    }
    
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
    
    adjustTextareaHeight() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        
        const minHeight = 48;
        const maxHeight = 120;
        const scrollHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        
        textarea.style.height = scrollHeight + 'px';
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chatbot app
let chatbot;

document.addEventListener('DOMContentLoaded', () => {
    chatbot = new ChatbotApp();
});