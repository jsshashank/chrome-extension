export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Site {
  title: string;
  url: string;
}

export interface BookmarkLink {
  title: string;
  url: string;
}

export interface ActiveTab {
  id: number;
  title: string;
  url: string;
  domain: string;
}

export interface HistoryItem {
  title: string;
  url: string;
  time: number;
}
