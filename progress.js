const API_URL = 'http://localhost:5000/api/quiz';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('username').textContent = user.username;

  try {
    const response = await fetch(`${API_URL}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const progress = await response.json();

    let activityHTML = progress.map((entry, index) => `
      <div class="activity">
        <h4>Quiz ${index + 1}</h4>
        <p><strong>Subject:</strong> ${entry.subject}</p>
        <p><strong>Score:</strong> ${entry.score}%</p>
        <p><strong>Feedback:</strong> ${entry.feedback}</p>
      </div>
    `).join('');

    document.getElementById('activityList').innerHTML = activityHTML || 'No activities yet';

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('activityList').innerHTML = 'Failed to load progress.';
  }
});
