import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initNotion, NOTION_CHAT_SCOPE } from '../sites/notion';

const SITE_ID = 'notion';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    // Scope the font rules to the AI chat so RTL blocks on regular Notion pages
    // keep their own font.
    initFontInjection(NOTION_CHAT_SCOPE);
    initNotion();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
