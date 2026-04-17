import { useState, useEffect } from 'react';
import { Site } from '../types';

export function useShortcuts() {
  const [customSites, setCustomSites] = useState<Site[]>(() => {
    try {
      const saved = localStorage.getItem('customSites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [savedForLater, setSavedForLater] = useState<Site[]>(() => {
    try {
      const saved = localStorage.getItem('savedForLater');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('customSites', JSON.stringify(customSites));
  }, [customSites]);

  useEffect(() => {
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
  }, [savedForLater]);

  const addCustomSite = (title: string, url: string) => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setCustomSites([...customSites, { title, url: finalUrl }]);
  };

  const removeCustomSite = (index: number) => {
    setCustomSites(customSites.filter((_, i) => i !== index));
  };

  const saveForLater = (title: string, url: string) => {
    if (!savedForLater.find(s => s.url === url)) {
      setSavedForLater([{ title, url }, ...savedForLater]);
    }
  };

  const removeSaved = (url: string) => {
    setSavedForLater(savedForLater.filter(s => s.url !== url));
  };

  return { customSites, setCustomSites, savedForLater, addCustomSite, removeCustomSite, saveForLater, removeSaved };
}
