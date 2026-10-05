import { initFontFaces } from "../lib/fonts";
import { checkEnabled, observeToggle } from "../lib/storage";
import { initGrok, initGrokFonts } from "../sites/grok";

const SITE_ID = "grok";

checkEnabled(SITE_ID).then(async (enabled) => {
  if (enabled) {
    // Faces only: Grok receives the selected font as an extra face under its own
    // family names, so the forced `[dir="rtl"]` rule would clobber Grok's fonts.
    const settings = await initFontFaces();
    initGrokFonts(settings);
    initGrok();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
