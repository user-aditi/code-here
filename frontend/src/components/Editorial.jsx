import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl group border border-white/10 bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer object-cover"
      />
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 transition-all duration-300 ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-primary btn-sm shadow-lg hover:scale-110 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
          </button>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full group/progress cursor-pointer">
            <span className="text-white/90 text-sm font-mono tracking-wider w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-2 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Number(e.target.value);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden group-hover/progress:h-2 transition-all">
                <div 
                  className="h-full bg-primary relative" 
                  style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md"></div>
                </div>
              </div>
            </div>
            <span className="text-white/60 text-sm font-mono tracking-wider w-12">
              {formatTime(duration || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;