export function checkEnabled(siteId: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve(true);
      return;
    }
    chrome.storage.local.get('disabledSites').then((result) => {
      const disabledSites = (result.disabledSites ?? []) as string[];
      resolve(!disabledSites.includes(siteId));
    });
  });
}

export function observeToggle(
  siteId: string,
  onToggle: (enabled: boolean) => void,
): void {
  if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) {
    return;
  }
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'toggle-rtl' && msg.enabled !== undefined) {
      onToggle(msg.enabled);
    }
  });
}
