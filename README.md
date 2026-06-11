# AgriVision AI - Smart Farming Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

## 🌾 Overview

**AgriVision AI** is an intelligent agriculture platform powered by artificial intelligence to help farmers make informed decisions about crop management, disease detection, and farming practices. The application uses advanced AI models (via Groq) to provide real-time analysis and recommendations.

### Key Features
- 🤖 **AI-Powered Crop Disease Detection** - Upload crop images for instant disease identification
- 💬 **Multi-Language Support** - Get assistance in English, Hindi, and Telugu
- 🌦️ **Weather Integration** - Context-aware farming recommendations based on weather conditions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-Time Chat Interface** - Ask farming questions and get AI-powered responses
- 🔍 **Confidence Scoring** - Get detailed disease analysis with confidence levels

---

## 📋 Table of Contents
- [Getting Started](#-getting-started)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Technologies Used](#-technologies-used)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - For version control
- **Groq API Key** - Get it from [Groq Console](https://console.groq.com)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sampath-2006/Smart_agriAI.git
   cd AGRICULTURE_PLATFORM_AI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install the following dependencies:
   - `express` - Web framework
   - `cors` - Cross-Origin Resource Sharing
   - `dotenv` - Environment variable management
   - `groq-sdk` - Groq AI API client

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   PORT=3000
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000                          # Port number for the server (default: 3000)

# API Keys
GROQ_API_KEY=your_groq_api_key    # Your Groq API key for AI model access
```

### Port Configuration
By default, the server runs on **port 3000**. To use a different port:
```bash
PORT=8080 npm start
```

---

## 💻 Usage

### Starting the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Accessing the Application

1. Open your browser and navigate to: `http://localhost:3000`
2. You'll see the AgriVision AI home screen with:
   - Weather information
   - Quick action buttons
   - Chat interface
   - Disease detection tool

### Using the Features

#### 🖼️ Disease Detection
1. Click on the image upload button
2. Select a photo of your crop/plant
3. The AI will analyze the image and provide:
   - Disease name
   - Confidence level
   - Severity assessment
   - Treatment recommendations

#### 💬 Chat Interface
1. Type your farming question in the chat box
2. The AI will provide context-aware answers
3. Switch languages using the language toggle button

#### 🌐 Language Support
- **English** - Default language
- **Hindi** - हिंदी
- **Telugu** - తెలుగు

---

## 📁 Project Structure

```
AGRICULTURE_PLATFORM_AI/
├── server.js                 # Main Express server
├── list_models.js            # Model management utility
├── package.json              # Project dependencies and metadata
├── .env                       # Environment variables (create this)
├── .gitignore               # Git ignore rules
├── public/                   # Frontend files (served statically)
│   ├── index.html           # Main HTML file
│   ├── app.js               # Frontend JavaScript logic
│   ├── style.css            # Styling and UI components
│   └── [other assets]       # Images, icons, etc.
├── node_modules/            # Dependencies (auto-generated)
└── README.md                # This file
```

### File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Main backend server - handles API routes and Groq integration |
| `list_models.js` | Utility for managing AI models |
| `public/index.html` | Main frontend HTML structure |
| `public/app.js` | Frontend logic - handles UI interactions and API calls |
| `public/style.css` | Styling for responsive design |
| `.env` | Sensitive configuration (credentials, API keys) |
| `.gitignore` | Specifies files to exclude from git tracking |

---

## 🔌 API Endpoints

### Chat Endpoint
**POST** `/api/chat`

Send messages and images to the AI for analysis.

**Request Body:**
```json
{
  "message": "Is my crop healthy?",
  "imageBase64": "data:image/jpeg;base64,...",
  "language": "English",
  "weatherContext": "Partly Cloudy, 28°C"
}
```

**Response:**
```json
{
  "response": "Your crop appears healthy with no visible diseases..."
}
```

### Image Analysis Response Example:
```json
{
  "response": {
    "diseaseName": "Early Blight (Alternaria solani)",
    "confidence": "94%",
    "severity": "Medium",
    "assessment": "The leaf shows characteristic concentric dark rings...",
    "recommendation": "1. Remove affected leaves...\n2. Apply fungicide..."
  }
}
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Groq SDK** - AI model API integration
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Structure
- **CSS3** - Responsive styling
- **Vanilla JavaScript** - Interactivity
- **Phosphor Icons** - Icon library
- **Google Fonts (Outfit)** - Typography

### AI & APIs
- **Groq** - High-performance AI inference
- **Groq API** - LLM access for farming assistance

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. **Port Already in Use**
```bash
# Error: listen EADDRINUSE: address already in use :::3000
# Solution: Use a different port
PORT=3001 npm start
```

#### 2. **GROQ_API_KEY Not Found**
```
Error: GROQ_API_KEY environment variable not set
```
**Solution:**
- Create a `.env` file in the root directory
- Add your Groq API key: `GROQ_API_KEY=your_key_here`
- Restart the server

#### 3. **CORS Errors**
If you see CORS errors in the browser console:
- Ensure the server is running
- Check that requests are being made to `http://localhost:3000`
- The CORS middleware is already configured in `server.js`

#### 4. **Module Not Found**
```bash
# Error: Cannot find module 'express'
# Solution: Install dependencies
npm install
```

#### 5. **AI API Connection Issues**
- Verify your Groq API key is valid
- Check your internet connection
- Ensure the API key has the necessary permissions
- Check Groq API status

#### 6. **Image Upload Not Working**
- Ensure file size is under 10MB (limit in server.js)
- Try with different image formats (JPG, PNG)
- Check browser console for specific error messages

---

## 📊 Performance Tips

1. **Image Optimization** - Compress images before upload for faster processing
2. **Caching** - Browser automatically caches static assets
3. **API Limits** - Be mindful of Groq API rate limits
4. **Network** - Good internet connection ensures better responsiveness

---

## 🔒 Security Considerations

1. **Never commit `.env` file** - Keep API keys secret
2. **Use HTTPS in production** - For data encryption
3. **Validate inputs** - All user inputs are validated
4. **API Key Rotation** - Rotate API keys periodically
5. **Rate Limiting** - Consider implementing rate limiting for production

---

## 📈 Future Enhancements

- [ ] Soil health analysis
- [ ] Pest identification
- [ ] Yield prediction
- [ ] Weather forecasting integration
- [ ] Crop calendar recommendations
- [ ] Historical data tracking
- [ ] Multi-user authentication
- [ ] Database integration for user profiles

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- **Sampath Kumar** - [@sampath-2006](https://github.com/sampath-2006)

---

## 📧 Support & Contact

For support, issues, or suggestions:
- Open an issue on [GitHub](https://github.com/sampath-2006/Smart_agriAI/issues)
- Check existing documentation in the repository

---

## 🙏 Acknowledgments

- **Groq** - For providing powerful AI inference capabilities
- **Express.js Community** - For the excellent web framework
- **Phosphor Icons** - For beautiful icon library
- **Open Source Community** - For various libraries and tools

---

**Last Updated:** June 11, 2026  
**Version:** 1.0.0

---

### Quick Command Reference

```bash
# Install dependencies
npm install

# Start server
npm start

# Start in dev mode
npm run dev

# Remove node_modules from git tracking
git rm -r --cached node_modules

# Add to .gitignore and commit
git add .gitignore
git commit -m "Remove node_modules from tracking"
```

