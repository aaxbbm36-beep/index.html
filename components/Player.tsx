import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, ExternalLink, Youtube, Disc, Mic, Heart } from 'lucide-react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isFavorite?: boolean; // New prop
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLyrics?: () => void;
  onToggleFavorite?: () => void; // New prop
  onTimeUpdate?: (currentTime: number) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  isFavorite = false,
  onPlayPause, 
  onNext, 
  onPrev, 
  onToggleLyrics, 
  onToggleFavorite,
  onTimeUpdate 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);

  // Xử lý play/pause khi props thay đổi
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Playback prevented:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      
      // Update duration state if available
      if (Number.isFinite(dur) && dur > 0) {
        setDuration(dur);
        setProgress((current / dur) * 100);
      } else {
        setProgress(0);
      }

      // Sync lyrics
      if (onTimeUpdate) {
        onTimeUpdate(current);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (Number.isFinite(dur)) {
        setDuration(dur);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (Number.isFinite(dur) && dur > 0) {
        const seekTime = (Number(e.target.value) / 100) * dur;
        audioRef.current.currentTime = seekTime;
        setProgress(Number(e.target.value));
      }
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 h-24 bg-cyber-black/95 backdrop-blur-xl border-t border-cyber-red/30 z-40 px-4 md:px-8 flex items-center justify-between shadow-[0_-5px_20px_rgba(255,42,42,0.1)]">
      <audio
        key={currentSong.id} 
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
        preload="auto"
        autoPlay={isPlaying}
      />
      
      {/* Song Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
        <div className="relative group overflow-hidden rounded-md shrink-0">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className={`w-14 h-14 object-cover transition-transform duration-500 ${isPlaying ? 'animate-pulse' : ''}`} 
          />
        </div>
        <div className="flex flex-col overflow-hidden mr-2">
          <span className="text-white font-medium truncate glitch-text cursor-default hover:text-cyber-red transition-colors">{currentSong.title}</span>
          <span className="text-gray-400 text-xs truncate hover:text-cyber-orange cursor-pointer transition-colors">{currentSong.artist}</span>
        </div>
        {/* Heart / Favorite Button */}
        <button 
          onClick={onToggleFavorite}
          className={`ml-2 transition-transform active:scale-90 ${isFavorite ? 'text-cyber-red' : 'text-gray-500 hover:text-white'}`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]' : ''}`} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block"><Shuffle className="w-4 h-4" /></button>
          <button onClick={onPrev} className="text-gray-300 hover:text-cyber-red transition-colors"><SkipBack className="w-6 h-6 fill-current" /></button>
          
          <button 
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-cyber-red text-black flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-neon-red"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <button onClick={onNext} className="text-gray-300 hover:text-cyber-red transition-colors"><SkipForward className="w-6 h-6 fill-current" /></button>
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block"><Repeat className="w-4 h-4" /></button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-500 font-mono">
           <span className="w-8 text-right">{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
           <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={handleSeek}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyber-red [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-neon-red hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
          />
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Lyrics */}
      <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
        {onToggleLyrics && (
          <button 
            onClick={onToggleLyrics}
            className={`p-2 rounded-full transition-colors ${currentSong.lyrics ? 'text-white hover:text-cyber-orange' : 'text-gray-600 cursor-not-allowed'}`}
            title="Lời bài hát"
            disabled={!currentSong.lyrics}
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
        <Volume2 className="w-5 h-5 text-gray-400" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={volume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setVolume(val);
            if(audioRef.current) audioRef.current.volume = val;
          }}
          className="w-24 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        />
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default Player;