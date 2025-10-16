let ingredients = '';

// Update the displayed ingredients list
function updateIngredientsList() {
  const input = document.getElementById('ingredient-input').value.trim();
  ingredients = input;
  //const list = document.getElementById('ingredients-list');
  //list.innerHTML = ingredients ? `<p>  ${ingredients}</p>` : '<p>No ingredients entered yet.</p>';
}

// Generate recipes by calling the API
async function generateRecipes() {
  if (!ingredients) {
    alert('Please enter at least one ingredient.');
    return;
  }

  const resultDiv = document.getElementById('recipe-content');
  resultDiv.classList.remove('error');

  try {
    const response = await fetch('/get-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients })
    });
    const data = await response.json();

    if (response.ok) {
      // Display the full response directly in the right box
      const recipeText = data.recipes || 'No recipes returned';
      // Format the response for better readability
      const formattedText = formatRecipes(recipeText);
      resultDiv.innerHTML = formattedText;
    } else {
      resultDiv.innerText = data.error || 'An unexpected error occurred';
      resultDiv.classList.add('error');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    resultDiv.innerText = 'Failed to connect to the server: ' + error.message;
    resultDiv.classList.add('error');
  }
}

// Format the API response for better readability
function formatRecipes(text) {
  const lines = text.split('\n').filter(line => line.trim());
  let formatted = '';
  let inInstructions = false;

  lines.forEach(line => {
    if (/^\d+\.\s/.test(line)) {
      // Recipe name
      inInstructions = false;
      formatted += `<h4>${line}</h4>`;
    } else if (line.toLowerCase().includes('instructions')) {
      // Instructions header
      inInstructions = true;
      formatted += `<p><strong>${line}</strong></p>`;
    } else {
      // Instructions or other content
      formatted += `<p>${line}</p>`;
    }
  });

  return formatted || 'No recipes found.';
}

// Clear the input and recipes
function clearInput() {
  ingredients = '';
  document.getElementById('ingredient-input').value = '';
  document.getElementById('ingredients-list').innerHTML = '<p>No ingredients entered yet.</p>';
  document.getElementById('recipe-content').innerHTML = '';
}

// Update ingredients list on input change

document.getElementById('ingredient-input').addEventListener('input', updateIngredientsList);
