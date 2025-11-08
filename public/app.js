async function fetchVideos() {
  const res = await fetch('/api/videos');
  const videos = await res.json();
  const container = document.getElementById('videos');
  container.innerHTML = '';
  if (!videos.length) {
    container.innerHTML = '<p>No videos yet.</p>';
    return;
  }
  videos.forEach(v => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${v.title}</h3>
      <video controls width="400" src="/uploads/${v.filename}"></video>
      <p>${v.description || ''}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('video', document.getElementById('videoFile').files[0]);
  form.append('title', document.getElementById('title').value);
  form.append('description', document.getElementById('description').value);
  const status = document.getElementById('uploadStatus');
  status.textContent = 'Uploading...';
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    status.textContent = 'Uploaded!';
    document.getElementById('uploadForm').reset();
    fetchVideos();
  } catch (err) {
    status.textContent = err.message;
  }
});
fetchVideos();
