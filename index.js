const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files (like index.html, styles.css, script.js) from the root directory
app.use(express.static(__dirname, {
  index: 'index.html'
}));

// Handle JSON requests for the /get-recipes endpoint
app.use(express.json());

// Explicitly serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for /get-recipes
app.post('/get-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    // Replace this with your actual Gemini API call
    const recipes = `1. Sample Recipe\nInstructions: Mix ${ingredients} and cook.`;
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));