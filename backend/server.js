// Load environment variables (your API key)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// 1. Changed: Import the new Google library
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Changed: Set up the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = 5001; // You can use any port

// Middleware
app.use(cors()); // Allow requests from your React frontend
app.use(express.json()); // Allow the server to understand JSON

// The main API endpoint
app.post('/chat', async (req, res) => {
  // Get the user's message from the request body
  const { message } = req.body;

  try {
    // 3. Changed: This is the new logic to call Gemini
    
    // Get the Gemini model
    // You can also use 'gemini-1.5-flash' for a faster response
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Send the message to the Gemini API
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 4. Changed: Send the extracted text back
    res.json({ reply: text });

  } catch (error) {
    // 5. Changed: Updated error message
    console.error('Error calling Gemini:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});