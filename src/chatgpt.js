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
