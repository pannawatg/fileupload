const URL = "laterbro"
const uploadForm = document.getElementById('uploadForm');
const inputFile = document.getElementById('inputFile');
const statusText = document.getElementById('status');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = inputFile.files[0];
  if (!file) return;

  statusText.textContent = 'Uploading to backend...';

  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(`${URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      statusText.innerHTML = `Uploaded! <a href="${data.githubUrl}" target="_blank">View on GitHub</a>`;
    } else {
      statusText.textContent = `Error: ${data.error}`;
    }
  } catch (err) {
    statusText.textContent = 'Error connecting to backend.';
  }
});
