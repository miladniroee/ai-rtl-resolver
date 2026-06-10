interface InjectFontMessage {
  readonly action: 'injectFont';
}

const INJECT_FONT_MESSAGE: InjectFontMessage = { action: 'injectFont' };

const VAZIR_FONT_FAMILY = "'Vazirmatn', 'Arial', 'Segoe UI', sans-serif";

function injectFontStylesheet(): void {
  const regularFontUrl = chrome.runtime.getURL('fonts/Vazirmatn-Regular.woff2');
  const boldFontUrl = chrome.runtime.getURL('fonts/Vazirmatn-Bold.woff2');

  const style = document.createElement('style');
  style.textContent = `
    @font-face {
        font-family: 'Vazirmatn';
        src: url('${regularFontUrl}') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Vazirmatn';
        src: url('${boldFontUrl}') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    .rtl, [dir="rtl"], .vazir, .user-message-bubble-color{
        font-family: ${VAZIR_FONT_FAMILY} !important;
    }
  `;
  document.head.appendChild(style);
}

export function initFontInjection(): void {
  void chrome.runtime.sendMessage(INJECT_FONT_MESSAGE);
  injectFontStylesheet();
}
