// Utility functions for YouTube Chat Monitor
export class ChatUtils {
    static updateBilingualElement(element, enText, arText) {
        element.innerHTML = `
            <span class="en-text">${enText}</span>
            <span class="ar-text">${arText}</span>
        `;
    }
    
    static formatBilingualMessage(enTemplate, arTemplate, replacements) {
        let enText = enTemplate;
        let arText = arTemplate;
        
        for (const [key, value] of Object.entries(replacements)) {
            enText = enText.replace(`{${key}}`, value);
            arText = arText.replace(`{${key}}`, value);
        }
        
        return {
            en: enText,
            ar: arText
        };
    }

    static formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        else return (bytes / 1073741824).toFixed(1) + ' GB';
    }

    static createFileIcon(extension) {
        // Return first letter of the extension in uppercase
        return extension.charAt(0).toUpperCase();
    }
}