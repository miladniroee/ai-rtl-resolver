import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR = '.katex-html, .not-prose, pre, code';
const APPLY_DIRECTION_SELECTOR = '.ql-editor.textarea p';

function fixGemeniDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(APPLY_DIRECTION_SELECTOR),
    getElementText,
  );
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initGemeni(): void {
  fixGemeniDirection();
  observeBodyMutations(fixGemeniDirection);
}
