import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR =
  '.katex-html,.md-code-block,code,.ds-virtual-list-items>div>div';

const DIRECTION_TARGET_SELECTOR =
  '.ds-markdown-paragraph, h2, h3, h4, .ds-message>div:not(.ds-markdown), ul, ol, table';

const VAZIR_CLASS_SELECTOR = '.ds-virtual-list-items>div>div, textarea';

const TEXTAREA_SELECTOR = 'textarea';

function fixDeepseekDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );

  applyDetectedDirection(
    document.querySelectorAll(TEXTAREA_SELECTOR),
    getElementText,
  );

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));

  for (const element of document.querySelectorAll(VAZIR_CLASS_SELECTOR)) {
    element.classList.add('vazir');
  }
}

export function initDeepseek(): void {
  fixDeepseekDirection();
  observeBodyMutations(fixDeepseekDirection);
}
