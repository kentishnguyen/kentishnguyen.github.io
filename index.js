const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to generate recipes
app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  // Initialize OpenAI with API key from .env
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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
    res.json({ recipes: reply });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});