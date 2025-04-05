const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to generate recipes
app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  // Initialize OpenAI with the API key from environment variables
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // Call the OpenAI API to get recipe suggestions
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

    // Extract the recipe suggestions from the API response
    const reply = chatResponse.choices[0].message.content;
    res.json({ recipes: reply });
  } catch (error) {
    // Log the error and send the specific error message to the client
    console.error('Error calling OpenAI API:', error);
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));