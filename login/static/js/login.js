// static/js/login.js

const standardForm = document.getElementById('standard-login');
const biometricMfa = document.getElementById('biometric-mfa');
const faceAuth = document.getElementById('face-auth');
const fingerprintAuth = document.getElementById('fingerprint-auth');
const webcamStream = document.getElementById('webcam-stream');
const captureFaceBtn = document.getElementById('capture-face-btn');
const fingerprintBtn = document.getElementById('fingerprint-btn');
const messageElement = document.getElementById('message');
const mfaTitle = document.getElementById('mfa-title');

let currentUserId = null;
let stream = null;

// --- Helper Functions ---

function showMessage(text, isError = true) {
    messageElement.textContent = text;
    // Clears existing classes and sets new ones
    messageElement.className = `mt-4 text-center text-sm font-medium h-6 ${isError ? 'text-red-600' : 'text-green-600'}`;
}

function resetMFA() {
    biometricMfa.classList.add('hidden');
    faceAuth.classList.add('hidden');
    fingerprintAuth.classList.add('hidden');
    webcamStream.classList.add('hidden'); // Ensure video is hidden when not in use
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

async function startWebcam() {
    try {
        // Request access to the user's camera
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        webcamStream.srcObject = stream;
        
        // Wait for the video metadata to load
        await new Promise(resolve => webcamStream.onloadedmetadata = resolve); 
        
        webcamStream.play();
        
        // --- FIX APPLIED HERE: Show the video element ---
        webcamStream.classList.remove('hidden'); 
        showMessage('Webcam stream started successfully. Look at the camera.', false);

    } catch (err) {
        // Crucial Error Handling for browser security/permissions
        console.error("Webcam access error:", err.name, err);
        resetMFA(); // Stop the partially active login flow
        standardForm.classList.remove('hidden'); // Show password form again
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
             showMessage('Camera permission denied or blocked. Please access via HTTPS or localhost and grant permission.', true);
        } else {
             showMessage(`Webcam Error: ${err.name}. Please ensure you are using 'http://localhost:8000'.`, true);
        }
    }
}

// --- API Calls ---

async function submitStandardLogin(event) {
    event.preventDefault();
    showMessage('Verifying credentials...');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await response.json();

        if (!response.ok) {
            showMessage(data.detail || 'Login failed. Check username and password.', true);
            return;
        }

        currentUserId = data.user_id;

        if (data.access_token) {
            // Success for Soldier/Driver
            showMessage(`Welcome ${username}! Role: ${data.role}`, false);
            alert(`Login Success! Token: ${data.access_token}`);
            window.location.href = `/${data.role}_dashboard`; 
        } else if (data.next_step) {
            // Next step required (MFA)
            showMessage(`Password successful. Proceeding to ${data.next_step}...`, false);
            
            standardForm.classList.add('hidden');
            biometricMfa.classList.remove('hidden');
            
            if (data.next_step.includes('face')) {
                mfaTitle.textContent = 'Face Verification Required';
                faceAuth.classList.remove('hidden');
                startWebcam(); // Start the camera stream
            }
        }

    } catch (error) {
        showMessage('An unexpected network error occurred.', true);
        console.error(error);
    }
}


async function submitFaceCapture() {
    showMessage('Capturing face...');
    if (!stream) {
        showMessage('Webcam not active. Cannot capture. Try refreshing or check permissions.', true);
        return;
    }

    const canvas = document.getElementById('face-canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to capture the frame size
    canvas.width = webcamStream.videoWidth;
    canvas.height = webcamStream.videoHeight;
    context.drawImage(webcamStream, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        if (!blob) {
            showMessage('Failed to capture image.', true);
            return;
        }

        showMessage('Sending image for verification (Liveness/ID Check)...', false);

        const formData = new FormData();
        formData.append('user_id', currentUserId);
        formData.append('file', blob, 'face_capture.jpeg');

        try {
            const response = await fetch('/mfa/face_verify', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.detail || 'Face verification failed.', true);
                return;
            }

            if (data.access_token) {
                // Success for Officer
                resetMFA();
                showMessage(`Welcome ${currentUserId}! Role: ${data.role}`, false);
                alert(`Login Success! Token: ${data.access_token}`);
                window.location.href = `/${data.role}_dashboard`;
            } else if (data.next_step === 'mfa_fingerprint') {
                // Next step for Admin
                showMessage('Face verified. Proceeding to Fingerprint...', false);
                faceAuth.classList.add('hidden');
                mfaTitle.textContent = 'Fingerprint Verification Required';
                fingerprintAuth.classList.remove('hidden');
                resetMFA(); // Stop the webcam stream
            }

        } catch (error) {
            showMessage('An unexpected network error occurred during face verification.', true);
            console.error(error);
        }
    }, 'image/jpeg');
}

async function submitFingerprintScan() {
    showMessage('Initiating secure fingerprint scan...', false);

    try {
        const response = await fetch(`/mfa/fingerprint_verify?user_id=${currentUserId}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.detail || 'Fingerprint verification failed.', true);
            return;
        }

        // Final Success for Admin
        resetMFA();
        showMessage(`Welcome ${currentUserId} (Admin)!`, false);
        alert(`Login Success! Token: ${data.access_token}`);
        window.location.href = `/admin_dashboard`;

    } catch (error) {
        showMessage('An unexpected network error occurred during fingerprint verification.', true);
        console.error(error);
    }
}

// --- Event Listeners ---
standardForm.addEventListener('submit', submitStandardLogin);
captureFaceBtn.addEventListener('click', submitFaceCapture);
fingerprintBtn.addEventListener('click', submitFingerprintScan);

// Ensure the webcam stops if the user navigates away or closes the page
window.addEventListener('beforeunload', resetMFA);