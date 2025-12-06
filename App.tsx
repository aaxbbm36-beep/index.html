
import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, Mic, Sparkles, Heart, Clock, MoreHorizontal, User, Headphones, Radio, ListMusic, Plus, FolderPlus, Youtube, Disc, X, Upload, Settings, Trash2, Shield, Bell, Zap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { Song, Tab, FilterType, GeneratedTrack } from './types';
import { MOCK_SONGS, MOCK_ALBUMS, GENRES, GENRE_SEEDS, SUGGESTED_PROMPTS, MOCK_RADIO, MOCK_ARTISTS, MOCK_PLAYLISTS, SUGGESTED_SEARCHES } from './constants';

// --- Helper: Lyrics Parser ---
interface LyricLine {
  time: number;
  text: string;
}

const parseLyrics = (lyrics: string): LyricLine[] => {
  const lines = lyrics.split('\n');
  const result: LyricLine[] = [];
  let currentTime = 0;
  let hasTimestamps = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match 00:00 format
    const timeMatch = line.match(/^(\d{2}):(\d{2})$/);
    
    if (timeMatch) {
      hasTimestamps = true;
      const min = parseInt(timeMatch[1]);
      const sec = parseInt(timeMatch[2]);
      currentTime = min * 60 + sec;
    } else if (line && line !== '...') {
      // If line is text (and not "..." or empty), push it with the LAST timestamp found
      result.push({ time: currentTime, text: line });
    }
  }
  
  // If no timestamps detected, return empty array to trigger fallback display
  if (!hasTimestamps) return [];
  
  return result;
};

// --- Sub-Components (View Definitions) ---

interface SectionHeaderProps {
  title: string;
  moreLink?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, moreLink = true }) => (
  <div className="flex justify-between items-end mb-6">
    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase border-l-4 border-cyber-red pl-3 relative shadow-neon-red">
      {title}
      <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-cyber-red to-cyber-orange"></span>
    </h2>
    {moreLink && (
      <button className="text-xs text-cyber-orange hover:text-white hover:underline uppercase tracking-widest font-mono transition-colors">
        Xem tất cả
      </button>
    )}
  </div>
);

interface SongCardProps {
  song: Song;
  onClick: () => void;
  isPlaying: boolean;
  currentSongId?: string;
  isList?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, isPlaying, currentSongId, isList = false }) => {
  const isCurrent = currentSongId === song.id;
  const imageAnimationClass = isCurrent && isPlaying ? 'animate-beat shadow-neon-red' : '';
  
  if (isList) {
    return (
      <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer group border-b border-white/5 last:border-0" onClick={onClick}>
        <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
          <img 
            src={song.coverUrl} 
            className={`w-full h-full object-cover ${imageAnimationClass}`} 
            alt={song.title} 
          />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isCurrent && isPlaying ? <Pause className="w-4 h-4 text-white fill-current" /> : <Play className="w-4 h-4 text-white fill-current" />}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm truncate ${isCurrent ? 'text-cyber-red' : 'text-white'}`}>{song.title}</div>
          <div className="text-xs text-gray-400 truncate hover:text-cyber-orange">{song.artist}</div>
        </div>
        <div className="text-xs text-gray-500 hidden sm:block font-mono">{song.views || 'N/A'}</div>
        <div className="text-xs text-gray-500 font-mono">{song.duration}</div>
      </div>
    )
  }

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-b from-white/5 to-transparent hover:bg-white/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-cyber-red/30 hover:shadow-neon-red w-[160px] md:w-[180px] shrink-0"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
        {/* Dynamic Image Animation */}
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isCurrent && isPlaying ? 'animate-beat' : 'group-hover:scale-110'}`} 
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyber-red text-black flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
             {isCurrent && isPlaying ? <Pause className="fill-current w-4 h-4 md:w-5 md:h-5" /> : <Play className="fill-current w-4 h-4 md:w-5 md:h-5 ml-1" />}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className={`font-semibold text-sm truncate ${isCurrent ? 'text-cyber-red' : 'text-white'}`}>{song.title}</h3>
        <p className="text-xs text-gray-400 truncate mt-1 hover:text-cyber-orange">{song.artist}</p>
      </div>
    </div>
  );
};

