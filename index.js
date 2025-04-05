const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Recipe API' });
  });

// Initialize the OpenAI client directly with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  try {
    // Use the updated method for chat completions
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that suggests recipes based on ingredients."
        },
        {
          role: "user",
          content: `I have the following ingredients: ${ingredients}. What can I cook?`
        }
      ],
      temperature: 0.7,
    });

    // Extract the response content
    const reply = chatResponse.choices[0].message.content;
    res.json({ recipes: reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));