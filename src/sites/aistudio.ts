import {
	applyDetectedDirection,
	forceLtrDirection,
	getElementText,
	observeBodyMutations,
} from '../lib/dom';
import { detectParagraphDirection } from '../lib/direction';

const LTR_ONLY_SELECTOR =
	'.katex-html, .not-prose, pre, code, .math, .katex, .code-block, [class*="code"]';

const DIRECTION_TARGET_SELECTOR = [
	'.chat-turn-container.user .chat-session-content',
	'.chat-turn-container.model .chat-session-content',
	'.chat-turn-container .chat-session-content',

	'.chat-turn-container.user',
	'.chat-turn-container.model',

	'.chat-turn-container [class*="message"]',
	'.chat-turn-container [class*="content"]',

	'textarea.cdk-textarea-autosize',
	'.chat-container textarea',
	'[contenteditable="true"]',

	'.chat-session-content > div',
	'.chat-view-container [class*="text"]'
].join(', ');

function fixAistudioDirection(): void {
	const targets = document.querySelectorAll(DIRECTION_TARGET_SELECTOR);
	applyDetectedDirection(targets, getElementText);
	const ltrElements = document.querySelectorAll(LTR_ONLY_SELECTOR);
	forceLtrDirection(ltrElements);
}

export function initAistudio(): void {
	fixAistudioDirection();
	observeBodyMutations(fixAistudioDirection);
	document.addEventListener('input', (e) => {
		const { target } = e;
		if (!(target instanceof Element)) {
			return;
		}
		if (target.matches('textarea.cdk-textarea-autosize, [contenteditable="true"]')) {
			const direction = detectParagraphDirection(
				target instanceof HTMLTextAreaElement ? target.value : target.textContent ?? ''
			);
			target.setAttribute('dir', direction);
		}
	});
}