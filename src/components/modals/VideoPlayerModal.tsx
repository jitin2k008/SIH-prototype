import React, { useState } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  timestamp?: string;
  geoCoords?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  title = 'Direct Farm Bagging Verification Record',
  timestamp = 'Recorded 24 Oct, 02:10 PM',
  geoCoords = '21.9619° N, 70.7923° E',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-black/10 relative">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#3a692f]">verified_user</span>
            <div>
              <h3 className="font-bold text-sm text-[#1c1c18]">{title}</h3>
              <p className="text-[10px] text-[#73787b]">Cryptographically Time-stamped Video Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Simulation Canvas / Frame */}
        <div className="mt-4 rounded-xl overflow-hidden relative bg-black aspect-video flex items-center justify-center group shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDcTJ6b-WRj-Y6s7ug4RN1SbGuyfeHY7z8jPdmhl6ZQC-ZxayTMPq7g_FFLFLsWw1N39Q9LzX8MBcMZ6NvUrGbahFXyk3Y9kOvLhcqCp4r7P5080rotdIDnUAPXJ1qaoPJ1zs8waUO6T6WWo6n9MuoAo3kuu3hVErrXTRkH8c850rb8hwUsX-yi1GhJseg2_NX7BTsCugyt5D2QSadAG1kIXf7rpaSkExDpMlPPJPnLeqs5eOXtz_E"
            alt="Farm warehouse bagging verification"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Video OSD Overlays */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>GEO-TAG: {geoCoords}</span>
          </div>

          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-mono">
            {timestamp}
          </div>

          {/* Central Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#1c1c18] shadow-lg transition-transform active:scale-95"
            aria-label="Play or pause verification video"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Bottom Video Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col gap-1">
            <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#b8eea5] h-full transition-all duration-300"
                style={{ width: isPlaying ? '64%' : '20%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/80 font-mono">
              <span>00:42 / 01:05</span>
              <span>1080p HD • Tamper Proof SHA-256</span>
            </div>
          </div>
        </div>

        {/* Verification Summary */}
        <div className="mt-3 p-3 bg-[#fcf9f3] rounded-xl border border-black/5 text-xs text-[#43474b]">
          <div className="flex items-center gap-2 font-bold text-[#1d4d15] mb-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>All 40 Gunny Jute Sacks Weighed & Double Stitched in Presence of Mandi Surveyor</span>
          </div>
          <p className="text-[11px] text-[#73787b]">
            Bag weights range between 50.1 kg - 50.2 kg. Verified zero pest or stones detected.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-bold hover:bg-[#1d4d15]"
          >
            Close Audit Player
          </button>
        </div>
      </div>
    </div>
  );
};
