function fixKatexDirection() {
  const katexElements = document.querySelectorAll('.katex-html');
  katexElements.forEach(el => {
    el.setAttribute('dir', 'ltr');
  });
}

fixKatexDirection();

const observer = new MutationObserver(() => {
  fixKatexDirection();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


let PERSIAN_WEIGHT_PERCENTAGE = 60;

function detectParagraphDirection(text) { 
    text = text.trim();
    
    if (text.length === 0) return 'ltr';
    
    let persianCount = 0;
    let nonPersianCount = 0;

    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = [...segmenter.segment(text)];
    
    for (const segment of segments) {
        const char = segment.segment;
        
        const isEmojiLike = /[\p{Emoji}\p{Emoji_Presentation}]/u.test(char);
        if (isEmojiLike) continue;
        
        if (char.match(/[\d\s\u200E\u200F\u200B#@$%^&*()\-+=_{}[\]\\|:;"'<>,.?/~`!]/)) continue;
        
        const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        
        let isRtl = persianRegex.test(char);
        
        if (isRtl) {
            persianCount++;
        } else {
            nonPersianCount++;
        }
    }
    
    
    const totalRelevantChars = persianCount + nonPersianCount;
    if (totalRelevantChars > 0) {
        const persianPercentage = (persianCount / totalRelevantChars) * 100;
        
        
        if (persianPercentage > PERSIAN_WEIGHT_PERCENTAGE) {
            return 'rtl';
        }
    }
    
    
    for (const segment of segments) {
        const char = segment.segment;
        
        const isEmojiLike = /[\p{Emoji}\p{Emoji_Presentation}]/u.test(char);
        if (isEmojiLike) continue;
        
        if (char.match(/[\d\s\u200E\u200F\u200B#@$%^&*()\-+=_{}[\]\\|:;"'<>,.?/~`!]/)) continue;
        
        const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        
        return persianRegex.test(char) ? 'rtl' : 'ltr';
    }
    
    return 'ltr'
}