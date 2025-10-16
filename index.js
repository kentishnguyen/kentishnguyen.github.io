// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const app = express();

// // Enable CORS
// app.use(cors());

// // Serve static files (like index.html, styles.css, script.js) from the root directory
// app.use(express.static(__dirname, {
//   index: 'index.html'
// }));

// // Handle JSON requests for the /get-recipes endpoint
// app.use(express.json());

// // Explicitly serve index.html for the root URL
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Route for /get-recipes
// app.post('/get-recipes', async (req, res) => {
//   try {
//     const { ingredients } = req.body;
//     // Replace this with your actual Gemini API call
//     const recipes = `1. Sample Recipe\nInstructions: Mix ${ingredients} and cook.`;
//     res.json({ recipes });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch recipes' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files (like index.html, styles.css, script.js) from the root directory
app.use(express.static(__dirname, {
  index: 'index.html'
}));

// Handle JSON requests for the /get-recipes endpoint
app.use(express.json());

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route for /get-recipes
app.post('/get-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    // Create a prompt for the Gemini API
    const prompt = `Generate a list of 3 recipes using the following ingredients: ${ingredients}. 
    For each recipe, provide the name and a brief set of instructions and the amount of calories in each serving. 
    Format the response as a numbered list, with each recipe name followed by "Instructions:" and the steps.`;

    // Use the Gemini API to generate recipes
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const recipes = result.response.text();

    // Send the generated recipes back to the client
    res.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes: ' + error.message });
  }
});

// Explicitly serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

