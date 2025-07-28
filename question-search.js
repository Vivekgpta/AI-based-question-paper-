const API_URL = 'http://localhost:5000/api/search/search-question';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('username').textContent = user.username;

  document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const question = document.getElementById('questionInput').value.trim();
    const resultBox = document.getElementById('analysisResult');

    if (!question) {
      resultBox.innerHTML = '<p class="error">Please enter a question.</p>';
      return;
    }

    try {
      resultBox.innerHTML = '<p class="loading">Analyzing...</p>';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (response.ok && data.level) {
        resultBox.innerHTML = `
          <p><strong>Bloom's Level:</strong> ${data.level}</p>
          <p><strong>Source:</strong> ${data.source}</p>
        `;
      } else {
        resultBox.innerHTML = `<p class="error">${data.error || 'Failed to analyze question.'}</p>`;
      }
    } catch (error) {
      console.error('Error:', error);
      resultBox.innerHTML = '<p class="error">An error occurred. Please try again.</p>';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
});
