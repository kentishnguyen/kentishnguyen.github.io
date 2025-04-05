const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Handle POST request to generate recipes
app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  // Validate input
  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ error: 'Ingredients are required' });
  }

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing Gemini API key' });
  }

  try {
    console.log('Calling Gemini API with ingredients:', ingredients); // Debug log
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Use Gemini model

    const prompt = [
      {
        role: 'user',
        parts: [{ text: 'You are a helpful assistant that suggests recipes based on ingredients.' }],
      },
      {
        role: 'user',
        parts: [{ text: `I have the following ingredients: ${ingredients}. What can I cook?` }],
      },
    ];

    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    console.log('Gemini response:', reply); // Debug log
    res.json({ recipes: reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.status === 429) {
      res.status(429).json({ error: 'Quota exceeded. Please check your Gemini plan.' });
    } else {
      res.status(500).json({ error: `Failed to generate recipes: ${error.message}` });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
