import { X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  videoId: string;
  videoUrl: string;
  title: string;
  onClose: () => void;
  onComplete: (videoId: string) => void;
  isCompleted: boolean;
}

const VideoModal = ({ videoId, videoUrl, title, onClose, onComplete, isCompleted }: VideoModalProps) => {
  const [hasWatched, setHasWatched] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0); useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Add mobile-specific styles
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileView = () => {
      if (mediaQuery.matches) {
        // Mobile styles
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
    };

    handleMobileView();
    mediaQuery.addEventListener('change', handleMobileView);

    // Set up a timer to track viewing progress
    const timer = setInterval(() => {
      setWatchProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 30 && !hasWatched) { // Consider watched after 30 seconds
          setHasWatched(true);
        }
        return newProgress;
      });
    }, 1000);

    // Add keyboard event listener for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Re-enable background scroll when modal closes
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      clearInterval(timer);
      document.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleMobileView);
    };
  }, [hasWatched, onClose]);

  const handleMarkComplete = () => {
    onComplete(videoId);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the video container background (not the iframe)
    // Also prevent closing on mobile touch to avoid accidental closes
    if (e.target === e.currentTarget && !('ontouchstart' in window)) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent accidental closes on mobile
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 bg-dark-bg z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      {/* Header - Fixed at top */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-dark-bg/95 backdrop-blur-sm border-b border-shadow-blue flex-shrink-0">
        <h2 id="video-title" className="text-lg sm:text-xl md:text-2xl font-headings font-bold text-accent truncate mr-4">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-subtle-text hover:text-accent transition-colors p-2 hover:bg-shadow-blue/50 rounded-full"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
      </div>

      {/* Video Player - Full remaining height */}
      <div
        className="flex-1 flex items-center justify-center bg-dark-bg relative overflow-hidden p-4 sm:p-6"
        onClick={handleBackdropClick}
        onTouchStart={handleTouchStart}
        style={{ minHeight: 'calc(100vh - 160px)' }}
      >
        <div className="w-full h-full relative flex items-center justify-center">
          <div
            className="w-full h-full max-w-7xl mx-auto"
            style={{
              aspectRatio: '16/9',
              maxHeight: 'calc(100vh - 200px)'
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`${videoUrl}&autoplay=1`}
              title={title}
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 outline-none rounded-lg shadow-2xl"
              style={{
                minHeight: '300px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls - Fixed at bottom */}
      <div className="p-4 sm:p-6 bg-dark-bg/95 backdrop-blur-sm border-t border-shadow-blue flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Watch Status */}
          <div className="flex items-center space-x-4">
            {hasWatched && (
              <div className="flex items-center text-primary">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm text-subtle-text">Watched for {Math.floor(watchProgress / 60)}:{(watchProgress % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {hasWatched && !isCompleted && (
              <Button
                onClick={handleMarkComplete}
                className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none"
                aria-label="Mark this video as completed"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
            {isCompleted && (
              <div className="flex items-center text-primary">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-shadow-blue text-subtle-text hover:border-primary hover:text-accent flex-1 sm:flex-none"
              aria-label="Close video player"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
