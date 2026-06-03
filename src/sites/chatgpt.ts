import { applyDetectedDirection, getElementText, observeBodyMutations } from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

const APPLY_DIRECTION_SELECTOR = '#prompt-textarea';

function applyDirectionToChatgpt(): void {
  applyDetectedDirection(
    document.querySelectorAll(APPLY_DIRECTION_SELECTOR),
    getElementText,
  );
}

export function initChatgpt(): void {
  observeBodyMutations(applyDirectionToChatgpt);
  applyDirectionToChatgpt();
  initKatexDirectionFix();
}
