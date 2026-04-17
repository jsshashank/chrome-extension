export function useNavigation() {
  const navigateTo = (url: string, e?: React.MouseEvent) => {
    try {
      const isAltPressed = e?.altKey;

      if (typeof chrome !== 'undefined' && (chrome.tabs || chrome.windows)) {
        if (isAltPressed) {
          chrome.windows.create({ url, type: 'popup', width: 800, height: 600 });
        } else if (url.startsWith('chrome://')) {
          chrome.tabs.create({ url });
        } else {
          chrome.tabs.update({ url });
        }
      } else {
        window.open(url, isAltPressed ? '_blank' : '_self');
      }
    } catch (e) {
      console.error('Navigation failed', e);
      window.open(url, '_blank');
    }
  };

  const closeTab = (id: number, activeTabs: any[], setActiveTabs: (tabs: any[]) => void) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.remove(id, () => {
        setActiveTabs(activeTabs.filter(t => t.id !== id));
      });
    }
  };

  return { navigateTo, closeTab };
}
