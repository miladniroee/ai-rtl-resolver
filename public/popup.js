const SITES = [
  { name: 'ChatGPT', url: 'chatgpt.com', id: 'chatgpt', icon: 'platforms/chatgpt.png' },
  { name: 'Claude', url: 'claude.ai', id: 'claude', icon: 'platforms/claude.png' },
  { name: 'DeepSeek', url: 'chat.deepseek.com', id: 'deepseek', icon: 'platforms/deepseek.png' },
  { name: 'Gemini', url: 'gemini.google.com', id: 'gemeni', icon: 'platforms/gemini.png' },
  { name: 'Perplexity', url: 'perplexity.ai', id: 'perplexity', icon: 'platforms/perplexity.png' },
  { name: 'Qwen', url: 'chat.qwen.ai', id: 'qwen', icon: 'platforms/qwen.png' },
  { name: 'z.ai', url: 'chat.z.ai', id: 'zai', icon: 'platforms/zai.png' },
  { name: 'Gemini Notebook', url: 'notebooklm.google.com', id: 'notebooklm', icon: 'platforms/notebooklm .png' },
  { name: 'Duck.ai', url: 'duck.ai', id: 'duckai', icon: 'platforms/duckai.png' },
  { name: 'Kimi', url: 'kimi.com', id: 'kimi', icon: 'platforms/kimi.png' },
];

const container = document.getElementById('sites');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeInput = document.getElementById('fontSize');

async function init() {
  // Initialize sites toggles
  const { disabledSites = [] } = await chrome.storage.local.get('disabledSites');

  container.innerHTML = SITES.map(site => {
    const isEnabled = !disabledSites.includes(site.id);
    const iconHtml = site.icon
      ? `<img class="site-icon" src="${site.icon}" alt="${site.name}">`
      : '';
    return `
      <div class="site-item">
        ${iconHtml}
        <div class="site-name">${site.name}</div>
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

  // Initialize font settings
  const fontSettings = await chrome.storage.local.get('fontSettings');
  const settings = fontSettings.fontSettings || { fontFamily: 'Vazirmatn', fontSize: 16 };
  
  fontFamilySelect.value = settings.fontFamily || 'Vazirmatn';
  fontSizeInput.value = settings.fontSize || 16;

  // Handle font family change
  fontFamilySelect.addEventListener('change', async (e) => {
    const fontFamily = e.target.value;
    const { fontSettings = {} } = await chrome.storage.local.get('fontSettings');
    const current = fontSettings || { fontFamily: 'Vazirmatn', fontSize: 16 };
    await chrome.storage.local.set({
      fontSettings: { fontFamily, fontSize: current.fontSize }
    });
  });

  // Handle font size change
  fontSizeInput.addEventListener('change', async (e) => {
    let fontSize = parseInt(e.target.value, 10);
    
    // Validate
    if (isNaN(fontSize) || fontSize < 8) fontSize = 8;
    if (fontSize > 72) fontSize = 72;
    
    fontSizeInput.value = fontSize;
    
    const { fontSettings = {} } = await chrome.storage.local.get('fontSettings');
    const current = fontSettings || { fontFamily: 'Vazirmatn', fontSize: 16 };
    await chrome.storage.local.set({
      fontSettings: { fontFamily: current.fontFamily, fontSize }
    });
  });
}

init();
