export type TextDirection = 'ltr' | 'rtl';

const PERSIAN_WEIGHT_PERCENTAGE = 30;

const PERSIAN_SCRIPT_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

const EMOJI_REGEX = /[\p{Emoji}\p{Emoji_Presentation}]/u;

const IGNORABLE_CHAR_REGEX =
  /[\d\s\u200E\u200F\u200B#@$%^&*()\-+=_{}[\]\\|:;"'<>,.?/~`!\u00AB\u00BB]/;

function isEmojiLike(char: string): boolean {
  return EMOJI_REGEX.test(char);
}

function isIgnorableChar(char: string): boolean {
  return IGNORABLE_CHAR_REGEX.test(char);
}

function isRtlScriptChar(char: string): boolean {
  return PERSIAN_SCRIPT_REGEX.test(char);
}

// Constructing an Intl.Segmenter is expensive, and this runs once per element on
// every observer pass. Build it once, lazily, and reuse it.
let graphemeSegmenter: Intl.Segmenter | undefined;

function segmentGraphemes(text: string): Intl.Segments {
  const segmenter =
    graphemeSegmenter ?? new Intl.Segmenter('en', { granularity: 'grapheme' });
  graphemeSegmenter = segmenter;
  return segmenter.segment(text);
}

export function detectParagraphDirection(text: string): TextDirection {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 'ltr';
  }

  let rtlCount = 0;
  let ltrCount = 0;
  let sawMeaningfulChar = false;

  // Iterated lazily so the RTL-first case (the common one here) can bail out
  // after a couple of graphemes instead of scanning the whole paragraph.
  for (const { segment: char } of segmentGraphemes(trimmed)) {
    if (isEmojiLike(char) || isIgnorableChar(char)) {
      continue;
    }

    const isRtl = isRtlScriptChar(char);

    // The first meaningful character wins outright, so the weight below only
    // ever decides LTR-first text.
    if (!sawMeaningfulChar) {
      if (isRtl) {
        return 'rtl';
      }
      sawMeaningfulChar = true;
    }

    if (isRtl) {
      rtlCount += 1;
    } else {
      ltrCount += 1;
    }
  }

  const totalRelevant = rtlCount + ltrCount;
  if (totalRelevant === 0) {
    return 'ltr';
  }

  const rtlPercentage = (rtlCount / totalRelevant) * 100;
  return rtlPercentage > PERSIAN_WEIGHT_PERCENTAGE ? 'rtl' : 'ltr';
}
