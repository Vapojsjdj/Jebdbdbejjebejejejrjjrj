// Download verification and handling
import { config } from './config.js';
import { ChatUtilities } from './chat-utilities.js';

export class DownloadHandler {
    constructor() {
        this.downloadLink = document.getElementById('download-link');
        this.downloadButtonContainer = document.getElementById('download-button-container');
        this.downloadWarning = document.getElementById('download-warning');
        this.downloadContainer = document.getElementById('download-container');
        this.verificationSuccess = document.createElement('div');
        this.verificationSuccess.className = 'verification-success';
        this.monitoringControls = document.querySelector('.monitoring-controls');
        
        // Set up verification success element and add to DOM
        document.querySelector('.verification-container').insertBefore(
            this.verificationSuccess, 
            document.getElementById('download-container')
        );
        
        // Initially hide download button until verified
        this.downloadButtonContainer.style.display = 'none';
        this.downloadLink.classList.add('disabled');
        
        // Set download link from config
        this.downloadLink.href = config.DOWNLOAD_LINK;
    }
    
    showDownloadButton(isVerified) {
        // Show the download button container first
        this.downloadButtonContainer.style.display = 'block';
        
        // Then set its state (enabled or disabled)
        if (isVerified) {
            this.downloadLink.classList.remove('disabled');
            this.downloadWarning.style.display = 'none';
        } else {
            this.downloadLink.classList.add('disabled');
            this.downloadWarning.style.display = 'block';
        }
    }
    
    showVerificationSuccess(username, keyword) {
        // Show success message at the top
        this.verificationSuccess.style.display = 'block';
        
        // Format the success message
        const successMessage = {
            en: config.TRANSLATIONS.keywordFound.en.replace('{keyword}', keyword).replace('{user}', username),
            ar: config.TRANSLATIONS.keywordFound.ar.replace('{keyword}', keyword).replace('{user}', username)
        };
        
        // Show success message
        this.verificationSuccess.innerHTML = `
            <span class="en-text" style="color: #4caf50;"><i class="fas fa-check-circle"></i> ${successMessage.en}</span>
            <span class="ar-text" style="color: #4caf50;"><i class="fas fa-check-circle"></i> ${successMessage.ar}</span>
        `;
        
        // Hide monitoring controls
        if (this.monitoringControls) {
            this.monitoringControls.classList.add('hidden');
        }
        
        // Show the download container and enable the download button
        this.downloadContainer.style.display = 'block';
        this.downloadButtonContainer.style.display = 'block';
        this.downloadLink.classList.remove('disabled');
        this.downloadWarning.style.display = 'none';
        
        // Scroll to download container
        this.downloadContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Mark the final step as completed
        const downloadStep = document.querySelector('.step:nth-child(4)');
        if (downloadStep && !downloadStep.classList.contains('completed')) {
            downloadStep.classList.add('completed');
            
            // Add checkmark to the step
            const checkmark = document.createElement('span');
            checkmark.className = 'step-checkmark';
            checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
            downloadStep.appendChild(checkmark);
        }
    }
}