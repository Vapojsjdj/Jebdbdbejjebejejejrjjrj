// Additional chat monitoring utilities
export class ChatUtilities {
    static getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString();
    }
    
    static generateUserIcon(username) {
        // Create a consistent color based on username
        const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 45%)`;
    }
    
    static createUserIcon(username) {
        const iconColor = this.generateUserIcon(username);
        const letter = username.charAt(0).toUpperCase();
        
        return `<div class="user-avatar" style="background-color: ${iconColor}">${letter}</div>`;
    }
    
    static formatChatMessage(message, isHighlighted) {
        const timeString = this.getFormattedTime();
        return `
            <div class="message-time">${timeString}</div>
            <div class="message-content ${isHighlighted ? 'highlighted-content' : ''}">
                ${message}
            </div>
        `;
    }

    static showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}