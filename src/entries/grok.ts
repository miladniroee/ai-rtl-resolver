import { initFontInjection } from "../lib/fonts";
import { checkEnabled, observeToggle } from "../lib/storage";
import { initGrok, initGrokFonts } from "../sites/grok";

const SITE_ID = "grok";

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initGrokFonts();
    initGrok();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
