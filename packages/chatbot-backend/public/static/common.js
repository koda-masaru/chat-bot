document.getElementById('chat-form').addEventListener('submit', () => {
  document.getElementById('submit-button').disabled = true
  document.getElementById('chat-form').disabled = true

  const myModal = new bootstrap.Modal(document.getElementById('waitModal'));
  myModal.show();
})