interface AlbumCardProps {
  title: string;
  desc: string;
  cover: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ title, desc, cover }) => (
   <div className="flex flex-col gap-3 w-[180px] md:w-[200px] shrink-0 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg aspect-square shadow-lg border border-gray-800 group-hover:border-cyber-orange transition-all">
        <img src={cover} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-2 left-2 right-2">
           <Play className="w-8 h-8 text-cyber-orange fill-current opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 drop-shadow-lg" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-white group-hover:text-cyber-orange transition-colors truncate">{title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{desc}</p>
      </div>
   </div>
);

// --- Main App ---

const FILTERS = [FilterType.ALL, FilterType.MUSIC, FilterType.PODCAST];

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLyrics, setShowLyrics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Storage & Uploads
  const [favorites, setFavorites] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Audio Playback
  const [currentTime, setCurrentTime] = useState(0);

  // Favorites Tab State
  const [favCategory, setFavCategory] = useState<'songs' | 'albums' | 'artists'>('songs');

  // LOAD DATA FROM LOCAL STORAGE ON MOUNT
  useEffect(() => {
    // Load uploaded songs
    const savedUploads = localStorage.getItem('userUploads');
    if (savedUploads) {
      try {
        const parsedUploads: Song[] = JSON.parse(savedUploads);
        setSongs(prev => [...parsedUploads, ...prev]); // Add uploads to beginning
      } catch (e) {
        console.error("Failed to load uploads", e);
      }
    }

    // Load favorites
    const savedFavs = localStorage.getItem('userFavorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playSong = (song: Song) => {
    // Nếu đang chọn bài hiện tại, chỉ toggle play/pause
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      // Nếu bài mới, set song và bật play
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Thêm vào lịch sử (không trùng lặp)
      setHistory(prev => {
        const filtered = prev.filter(s => s.id !== song.id);
        return [song, ...filtered].slice(0, 50);
      });
    }
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % songs.length;
      playSong(songs[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
      playSong(songs[prevIndex]);
    }
  };

  const toggleFavorite = (id: string) => {
    let newFavs: string[];
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('userFavorites', JSON.stringify(newFavs));
  };

  // --- Upload Logic ---
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit check (optional but safer for LS)
      alert("File too large. Please select a file under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Audio = event.target?.result as string;
      const newSong: Song = {
        id: `upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'User Upload',
        coverUrl: 'https://picsum.photos/seed/user-upload/300/300',
        audioUrl: base64Audio,
        duration: 'Unknown',
        genre: 'Upload',
        views: '0'
      };

      setSongs(prev => [newSong, ...prev]);

      // Save to localStorage
      const existingUploadsStr = localStorage.getItem('userUploads');
      let existingUploads: Song[] = [];
      if (existingUploadsStr) {
        try {
          existingUploads = JSON.parse(existingUploadsStr);
        } catch(e) {}
      }
      
      try {
        const newUploads = [newSong, ...existingUploads];
        localStorage.setItem('userUploads', JSON.stringify(newUploads));
        alert("Song uploaded and saved successfully!");
      } catch (err) {
        alert("Storage full! Cannot save permanently, but you can play it now.");
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteSong = (id: string) => {
     // 1. Remove from Songs State
     setSongs(prev => prev.filter(s => s.id !== id));
     
     // 2. Remove from Local Storage
     const existingUploadsStr = localStorage.getItem('userUploads');
     if (existingUploadsStr) {
       const existingUploads: Song[] = JSON.parse(existingUploadsStr);
       const newUploads = existingUploads.filter(s => s.id !== id);
       localStorage.setItem('userUploads', JSON.stringify(newUploads));
     }
  };
  
  // --- Render Sections ---

  const renderHome = () => {
    // Filter logic
    const showMusic = filter !== FilterType.PODCAST;
    const showPodcast = filter !== FilterType.MUSIC;

    const displayedSongs = songs.filter(s => {
      if (filter === FilterType.MUSIC) return s.genre !== 'Podcast';
      if (filter === FilterType.PODCAST) return s.genre === 'Podcast';
      return true; // ALL
    });

    const musicSongs = songs.filter(s => s.genre !== 'Podcast');
    const podcastSongs = songs.filter(s => s.genre === 'Podcast');
    
    // Separate User Uploads
    const userUploads = songs.filter(s => s.id.startsWith('upload-'));

    return (
    <div className="space-y-10 pb-32 animate-fade-in">
      {/* Filters */}
      <div className="flex justify-between items-center sticky top-0 bg-cyber-black/95 z-30 py-4 backdrop-blur-md">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                ${filter === f 
                  ? 'bg-white text-black border-white shadow-neon-orange' 
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner (Show for All or Music) */}
      {showMusic && (
        <div className="relative rounded-2xl p-6 md:p-10 overflow-hidden border border-cyber-red/20 shadow-neon-red group">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/neon-banner/1200/400')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-black via-cyber-black/80 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-start gap-4 max-w-xl">
             <div className="text-cyber-orange font-mono text-xs uppercase tracking-[0.2em] border border-cyber-orange/50 px-2 py-1 rounded">Spotlight</div>
             <h1 className="text-3xl md:text-5xl font-black uppercase leading-none drop-shadow-lg">
               Neon Nights <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red to-cyber-orange">V-Pop Vibes</span>
             </h1>
             <p className="text-gray-300 mb-2 line-clamp-2">The best Vietnamese Indie and Pop hits to light up your night.</p>
             <div className="flex gap-4">
               <button 
                onClick={() => musicSongs.length > 0 && playSong(musicSongs[0])}
                className="bg-cyber-red text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-all hover:scale-105 flex items-center gap-2 shadow-neon-red"
               >
                 <Play className="w-5 h-5 fill-current" /> Play Now
               </button>
               <button className="border border-cyber-orange text-cyber-orange px-6 py-3 rounded-full font-bold hover:bg-cyber-orange hover:text-black transition-colors shadow-neon-orange">
                 + Add to Library
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      
      {/* 0. User Uploads (If any) */}
      {userUploads.length > 0 && (
        <section>
          <SectionHeader title="Your Uploads" />
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {userUploads.map(song => (
                <SongCard key={song.id} song={song} onClick={() => playSong(song)} isPlaying={isPlaying} currentSongId={currentSong?.id} />
             ))}
          </div>
        </section>
      )}

      {/* 1. Recently Played / Often Listen (Filtered) */}
      <section>
        <SectionHeader title="Nội dung bạn hay nghe" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSongs.slice(0, 6).map(song => (
            <SongCard key={song.id} song={song} onClick={() => playSong(song)} isPlaying={isPlaying} currentSongId={currentSong?.id} isList={true} />
          ))}
        </div>
      </section>

      {/* 2. Suggested For You (Filtered) */}
      <section>
        <SectionHeader title="Đề xuất dành cho bạn" />
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayedSongs.slice(0, 5).map(song => (
            <SongCard key={song.id} song={song} onClick={() => playSong(song)} isPlaying={isPlaying} currentSongId={currentSong?.id} />
          ))}
        </div>
      </section>

      {/* 3. Famous Albums (Music Only) */}
      {showMusic && (
      <section>
         <SectionHeader title="Album Nổi Tiếng" />
         <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
           {MOCK_ALBUMS.map(album => (
             <AlbumCard key={album.id} title={album.title} desc={album.description} cover={album.coverUrl} />
           ))}
         </div>
      </section>
      )}

      {/* 4. Podcast Specific Section */}
      {showPodcast && podcastSongs.length > 0 && (
         <section>
            <SectionHeader title="Podcast Nổi Bật" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {podcastSongs.map(song => (
                 <SongCard key={song.id} song={song} onClick={() => playSong(song)} isPlaying={isPlaying} currentSongId={currentSong?.id} />
              ))}
            </div>
         </section>
      )}

       {/* 5. Famous Artists (Music Only) */}
       {showMusic && (
       <section>
        <SectionHeader title="Nghệ sĩ nổi tiếng" />
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide px-2">
           {MOCK_ARTISTS.map((artist, idx) => (
             <div key={idx} className="flex flex-col items-center gap-4 shrink-0 cursor-pointer group">
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cyber-red transition-all shadow-lg relative">
                 <img src={artist.img} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               </div>
               <span className="text-base font-bold group-hover:text-cyber-red transition-colors">{artist.name}</span>
             </div>
           ))}
        </div>
      </section>
      )}

      {/* 6. Popular Radio (All or Podcast) */}
      {showPodcast && (
      <section>
        <SectionHeader title="Radio Nổi Tiếng" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {MOCK_RADIO.map(radio => (
               <div key={radio.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 hover:border-cyber-orange/30 transition-all cursor-pointer group">
                  <div className="w-20 h-20 rounded-lg overflow-hidden relative shadow-lg">
                    <img src={radio.coverUrl} alt={radio.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                       <Radio className="w-8 h-8 text-white opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-cyber-orange transition-colors">{radio.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{radio.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyber-red text-white text-[10px] font-bold uppercase animate-pulse shadow-neon-red">Live</span>
                      <span className="text-xs text-gray-500">{radio.listeners} đang nghe</span>
                    </div>
                  </div>
               </div>
             ))}
         </div>
      </section>
      )}

      {/* 7. Playlists (Music Only) */}
      {showMusic && (
      <section>
        <SectionHeader title="Danh sách phát" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_PLAYLISTS.map(pl => (
             <div key={pl.id} className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-white/5 hover:border-cyber-red/50 transition-all group cursor-pointer hover:-translate-y-1">
                <div className="aspect-square rounded-lg overflow-hidden mb-3 shadow-lg">
                  <img src={pl.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={pl.title} />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 truncate">{pl.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{pl.description}</p>
             </div>
          ))}
        </div>
      </section>
      )}
    </div>
  )};

  const renderSearch = () => {
    // Filter Logic
    const filteredSongs = songs.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredArtists = MOCK_ARTISTS.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAlbums = MOCK_ALBUMS.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasResults = filteredSongs.length > 0 || filteredArtists.length > 0 || filteredAlbums.length > 0;

    return (
    <div className="pb-32 animate-fade-in">
      <div className="sticky top-0 bg-cyber-black/95 z-30 py-6 backdrop-blur-md border-b border-white/5">
        <div className="relative max-w-2xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, lyrics..." 
              className="w-full bg-white/10 border border-white/10 rounded-full py-4 pl-14 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyber-orange focus:bg-white/15 focus:shadow-neon-orange transition-all"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-5xl mx-auto">
        {!searchQuery ? (
          /* Default View (Suggestions & Genres) */
          <>
            {/* Suggested Searches */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyber-orange" />
                Đề xuất tìm kiếm
              </h3>
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_SEARCHES.map((term, i) => (
                  <span 
                    key={i} 
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer border border-transparent hover:border-cyber-red/50 transition-all"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Genres */}
            <h3 className="text-xl font-bold mb-6 border-l-4 border-cyber-orange pl-3">Thể loại âm nhạc</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GENRES.map((genre, idx) => (
                <div 
                  key={idx} 
                  className="relative h-36 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group shadow-lg"
                  // Warm red/orange gradients
                  style={{ background: `linear-gradient(135deg, hsl(${idx * 15}, 80%, 30%), hsl(${idx * 15 + 30}, 90%, 15%))` }}
                  onClick={() => setSearchQuery(genre)}
                >
                  <span className="absolute top-4 left-4 font-bold text-xl drop-shadow-md z-10">{genre}</span>
                  <img 
                    src={`https://picsum.photos/seed/${GENRE_SEEDS[idx % GENRE_SEEDS.length]}/200/200`} 
                    className="absolute bottom-0 right-0 w-24 h-24 rotate-[25deg] translate-x-[15%] translate-y-[10%] shadow-2xl group-hover:rotate-0 transition-all duration-500 opacity-80 group-hover:opacity-100 rounded-lg"
                    alt={genre} 
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Search Results */
          <div className="space-y-10">
            {!hasResults && (
              <div className="text-center py-20 opacity-50">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-500 rounded-full flex items-center justify-center">
                   <Search className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-xl font-bold">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different keywords.</p>
              </div>
            )}

            {filteredSongs.length > 0 && (
              <section>
                <SectionHeader title="Bài Hát" moreLink={false} />
                <div className="grid grid-cols-1 gap-2">
                  {filteredSongs.map(song => (
                    <SongCard key={song.id} song={song} onClick={() => playSong(song)} isPlaying={isPlaying} currentSongId={currentSong?.id} isList={true} />
                  ))}
                </div>
              </section>
            )}

            {filteredArtists.length > 0 && (
              <section>
                 <SectionHeader title="Nghệ Sĩ" moreLink={false} />
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredArtists.map((artist, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group">
                        <img src={artist.img} alt={artist.name} className="w-32 h-32 rounded-full object-cover group-hover:border-2 border-cyber-orange transition-all" />
                        <span className="font-bold group-hover:text-cyber-orange">{artist.name}</span>
                      </div>
                    ))}
                 </div>
              </section>
            )}

            {filteredAlbums.length > 0 && (
              <section>
                <SectionHeader title="Album" moreLink={false} />
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {filteredAlbums.map(album => (
                    <AlbumCard key={album.id} title={album.title} desc={album.description} cover={album.coverUrl} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )};

  const renderFavorites = () => (
    <div className="pb-32 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-cyber-orange pl-3 uppercase shadow-neon-orange">Yêu thích</h2>
        <button className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-cyber-orange hover:text-white transition-all shadow-neon-orange">
          <FolderPlus className="w-4 h-4" /> Create Folder
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
        {[
          { id: 'songs', label: 'Liked Songs' },
          { id: 'albums', label: 'Albums' },
          { id: 'artists', label: 'Artists' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFavCategory(cat.id as any)}
            className={`pb-3 text-sm font-bold transition-all relative ${favCategory === cat.id ? 'text-cyber-red' : 'text-gray-400 hover:text-white'}`}
          >
            {cat.label}
            {favCategory === cat.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyber-red rounded-t-full"></span>}
          </button>
        ))}
      </div>

      {favCategory === 'songs' && (
        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
             <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-full">
               <span className="w-8">#</span>
               <span className="flex-1">Title</span>
               <span className="hidden md:block w-32">Plays</span>
               <span className="w-16 text-right">Duration</span>
             </div>
          </div>
          {songs.filter(s => favorites.includes(s.id)).length === 0 ? (
             <div className="p-8 text-center text-gray-500 italic">No favorite songs yet. Add some by clicking the heart icon!</div>
          ) : (
            songs.filter(s => favorites.includes(s.id)).map((song, i) => (
              <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors cursor-pointer group border-b border-white/5 last:border-0" onClick={() => playSong(song)}>
                <div className="text-gray-500 w-8 text-center text-sm font-mono group-hover:text-cyber-red">{i + 1}</div>
                <img 
                  src={song.coverUrl} 
                  className={`w-10 h-10 rounded object-cover shadow-sm ${currentSong?.id === song.id && isPlaying ? 'animate-beat' : ''}`} 
                  alt="art" 
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${currentSong?.id === song.id ? 'text-cyber-red' : 'text-white'}`}>{song.title}</div>
                  <div className="text-xs text-gray-400 truncate hover:underline">{song.artist}</div>
                </div>
                <div className="hidden md:block w-32 text-xs text-gray-500">{song.views}</div>
                <div className="w-16 text-right text-xs text-gray-400 font-mono">{song.duration}</div>
                <Heart className="w-4 h-4 text-cyber-red fill-current ml-2" />
                
                {/* External Links in List */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {song.youtubeUrl && <Youtube className="w-4 h-4 text-gray-400 hover:text-red-500" />}
                  {song.spotifyUrl && <Disc className="w-4 h-4 text-gray-400 hover:text-green-500" />}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {favCategory === 'albums' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {MOCK_ALBUMS.map(album => (
            <AlbumCard key={album.id} title={album.title} desc={album.description} cover={album.coverUrl} />
          ))}
        </div>
      )}

      {favCategory === 'artists' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {MOCK_ARTISTS.map((artist, idx) => (
             <div key={idx} className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-cyber-red/20 group">
               <img src={artist.img} className="w-24 h-24 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform" alt={artist.name} />
               <div className="text-center">
                 <div className="font-bold">{artist.name}</div>
                 <div className="text-xs text-gray-500">Artist</div>
               </div>
               <button className="mt-2 text-xs border border-gray-600 px-4 py-1 rounded-full hover:border-white hover:bg-white hover:text-black transition-all">Follow</button>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="pb-32 animate-fade-in">
       <SectionHeader title="Lịch sử nghe nhạc" />
       
       <div className="space-y-8">
         {/* Today */}
         <div>
            <h3 className="text-sm font-bold text-cyber-orange mb-4 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Today
            </h3>
            {history.length === 0 && <div className="text-gray-500 text-sm italic">You haven't listened to anything yet.</div>}
            <div className="flex flex-col gap-2">
              {history.map((song, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-transparent hover:border-cyber-orange/30 transition-all cursor-pointer group" onClick={() => playSong(song)}>
                    <img 
                      src={song.coverUrl} 
                      className={`w-12 h-12 rounded shadow-md ${currentSong?.id === song.id && isPlaying ? 'animate-beat' : ''}`} 
                      alt="art" 
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{song.title}</div>
                      <div className="text-xs text-gray-400">{song.artist}</div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono group-hover:hidden">Just now</div>
                    <Play className="w-4 h-4 text-white hidden group-hover:block" />
                  </div>
              ))}
            </div>
         </div>
       </div>
    </div>
  );
  
  const renderProfile = () => {
    const uploadedSongs = songs.filter(s => s.id.startsWith('upload-'));
    
    return (
      <div className="pb-32 animate-fade-in">
        {/* Profile Header */}
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-black border border-cyber-red/30">
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyber-red/20 to-cyber-orange/20"></div>
           <div className="relative px-6 pb-6 pt-20 flex flex-col md:flex-row items-end gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-cyber-black bg-gray-800 relative z-10 shadow-neon-red">
                 <img src="https://picsum.photos/seed/cyber-user-avatar/200/200" alt="User" className="w-full h-full rounded-full object-cover" />
                 <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-cyber-black rounded-full" title="Online"></div>
              </div>
              <div className="flex-1">
                 <h2 className="text-3xl font-black text-white uppercase">Cyber User</h2>
                 <div className="flex gap-3 text-sm mt-1">
                    <span className="px-2 py-0.5 bg-cyber-orange text-black font-bold rounded text-xs uppercase">Premium</span>
                    <span className="text-gray-400">Joined 2024</span>
                 </div>
              </div>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                 Edit Profile
              </button>
           </div>
           
           {/* Stats Grid */}
           <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10 bg-black/40 backdrop-blur-sm">
              <div className="p-4 text-center">
                 <div className="text-2xl font-black text-cyber-red">{uploadedSongs.length}</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Uploads</div>
              </div>
              <div className="p-4 text-center">
                 <div className="text-2xl font-black text-cyber-orange">{favorites.length}</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Favorites</div>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {/* Left Column: Management */}
           <div className="md:col-span-2 space-y-8">
              {/* Upload Section */}
              <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-cyber-orange hover:bg-white/10 transition-all cursor-pointer group" onClick={triggerFileUpload}>
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-gray-300 group-hover:text-cyber-orange" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">Upload Your Track</h3>
                 <p className="text-xs text-gray-500 mb-4">Support MP3, WAV. Max 5MB. Saved permanently.</p>
                 <button 
                   className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-cyber-orange hover:text-white transition-all shadow-neon-orange"
                   onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                 >
                   Select File
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="audio/*" 
                   onChange={handleFileUpload} 
                 />
              </div>

              {/* My Uploads */}
              <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-cyber-orange" /> My Uploads
                 </h3>
                 {uploadedSongs.length === 0 ? (
                    <div className="text-gray-500 text-sm italic text-center py-8">No uploaded songs. Go to "Create" to upload one!</div>
                 ) : (
                    <div className="space-y-2">
                       {uploadedSongs.map(song => (
                          <div key={song.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg hover:bg-black/60 group">
                             <div className="flex items-center gap-3 cursor-pointer" onClick={() => playSong(song)}>
                                <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center overflow-hidden">
                                   <img src={song.coverUrl} className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="text-sm font-medium text-white">{song.title}</div>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-white" onClick={() => playSong(song)}><Play className="w-4 h-4" /></button>
                                <button className="p-2 text-gray-400 hover:text-red-500" onClick={() => deleteSong(song.id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </section>
           </div>

           {/* Right Column: Settings */}
           <div className="space-y-6">
              <section className="bg-white/5 border border-white/5 rounded-2xl p-6">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Settings
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Zap className="w-4 h-4 text-cyber-orange" /> High Quality Audio
                       </div>
                       <div className="w-10 h-5 bg-cyber-red rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Bell className="w-4 h-4 text-cyber-orange" /> Notifications
                       </div>
                       <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Shield className="w-4 h-4 text-cyber-orange" /> Private Mode
                       </div>
                       <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                 </div>
              </section>

              <div className="p-6 bg-gradient-to-br from-cyber-red/20 to-black rounded-2xl border border-cyber-red/30 text-center">
                 <h4 className="font-bold text-white mb-2">Go Premium</h4>
                 <p className="text-xs text-gray-400 mb-4">Unlock AI unlimited generation and high quality audio.</p>
                 <button className="w-full bg-cyber-red text-white py-2 rounded-lg font-bold shadow-neon-red hover:scale-105 transition-transform">Upgrade Now</button>
              </div>
           </div>
        </div>
      </div>
    );
  };
  
  // --- Render Lyrics Modal ---
  const renderLyricsModal = () => {
    if (!currentSong?.lyrics) return null;
    const parsedLyrics = parseLyrics(currentSong.lyrics);
    
    // Find active line
    const activeIndex = parsedLyrics.findIndex((line, index) => {
      const nextLine = parsedLyrics[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    return (
      <div className="fixed inset-0 z-50 bg-cyber-black/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
         <div className="flex justify-between items-center mb-6 shrink-0">
            <div className="flex items-center gap-4">
               <img src={currentSong.coverUrl} className="w-16 h-16 rounded-lg shadow-lg" alt={currentSong.title} />
               <div>
                  <h2 className="text-2xl font-bold text-white">{currentSong.title}</h2>
                  <p className="text-gray-400">{currentSong.artist}</p>
               </div>
            </div>
            <button 
              onClick={() => setShowLyrics(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
               <X className="w-6 h-6" />
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar text-center px-4 relative">
             <div className="py-[50vh]">
               {parsedLyrics.length > 0 ? (
                 parsedLyrics.map((line, index) => (
                   <p 
                    key={index} 
                    ref={el => {
                      if (index === activeIndex && el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={`transition-all duration-300 my-6 cursor-pointer hover:text-white ${
                      index === activeIndex 
                        ? 'text-3xl md:text-4xl font-black text-cyber-red scale-105 shadow-neon-red' 
                        : 'text-xl md:text-2xl font-bold text-gray-600 blur-[1px]'
                    }`}
                   >
                     {line.text}
                   </p>
                 ))
               ) : (
                  // Fallback for non-timestamped lyrics
                  <pre className="font-sans text-xl md:text-2xl font-bold leading-loose text-gray-300 whitespace-pre-wrap">
                    {currentSong.lyrics}
                  </pre>
               )}
             </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-cyber-black text-white overflow-hidden selection:bg-cyber-red selection:text-white font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />
      
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth custom-scrollbar">
        {/* Top Gradient Overlay */}
        <div className="sticky top-0 h-24 bg-gradient-to-b from-cyber-black via-cyber-black/90 to-transparent pointer-events-none z-20"></div>

        <div className="px-4 md:px-8 -mt-10 min-h-screen">
          {activeTab === Tab.HOME && renderHome()}
          {activeTab === Tab.SEARCH && renderSearch()}
          {activeTab === Tab.FAVORITES && renderFavorites()}
          {activeTab === Tab.HISTORY && renderHistory()}
          {activeTab === Tab.PROFILE && renderProfile()}
        </div>
      </main>

      {showLyrics && renderLyricsModal()}

      <Player 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        isFavorite={currentSong ? favorites.includes(currentSong.id) : false}
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleLyrics={() => setShowLyrics(!showLyrics)}
        onToggleFavorite={() => currentSong && toggleFavorite(currentSong.id)}
        onTimeUpdate={setCurrentTime}
      />
    </div>
  );
};

export default App;