import {
  detectParagraphDirection,
  type TextDirection,
} from './direction';

export function setElementDirection(
  element: Element,
  direction: TextDirection,
): void {
  // Writing an unchanged value still invalidates style, and `[dir="rtl"]` drives
  // the injected font rules — so a redundant write means a relayout, which the
  // host app answers with more DOM mutations, which re-triggers our observer.
  // Reading the attribute first is cheap and breaks that cycle.
  if (element.getAttribute('dir') === direction) {
    return;
  }
  element.setAttribute('dir', direction);
}

interface DirectionCacheEntry {
  readonly text: string;
  readonly direction: TextDirection;
}

// Keyed weakly so entries die with their elements when the host app unmounts them.
const directionCache = new WeakMap<Element, DirectionCacheEntry>();

export function applyDetectedDirection(
  elements: Iterable<Element>,
  getText: (element: Element) => string,
): void {
  for (const element of elements) {
    const text = getText(element);
    const cached = directionCache.get(element);

    let direction: TextDirection;
    if (cached !== undefined && cached.text === text) {
      direction = cached.direction;
    } else {
      direction = detectParagraphDirection(text);
      directionCache.set(element, { text, direction });
    }

    // Re-asserted even on a cache hit: the host app may have clobbered `dir` on a
    // re-render without the text changing. The write itself is idempotent.
    setElementDirection(element, direction);
  }
}

export function applyTableDirection(tables: NodeListOf<HTMLTableElement>): void {

  tables.forEach(table => {
    let text: string = '';

    for (const element of table.querySelectorAll<HTMLTableCellElement>('th, td')) {
      text += getElementText(element);
    }

    const TableDirection = detectParagraphDirection(text);

    if (TableDirection === 'rtl')
      table.querySelectorAll<HTMLTableCellElement>('th, td').forEach((element) => {
        setElementDirection(element, TableDirection);
        element.style.textAlign = TableDirection === 'rtl' ? 'right !important' : 'left';
      });
  });

}


export function forceLtrDirection(elements: NodeListOf<Element>): void {
  for (const element of elements) {
    setElementDirection(element, 'ltr');
  }
}

const mutationCallbacks: Array<() => void> = [];
let bodyObserver: MutationObserver | undefined;
let pendingFrame: number | undefined;

function flushMutationCallbacks(): void {
  pendingFrame = undefined;

  for (const callback of mutationCallbacks) {
    // One misbehaving site module must not starve the others.
    try {
      callback();
    } catch (error) {
      console.error('[ai-rtl-resolver] mutation callback failed', error);
    }
  }

  // Discard the records our own writes just produced, so they cannot immediately
  // re-arm the next frame and spin us in place.
  bodyObserver?.takeRecords();
}

function scheduleFlush(): void {
  if (pendingFrame !== undefined) {
    return;
  }
  pendingFrame = requestAnimationFrame(flushMutationCallbacks);
}

/**
 * Registers `onMutate` to run at most once per animation frame while the body is
 * mutating.
 *
 * All callers share a single MutationObserver, and the work is deferred to
 * requestAnimationFrame rather than run inside the observer callback. That matters:
 * observer callbacks are microtasks, and the microtask queue is drained before the
 * browser is allowed to paint — so a callback whose DOM writes provoke further
 * mutations (as ours do, via the font rules keyed off `[dir]`) never lets a frame
 * render and hangs the tab. A frame callback is a task, so the page always paints
 * between passes and the worst case degrades to one pass per frame.
 */
export function observeBodyMutations(onMutate: () => void): void {
  const { body } = document;
  if (!body) {
    return;
  }

  mutationCallbacks.push(onMutate);

  const observer = bodyObserver ?? new MutationObserver(scheduleFlush);
  bodyObserver = observer;
  observer.observe(body, { childList: true, subtree: true });
}

export function getElementText(element: Element): string {
  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  return element.textContent ?? '';
}
