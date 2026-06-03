import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR =
  '.katex-html,.md-code-block,code,.ds-virtual-list-items>div>div';

const DIRECTION_TARGET_SELECTOR =
  '[data-user-message-bubble],.font-claude-response-body,h3,div[data-testid="chat-input"]';

function fixClaudeDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initClaude(): void {
  fixClaudeDirection();
  observeBodyMutations(fixClaudeDirection);
}
