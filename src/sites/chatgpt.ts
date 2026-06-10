import { applyDetectedDirection, getElementText, observeBodyMutations } from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

const APPLY_DIRECTION_SELECTOR = '#prompt-textarea, div[data-message-author-role="assistant"] p';

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
