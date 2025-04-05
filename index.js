const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // put your API key in a .env file
});

const openai = new OpenAIApi(configuration);

app.post('/get-recipes', async (req, res) => {
  const { ingredients } = req.body;

  try {
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or gpt-4
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

    const reply = chatResponse.data.choices[0].message.content;
    res.json({ recipes: reply });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
