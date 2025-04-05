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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('Calling OpenAI with ingredients:', ingredients); // Debug log
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
    console.log('OpenAI response:', reply); // Debug log
    res.json({ recipes: reply });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message); // Log full error
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Quota exceeded. Please check your OpenAI plan.' });
    } else {
      res.status(500).json({ error: `Failed to generate recipes: ${error.message}` });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));