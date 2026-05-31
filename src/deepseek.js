import { detectParagraphDirection } from "./functions";

function fixDirection() {
  const ignoreElements  = document.querySelectorAll('.katex-html,.md-code-block,code,.ds-virtual-list-items>div>div');
  const paraghraphs = document.querySelectorAll('.ds-markdown-paragraph, h2, h3, h4, .ds-message>div:not(.ds-markdown), ul, ol, table');
  const vazirFont = document.querySelectorAll('.ds-virtual-list-items>div>div, textarea');
 
 const textAreas = document.querySelectorAll('textarea');

  paraghraphs.forEach(el => {
    el.setAttribute('dir', detectParagraphDirection(el.textContent));
  });

   textAreas.forEach(el => {
    el.setAttribute('dir', detectParagraphDirection(el.value));
  });


  ignoreElements.forEach(el => {
    el.setAttribute('dir', 'ltr');
  });

  vazirFont.forEach(el => {
    el.classList.add('vazir');
  });
}

fixDirection();

const observer = new MutationObserver(() => {
  fixDirection();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
