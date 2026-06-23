import { applyDetectedDirection, getElementText, observeBodyMutations } from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

const DIRECTION_TARGET_SELECTOR = '#chat-input,.chat-user [data-expanded], .markdown-prose:not(.chat-user)';

function fixZaiDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );
}

export function initZai(): void {
  fixZaiDirection();
  observeBodyMutations(fixZaiDirection);
  initKatexDirectionFix();
}
