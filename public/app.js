class App {
    constructor() {
        this.currentView = 'home';
        this.language = 'English';
        this.weatherContext = 'Fetching weather...';
        
        this.initNavigation();
        this.initScanner();
        this.initChat();
        this.initWeather();
    }

    // --- Navigation ---
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navigateTo(item.dataset.target);
            });
        });

        document.getElementById('lang-toggle').addEventListener('click', () => {
            const langs = ['English', 'Telugu', 'Hindi'];
            let nextIndex = (langs.indexOf(this.language) + 1) % langs.length;
            this.language = langs[nextIndex];
            
            // Basic UI Translation Mock
            const greeting = document.querySelector('.greeting-section h1');
            const subGreeting = document.querySelector('.greeting-section p');
            if (this.language === 'Telugu') {
                greeting.innerHTML = `శుభోదయం, <span>రైతు</span> 👋`;
                subGreeting.innerText = `ఈ రోజు మీ పంటలను తనిఖీ చేద్దాం.`;
            } else if (this.language === 'Hindi') {
                greeting.innerHTML = `सुप्रभात, <span>किसान</span> 👋`;
                subGreeting.innerText = `आइए आज अपनी फसलों की जांच करें।`;
            } else {
                greeting.innerHTML = `Good morning, <span>Farmer</span> 👋`;
                subGreeting.innerText = `Let's check on your crops today.`;
            }
            alert(`Language switched to ${this.language}`);
        });
    }

    navigateTo(viewId) {
        // Update nav UI
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.target === viewId) item.classList.add('active');
            else item.classList.remove('active');
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            if (view.id === `view-${viewId}`) view.classList.add('active');
            else view.classList.remove('active');
        });

        this.currentView = viewId;
    }

    // --- Scanner (Image Detection) ---
    initScanner() {
        const frame = document.getElementById('camera-frame');
        const input = document.getElementById('image-input');
        const preview = document.getElementById('image-preview');
        const prompt = document.getElementById('upload-prompt');
        const btnAnalyze = document.getElementById('btn-analyze');
        const btnRetake = document.getElementById('btn-retake');
        
        this.imageBase64 = null;

        frame.addEventListener('click', () => {
            if (!this.imageBase64 && !document.getElementById('scanning-overlay').classList.contains('hidden') === false) {
                input.click();
            }
        });

        input.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageBase64 = e.target.result;
                    preview.src = this.imageBase64;
                    preview.classList.remove('hidden');
                    prompt.classList.add('hidden');
                    btnAnalyze.classList.remove('hidden');
                    btnRetake.classList.remove('hidden');
                    document.getElementById('results-card').classList.add('hidden');
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        btnRetake.addEventListener('click', (e) => {
            e.stopPropagation();
            this.imageBase64 = null;
            input.value = '';
            preview.classList.add('hidden');
            prompt.classList.remove('hidden');
            btnAnalyze.classList.add('hidden');
            btnRetake.classList.add('hidden');
            document.getElementById('results-card').classList.add('hidden');
        });

        btnAnalyze.addEventListener('click', () => this.analyzeImage());
    }

    async analyzeImage() {
        if (!this.imageBase64) return;

        const overlay = document.getElementById('scanning-overlay');
        const resultsCard = document.getElementById('results-card');
        const diseaseName = document.getElementById('disease-name');
        const assessmentText = document.getElementById('assessment-text');
        const recommendationText = document.getElementById('recommendation-text');
        
        overlay.classList.remove('hidden');
        resultsCard.classList.add('hidden');

        try {
            const prompt = `Analyze this crop/plant image. 
            Identify any disease, pest, or nutrient deficiency. 
            Return the response strictly in this JSON format:
            {
                "diseaseName": "Name of the issue or 'Healthy Plant'",
                "confidence": "Percentage (e.g. 92%)",
                "severity": "Low, Medium, High, or None",
                "assessment": "Brief description of the symptoms and cause",
                "recommendation": "Step-by-step actionable advice for the farmer"
            }`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: prompt,
                    imageBase64: this.imageBase64,
                    language: this.language
                })
            });

            const data = await response.json();
            
            overlay.classList.add('hidden');
            
            if (data.error) {
                alert("Error analyzing image: " + data.error);
                return;
            }

            // Attempt to parse JSON from the markdown response
            let aiResult = {
                diseaseName: "Analysis Complete",
                confidence: "N/A",
                severity: "Medium",
                assessment: "Could not parse detailed assessment.",
                recommendation: data.response
            };

            try {
                // Extract JSON if it's wrapped in markdown code blocks
                const jsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
                const startIdx = jsonStr.indexOf('{');
                const endIdx = jsonStr.lastIndexOf('}') + 1;
                if (startIdx >= 0 && endIdx > startIdx) {
                     aiResult = JSON.parse(jsonStr.substring(startIdx, endIdx));
                } else {
                     aiResult.recommendation = data.response; // Fallback to raw text
                }
            } catch(e) {
                console.warn("Failed to parse JSON response", e);
            }

            // Update UI
            diseaseName.innerText = aiResult.diseaseName;
            document.getElementById('result-confidence').innerText = aiResult.confidence + ' Confidence';
            assessmentText.innerText = aiResult.assessment;
            recommendationText.innerText = aiResult.recommendation;

            const badge = document.getElementById('result-badge');
            if (aiResult.severity.toLowerCase() === 'high') {
                badge.className = 'result-badge danger';
                badge.innerHTML = '<i class="ph-fill ph-warning-octagon"></i> Critical Action Required';
            } else if (aiResult.severity.toLowerCase() === 'medium') {
                badge.className = 'result-badge warning';
                badge.innerHTML = '<i class="ph-fill ph-warning"></i> Action Required';
            } else {
                badge.className = 'result-badge success';
                badge.innerHTML = '<i class="ph-fill ph-check-circle"></i> Looks Healthy';
            }

            resultsCard.classList.remove('hidden');

        } catch (error) {
            console.error("Error:", error);
            overlay.classList.add('hidden');
            alert("Failed to connect to the server.");
        }
    }

    // --- Chat Interface ---
    initChat() {
        const btnSend = document.getElementById('btn-send-chat');
        const input = document.getElementById('chat-input');

        btnSend.addEventListener('click', () => this.sendChatMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        this.appendMessage('user', message);

        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        this.appendMessage('ai', '...', typingId);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    language: this.language,
                    weatherContext: this.weatherContext
                })
            });

            const data = await response.json();
            
            // Remove typing indicator
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) typingMsg.remove();

            if (data.error) {
                this.appendMessage('ai', 'Sorry, I encountered an error. Please check your API key.');
            } else {
                this.appendMessage('ai', data.response);
            }

        } catch (error) {
            console.error("Error:", error);
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) typingMsg.remove();
            this.appendMessage('ai', 'Failed to connect to the server.');
        }
    }

    appendMessage(sender, text, id = null) {
        const container = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        if (id) msgDiv.id = id;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgDiv.innerHTML = `
            <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
            <span class="msg-time">${time}</span>
        `;
        
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    // --- Weather Integration ---
    async initWeather() {
        const tempEl = document.getElementById('weather-temp');
        const descEl = document.getElementById('weather-desc');
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                    const data = await res.json();
                    if(data.current_weather) {
                        const temp = Math.round(data.current_weather.temperature);
                        tempEl.innerText = `${temp}°C`;
                        descEl.innerText = `Wind speed: ${data.current_weather.windspeed} km/h`;
                        this.weatherContext = `${temp}°C, Wind ${data.current_weather.windspeed} km/h at Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`;
                    }
                } catch(e) {
                    console.error("Weather fetch error", e);
                }
            }, () => {
                console.log("Geolocation denied. Using default weather.");
                this.weatherContext = '28°C, Partly Cloudy, 65% Humidity';
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
