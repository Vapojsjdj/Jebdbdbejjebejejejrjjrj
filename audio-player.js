let audioContext;
let audioBuffer;
let sourceNode;
let gainNode; // Declare gainNode

const startAudio = async () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Check if context is suspended and try to resume
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    if (!audioBuffer) {
        try {
            const response = await fetch('ElevenLabs_2025-08-01T10_01_13_Liam_pre_sp100_s50_sb75_v3.mp3');
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading or decoding audio:', error);
            return;
        }
    }

    if (sourceNode && sourceNode.buffer) {
        return; 
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true; // Loop the audio
    
    // Create a GainNode for volume control
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.9; // Increased volume to 90%
    // Check if gainNode exists before trying to connect
    if (gainNode) {
        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
    } else {
        // Fallback to direct connection if gainNode wasn't created
        sourceNode.connect(audioContext.destination);
    }
    sourceNode.start(0); // Play immediately
    console.log('Audio started.');
};

// Event listener to start audio on first user interaction
document.body.addEventListener('click', startAudio, { once: true });
document.body.addEventListener('touchstart', startAudio, { once: true });

// Optional: Preload audio, but don't play until interaction
document.addEventListener('DOMContentLoaded', () => {
    // Initiate audio context and buffer loading early
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch('ElevenLabs_2025-08-01T10_01_13_Liam_pre_sp100_s50_sb75_v3.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            audioBuffer = buffer;
            console.log('Audio preloaded.');
        })
        .catch(error => console.error('Error preloading audio:', error));
});