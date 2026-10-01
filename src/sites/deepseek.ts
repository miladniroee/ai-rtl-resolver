import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from "../lib/dom";

const LTR_ONLY_SELECTOR = ".katex-html,.md-code-block,code,.ds-virtual-list-items>div>div";

const DIRECTION_TARGET_SELECTOR =
  ".ds-markdown-paragraph:not(li > *), h1, h2, h3, h4, h5, h6, .ds-message>div:not(.ds-markdown), ul, ol, table ";

// List item paragraphs follow their list, so an English item in a Persian list
// stays on the bullet's side (and vice versa).
const LIST_PARAGRAPH_SELECTOR = "li > .ds-markdown-paragraph";

const VAZIR_CLASS_SELECTOR = ".ds-virtual-list-items>div>div, textarea, table span";

const TEXTAREA_SELECTOR = "textarea";

function fixDeepseekDirection(): void {
  applyDetectedDirection(document.querySelectorAll(DIRECTION_TARGET_SELECTOR), getElementText);

  applyDetectedDirection(document.querySelectorAll(TEXTAREA_SELECTOR), getElementText);

  for (const paragraph of document.querySelectorAll(LIST_PARAGRAPH_SELECTOR)) {
    const listDirection = paragraph.closest("ul, ol")?.getAttribute("dir");
    if (listDirection === "rtl" || listDirection === "ltr") {
      setElementDirection(paragraph, listDirection);
    }
  }

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));

  for (const element of document.querySelectorAll(VAZIR_CLASS_SELECTOR)) {
    element.classList.add("vazir");
  }
}

// DeepSeek only mirrors the task checkbox offset under `body.rtl`; mirror it for
// lists we mark RTL too, otherwise the checkbox overlaps the item text.
const RTL_TASK_CHECKBOX_STYLE =
  '.ds-markdown ul[dir="rtl"]>.ds-markdown-task-list-item>.ds-markdown-task-checkbox{margin-left:0;margin-right:-18px}';

function injectDeepseekStyles(): void {
  const style = document.createElement("style");
  style.textContent = RTL_TASK_CHECKBOX_STYLE;
  document.head.appendChild(style);
}

export function initDeepseek(): void {
  injectDeepseekStyles();
  fixDeepseekDirection();
  observeBodyMutations(fixDeepseekDirection);
}
