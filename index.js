const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // Using OpenAI SDK for compatibility with xAI
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the xAI Grok client using OpenAI-compatible interface
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY, // Use your xAI API key
  baseURL: 'https://api.x.ai/v1',  // xAI API endpoint
});

// Handle POST request to generate recipes
app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  // Validate input
  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ error: 'Ingredients are required' });
  }

  // Check if API key is configured
  if (!process.env.XAI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing xAI API key' });
  }

  try {
    console.log('Calling xAI Grok API with ingredients:', ingredients); // Debug log
    const chatResponse = await client.chat.completions.create({
      model: 'grok-beta', // Use Grok model (e.g., grok-beta, adjust if needed)
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that suggests recipes based on ingredients.',
        },
        {
          role: 'user',
          content: `I have the following ingredients: ${ingredients}. What can I cook?`,
        },
      ],
      temperature: 0.7,
    });

    const reply = chatResponse.choices[0].message.content;
    console.log('Grok response:', reply); // Debug log
    res.json({ recipes: reply });
  } catch (error) {
    console.error('Error calling xAI Grok API:', error.message);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Quota exceeded. Please check your xAI plan.' });
    } else {
      res.status(500).json({ error: `Failed to generate recipes: ${error.message}` });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
