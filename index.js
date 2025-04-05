const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Serve static files (like index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to generate recipes
app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  // Check if ingredients are provided
  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ error: 'Ingredients are required' });
  }

  // Initialize OpenAI client
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  const OpenAI = require('openai'); // You can still use the OpenAI SDK
  require('dotenv').config();
  
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY, // Change to XAI_API_KEY
    baseURL: 'https://api.x.ai/v1',  // Change to xAI's base URL
  });
  
  app.post('/get-recipes', async (req, res) => {
    const { ingredients } = req.body;
  
    if (!ingredients || ingredients.trim() === '') {
      return res.status(400).json({ error: 'Ingredients are required' });
    }
  
    try {
      console.log('Calling xAI Grok API with ingredients:', ingredients);
      const chatResponse = await client.chat.completions.create({
        model: 'grok-beta', // Use a Grok model (e.g., grok-beta, grok-2, or grok-2-mini when available)
        messages: [
          { role: 'system', content: 'You are a helpful assistant that suggests recipes based on ingredients.' },
          { role: 'user', content: `I have the following ingredients: ${ingredients}. What can I cook?` },
        ],
        temperature: 0.7,
      });
  
      const reply = chatResponse.choices[0].message.content;
      console.log('Grok response:', reply);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))});