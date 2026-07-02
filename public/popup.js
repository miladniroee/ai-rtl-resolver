const SITES = [
  { name: 'ChatGPT', url: 'chatgpt.com', id: 'chatgpt', icon: 'platforms/chatgpt.png' },
  { name: 'Claude', url: 'claude.ai', id: 'claude', icon: 'platforms/claude.png' },
  { name: 'DeepSeek', url: 'chat.deepseek.com', id: 'deepseek', icon: 'platforms/deepseek.png' },
  { name: 'Gemini', url: 'gemini.google.com', id: 'gemeni', icon: 'platforms/gemini.png' },
  { name: 'Perplexity', url: 'perplexity.ai', id: 'perplexity', icon: 'platforms/perplexity.png' },
  { name: 'Qwen', url: 'chat.qwen.ai', id: 'qwen', icon: 'platforms/qwen.png' },
  { name: 'z.ai', url: 'chat.z.ai', id: 'zai', icon: 'platforms/zai.png' },
  { name: 'NotebookLM', url: 'notebooklm.google.com', id: 'notebooklm', icon: 'platforms/notebooklm .png' },
  { name: 'Ai Studio', url: 'aistudio.google.com', id: 'aistudio', icon: 'platforms/aistudio.png' }
];

const container = document.getElementById('sites');

async function init() {
  const { disabledSites = [] } = await chrome.storage.local.get('disabledSites');

  container.innerHTML = SITES.map(site => {
    const isEnabled = !disabledSites.includes(site.id);
    const iconHtml = site.icon
      ? `<img class="site-icon" src="${site.icon}" alt="${site.name}">`
      : '';
    return `
      <div class="site-item">
        ${iconHtml}
        <div class="site-info">
          <div class="site-name">${site.name}</div>
          <div class="site-url">${site.url}</div>
        </div>
        <label class="toggle">
          <input type="checkbox" data-site="${site.id}" ${isEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `;
  }).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const siteId = e.target.dataset.site;
      const { disabledSites = [] } = await chrome.storage.local.get('disabledSites');

      if (e.target.checked) {
        const updated = disabledSites.filter(id => id !== siteId);
        await chrome.storage.local.set({ disabledSites: updated });
      } else {
        if (!disabledSites.includes(siteId)) {
          disabledSites.push(siteId);
        }
        await chrome.storage.local.set({ disabledSites });
      }
    });
  });
}

init();
