
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string; // Real or mock URL for preview
  duration: string;
  genre?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  views?: string; // Fake view count for display
  lyrics?: string; // Added lyrics field
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export interface RadioStation {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  live: boolean;
  listeners: string;
}

export enum Tab {
  HOME = 'home',
  SEARCH = 'search',
  FAVORITES = 'favorites',
  HISTORY = 'history',
  PROFILE = 'profile',
}

export enum FilterType {
  ALL = 'Tất cả',
  MUSIC = 'Nhạc',
  PODCAST = 'Podcast',
}

export interface GeneratedTrack {
  title: string;
  lyrics: string;
  description: string;
  mood: string;
}