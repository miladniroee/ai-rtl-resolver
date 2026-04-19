function fixDirection() {
  const katexElements = document.querySelectorAll('.katex-html');
  const paraghraphs = document.querySelectorAll('.ds-markdown-paragraph, h2, h3, .ds-message>div:not(.ds-markdown), ul, ol, table');

  paraghraphs.forEach(p => {
    p.setAttribute('dir', detectParagraphDirection(p.textContent));
  });

  katexElements.forEach(el => {
    el.setAttribute('dir', 'ltr');
  });
}

function detectParagraphDirection(text) {
    
    text = text.trim();
    
    if (text.length === 0) return 'ltr';
    
    // finding first character
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // if it's numeral or symbol, bypass
        if (char.match(/[\d\s\u200E\u200F\u200B#@$%^&*()\-+=_{}[\]\\|:;"'<>,.?/~`!]/)) continue;
        
        const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return persianRegex.test(char) ? 'rtl' : 'ltr';
    }
    
    return 'ltr';
}

fixDirection();

const observer = new MutationObserver(() => {
  fixDirection();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
