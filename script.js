(async () => {
    document.getElementById("ingredients-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const ingredients = document.getElementById("ingredients").value.trim();
      const resultDiv = document.getElementById("recipes-result");
      resultDiv.innerText = '';
      resultDiv.classList.remove('error');

      try {
        const response = await fetch('/get-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: ingredients || '' })
        });
        const data = await response.json();
        if (response.ok) {
          resultDiv.innerText = data.recipes || 'No recipes returned';
        } else {
          resultDiv.innerText = data.error || 'An unexpected error occurred';
          resultDiv.classList.add('error');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        resultDiv.innerText = 'Failed to connect to the server: ' + error.message;
        resultDiv.classList.add('error');
      }
    });
  })();