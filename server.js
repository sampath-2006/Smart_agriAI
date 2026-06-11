import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, imageBase64, language, weatherContext } = req.body;

        // --- MOCK MODE: If API key is not configured ---
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
            console.log("Using mock response due to missing API key.");
            await new Promise(r => setTimeout(r, 1500)); // Simulate network delay
            
            if (imageBase64) {
                return res.json({
                    response: JSON.stringify({
                        diseaseName: "Early Blight (Alternaria solani)",
                        confidence: "94%",
                        severity: "Medium",
                        assessment: "The leaf shows characteristic concentric dark rings with a yellow halo. This is typical of Early Blight, a common fungal disease.",
                        recommendation: "1. Remove and destroy affected lower leaves.\n2. Apply a copper-based fungicide or Chlorothalonil according to label instructions.\n3. Ensure adequate spacing between plants to improve air circulation.\n4. Avoid overhead watering to keep foliage dry."
                    })
                });
            } else {
                let mockText = "Based on the " + (weatherContext || "current conditions") + ", ensure your crops get enough water. How else can I help you today?";
                if (language === 'Hindi') mockText = "वर्तमान स्थितियों के आधार पर, सुनिश्चित करें कि आपकी फसलों को पर्याप्त पानी मिले। मैं आज आपकी और कैसे मदद कर सकता हूँ?";
                if (language === 'Telugu') mockText = "ప్రస్తుత పరిస్థితుల ఆధారంగా, మీ పంటలకు తగినంత నీరు అందేలా చూసుకోండి. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?";
                return res.json({ response: mockText });
            }
        }
        // --- END MOCK MODE ---
        
        let systemPrompt = `You are an expert Agricultural and Environmental Advisor. 
Provide clear, actionable, and scientifically sound advice to farmers and rural workers. 
Keep your language simple, practical, and easy to understand.
If a situation is critical or beyond simple AI diagnosis (like severe contamination or complex diseases), clearly advise them to consult a local agricultural expert or extension office.`;

        if (language && language !== 'English') {
            systemPrompt += `\nCRITICAL: You MUST respond entirely in ${language}. Translate all technical terms accurately to ${language}.`;
        }

        if (weatherContext) {
            systemPrompt += `\nCurrent local weather conditions for the user: ${weatherContext}. Keep this weather context in mind for your advice.`;
        }

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        let content = [];
        if (message) {
            content.push({ type: "text", text: message });
        }
        if (imageBase64) {
             content.push({
                type: "image_url",
                image_url: {
                    url: imageBase64
                }
            });
        }
        
        if (content.length > 0) {
             messages.push({ role: "user", content: content });
        } else {
             return res.status(400).json({ error: "Message or image is required" });
        }

        // Use the vision model if an image is provided, otherwise standard llama-3
        const model = imageBase64 ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.1-8b-instant";

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: model,
            temperature: 0.5,
            max_tokens: 1024,
        });

        res.json({ response: chatCompletion.choices[0]?.message?.content || "No response generated." });

    } catch (error) {
        console.error("Error calling Groq API:", error);
        res.status(500).json({ error: "Failed to process the request. Please try again later." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
