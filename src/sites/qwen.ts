import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR =
  '.katex-html,.md-code-block,code,pre';

const RESPONSE_BLOCKS = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote']
  .map((tag) => `.response-message-content ${tag}`)
  .join(',');

// Qwen builds the input with CSS modules, so the class carries a build hash
// (MessageInput__TextArea--dAQGxw1v). Match the stable prefix instead.
const INPUT_SELECTOR = 'textarea[class*="MessageInput__TextArea"]';

const DIRECTION_TARGET_SELECTOR =
  `.chat-user-message,.response-message-content,${RESPONSE_BLOCKS},${INPUT_SELECTOR}, table`;

function fixQwenDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

// Typing mutates the textarea's value, not the DOM, so the body observer never
// fires for it. Listen for input directly to keep the caret side in sync.
function observeInputDirection(): void {
  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement && target.matches(INPUT_SELECTOR)) {
      applyDetectedDirection([target], getElementText);
    }
  });
}

export function initQwen(): void {
  fixQwenDirection();
  observeBodyMutations(fixQwenDirection);
  observeInputDirection();
}
