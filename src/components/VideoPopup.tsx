import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';

interface VideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: string;
  videoUrl?: string;
  title?: string;
}

export default function VideoPopup({ isOpen, onClose, videoId, videoUrl, title }: VideoPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPlaying) {
        // Send pause command
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        // Send play command
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isOpen) return null;

  // Extract video ID from URL if videoUrl is provided
  const getVideoId = () => {
    if (videoId) return videoId;
    if (videoUrl) {
      // Handle various YouTube URL formats including shorts
      const match = videoUrl.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([^&\n?#]+)/);
      return match ? match[1] : 'dQw4w9WgXcQ'; // fallback
    }
    return 'dQw4w9WgXcQ'; // fallback
  };

  const finalVideoId = getVideoId();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${finalVideoId}?enablejsapi=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&autoplay=0`}
            title={title || "Video Player"}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Custom Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={handlePlayPause}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-all duration-300 pointer-events-auto"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-4">
          <p className="text-white text-sm opacity-75">
            Cliquez sur le bouton pour contrôler la lecture
          </p>
        </div>
      </div>
    </div>
  );
}
