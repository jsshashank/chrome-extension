import { useState, useEffect } from 'react';
import { BookmarkLink, ActiveTab, HistoryItem, Site } from '../types';

export function useChromeData(isDrawerOpen: boolean) {
  const [topSites, setTopSites] = useState<Site[]>([]);
  const [activeTabs, setActiveTabs] = useState<ActiveTab[]>([]);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [bookmarkBar, setBookmarkBar] = useState<BookmarkLink[]>([]);

  // Fetch Bookmark Bar
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((tree) => {
        const root = tree[0];
        if (root && root.children) {
          const bar = root.children[0];
          if (bar && bar.children) {
            const links = bar.children
              .filter((child: chrome.bookmarks.BookmarkTreeNode) => child.url)
              .map((child: chrome.bookmarks.BookmarkTreeNode) => ({ 
                title: child.title, 
                url: child.url! 
              }))
              .slice(0, 12);
            setBookmarkBar(links);
          }
        }
      });
    }
  }, []);

  // Fetch Top Sites
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.topSites) {
      chrome.topSites.get((sites) => {
        setTopSites(sites.slice(0, 10));
      });
    } else {
      setTopSites([
        { title: 'Google', url: 'https://google.com' },
        { title: 'YouTube', url: 'https://youtube.com' },
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'Gmail', url: 'https://mail.google.com' },
        { title: 'Reddit', url: 'https://reddit.com' },
        { title: 'Twitter', url: 'https://twitter.com' }
      ]);
    }
  }, []);

  // Fetch Drawer Data (Tabs & History)
  useEffect(() => {
    if (isDrawerOpen && typeof chrome !== 'undefined') {
      if (chrome.tabs) {
        chrome.tabs.query({}, (tabs) => {
          const currentTabUrl = window.location.href;
          const processedTabs = tabs
            .filter(t => 
              t.url !== currentTabUrl && 
              !t.url?.startsWith('chrome://') && 
              !t.url?.startsWith('chrome-extension://')
            )
            .map(t => ({
              id: t.id || 0,
              title: t.title || 'Untitled',
              url: t.url || '',
              domain: t.url ? new URL(t.url).hostname.replace('www.', '') : 'unknown'
            }));
          setActiveTabs(processedTabs);
        });
      }

      if (chrome.history) {
        chrome.history.search({ text: '', maxResults: 20 }, (items) => {
          setRecentHistory(items.map(i => ({
            title: i.title || 'Untitled',
            url: i.url || '',
            time: i.lastVisitTime || 0
          })));
        });
      }
    }
  }, [isDrawerOpen]);

  return { topSites, activeTabs, recentHistory, bookmarkBar, setActiveTabs };
}
