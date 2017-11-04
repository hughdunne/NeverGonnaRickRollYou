const save_options = () => {
  let apiKey = document.getElementById('apikey').value;
  chrome.storage.sync.set({apiKey}, () => {
    let status = document.getElementById('status');
    status.textContent = 'API key saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
};

const restore_options = () => {
  // Use default value blank
  chrome.storage.sync.get({
    apiKey: ''
}, (items) => {
    document.getElementById('apikey').value = items.apiKey;
  });
};

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
