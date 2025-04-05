const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // Loads the .env file

const app = express();
const port = 3000;

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.use(bodyParser.json());
app.use(express.static('public')); // serves your HTML/CSS/JS

app.post('/get-recipes', async (req, res) => {
  const ingredients = req.body.ingredients;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "system", content: "You're a helpful assistant who suggests recipes based on ingredients." },
        {
            role: "user",
            content: `I have the following ingredients: ${ingredients}.
          Please suggest 2-3 recipes in the following format:
          - Recipe Title
          - Ingredients List
          - Step-by-step Instructions
          
          Respond in clear, readable text.`
          }
          
      ]
    });

    const reply = response.data.choices[0].message.content;
    res.json({ recipes: reply });

  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'Failed to get recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
