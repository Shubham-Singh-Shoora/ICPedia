
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import { userCanisterService } from '@/services/userCanisterService';

const Videos = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    url: string;
    title: string;
  } | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});

  const filters = ['All', 'ICP', 'Motoko', 'Rust'];

  // Update video progress based on completed videos
  useEffect(() => {
    const newProgress: { [key: string]: number } = {};
    completedVideos.forEach(videoId => {
      newProgress[videoId] = 100;
    });
    setVideoProgress(newProgress);
  }, [completedVideos]);

  // Load user's video progress on component mount
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const canisterId = import.meta.env.VITE_USER_CANISTER_ID;
        if (canisterId && userCanisterService) {
          await userCanisterService.init(canisterId);
          // TODO: Load user's video completion status from canister
          // For now, we'll use localStorage as fallback
          const savedProgress = localStorage.getItem('videoProgress');
          if (savedProgress) {
            setVideoProgress(JSON.parse(savedProgress));
          }
          const savedCompleted = localStorage.getItem('completedVideos');
          if (savedCompleted) {
            setCompletedVideos(new Set(JSON.parse(savedCompleted)));
          }
        }
      } catch (error) {
        console.warn('Could not load user progress:', error);
      }
    };

    loadUserProgress();
  }, []);

  const handleVideoClick = (videoId: string, videoUrl: string, title: string) => {
    setSelectedVideo({ id: videoId, url: videoUrl, title });
  };

  const handleVideoComplete = async (videoId: string) => {
    try {
      // Update local state
      setCompletedVideos(prev => new Set(prev).add(videoId));
      setVideoProgress(prev => ({ ...prev, [videoId]: 100 }));

      // Save to localStorage
      const newCompleted = Array.from(new Set([...completedVideos, videoId]));
      localStorage.setItem('completedVideos', JSON.stringify(newCompleted));
      localStorage.setItem('videoProgress', JSON.stringify({
        ...videoProgress,
        [videoId]: 100
      }));

      // TODO: Save to canister
      if (userCanisterService.isInitialized()) {
        await userCanisterService.storeMessage(
          'User',
          `Completed video: ${videos.find(v => v.id === videoId)?.title || videoId}`,
          undefined,
          undefined
        );
      }
    } catch (error) {
      console.error('Error marking video as complete:', error);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Mock data - replace with actual data from backend

  const videos = [

    {
      id: '1',
      thumbnailUrl: 'https://img.youtube.com/vi/sFtBDE7nYTA/hqdefault.jpg',
      title: 'ICP Video 1',
      duration: '15:30',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/sFtBDE7nYTA?autoplay=0'
    },
    {
      id: '2',
      thumbnailUrl: 'https://img.youtube.com/vi/zxt16F2CqBY/hqdefault.jpg',
      title: 'ICP Video 2',
      duration: '18:00',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/zxt16F2CqBY?autoplay=0'
    },
    {
      id: '3',
      thumbnailUrl: 'https://img.youtube.com/vi/yEDdme2dH8Y/hqdefault.jpg',
      title: 'ICP Video 3',
      duration: '20:00',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/yEDdme2dH8Y?autoplay=0'
    },
    {
      id: '4',
      thumbnailUrl: 'https://img.youtube.com/vi/Z77ay0qjkJg/hqdefault.jpg',
      title: 'ICP Video 4',
      duration: '22:10',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/Z77ay0qjkJg?autoplay=0'
    },
    {
      id: '5',
      thumbnailUrl: 'https://img.youtube.com/vi/--2a6iCuav0/hqdefault.jpg',
      title: 'ICP Video 5',
      duration: '25:30',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/--2a6iCuav0?autoplay=0'
    },
    {
      id: '6',
      thumbnailUrl: 'https://img.youtube.com/vi/ehG9V3E1oeQ/hqdefault.jpg',
      title: 'ICP Video 6',
      duration: '24:45',
      topic: 'ICP',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/ehG9V3E1oeQ?autoplay=0'
    },
    {
      id: '7',
      thumbnailUrl: '/lovable-uploads/rust1.png',
      title: 'Rust Basics for ICP',
      duration: '16:10',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/qT5YeRZ_DYY?autoplay=0',
    },
    {
      id: '8',
      thumbnailUrl: '/lovable-uploads/rust2.png',
      title: 'Rust Canisters & Project Setup',
      duration: '18:22',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/zb9OQUOqNKo?autoplay=0',
    },
    {
      id: '9',
      thumbnailUrl: '/lovable-uploads/rust3.png',
      title: 'Stable Memory in Rust',
      duration: '12:45',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/UbNXh_hWdiE?autoplay=0',
    },
    {
      id: '10',
      thumbnailUrl: '/lovable-uploads/rust4.png',
      title: 'Handling State in Rust',
      duration: '14:00',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/spyUzz20B04?autoplay=0',
    },
    {
      id: '11',
      thumbnailUrl: '/lovable-uploads/rust5.png',
      title: 'Rust Canister Upgrades',
      duration: '13:30',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/9nXB5DftZ94?autoplay=0',
    },
    {
      id: '12',
      thumbnailUrl: '/lovable-uploads/rust6.png',
      title: 'Rust Testing & Deployment',
      duration: '15:50',
      topic: 'Rust',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/AZqcrMamZnE?autoplay=0',
    },
    {
      id: '13',
      thumbnailUrl: '/lovable-uploads/motoko1.png',
      title: 'Motoko Syntax & Basics',
      duration: '15:20',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/H3Z4K63JMo0?autoplay=0',
    },
    {
      id: '14',
      thumbnailUrl: '/lovable-uploads/motoko2.png',
      title: 'Motoko Functions & Variables',
      duration: '14:10',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/jqEsz5vKjBs?autoplay=0',
    },
    {
      id: '15',
      thumbnailUrl: '/lovable-uploads/motoko3.png',
      title: 'Actors & Canisters in Motoko',
      duration: '16:35',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/jlzGypWchIE?autoplay=0',
    },
    {
      id: '16',
      thumbnailUrl: '/lovable-uploads/motoko4.png',
      title: 'Stable Variables in Motoko',
      duration: '13:45',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/wzHIEJvtaQ4?autoplay=0',
    },
    {
      id: '17',
      thumbnailUrl: '/lovable-uploads/motoko5.png',
      title: 'Data Types and Options',
      duration: '12:40',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/X1Bl08B6ti4?autoplay=0',
    },
    {
      id: '18',
      thumbnailUrl: '/lovable-uploads/motoko6.png',
      title: 'Motoko Collections: Arrays & Maps',
      duration: '14:55',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/SzSzm8G3sT0?autoplay=0',
    },
    {
      id: '19',
      thumbnailUrl: '/lovable-uploads/motoko7.png',
      title: 'Inter-canister Calls in Motoko',
      duration: '13:10',
      topic: 'Motoko',
      progress: 0,
      videoUrl: 'https://www.youtube.com/embed/yLv-juJ0PnQ?autoplay=0',
    },
  ];

  // Update videos with progress
  const videosWithProgress = videos.map(video => ({
    ...video,
    progress: videoProgress[video.id] || 0
  }));

  const filteredVideos = activeFilter === 'All'
    ? videosWithProgress
    : videosWithProgress.filter(video => video.topic === activeFilter);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headings font-bold mb-6 text-gradient">
            Video Library
          </h1>
          <p className="text-xl text-subtle-text max-w-3xl mx-auto leading-relaxed mb-8">
            Master the Internet Computer with our comprehensive video collection.
            From basic concepts to advanced development techniques, learn at your own pace.
          </p>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-subtle-text">Your Progress</span>
              <span className="text-sm text-accent font-medium">
                {completedVideos.size} / {videos.length} completed
              </span>
            </div>
            <div className="w-full bg-shadow-blue rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 glow-effect"
                style={{ width: `${(completedVideos.size / videos.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 premium-card p-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "ghost"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${activeFilter === filter
                  ? 'bg-primary text-white glow-effect'
                  : 'text-subtle-text hover:text-accent hover:bg-shadow-blue'
                  }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              videoId={video.id}
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              duration={video.duration}
              topic={video.topic}
              progress={video.progress}
              videoUrl={video.videoUrl}
              onVideoClick={handleVideoClick}
            />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-headings font-semibold text-accent mb-2">
              No videos found
            </h3>
            <p className="text-subtle-text">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}
      </div>
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.id}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={closeVideoModal}
          onComplete={handleVideoComplete}
          isCompleted={completedVideos.has(selectedVideo.id)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Videos;
