
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';

const Videos = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const filters = ['All', 'ICP', 'Motoko', 'Rust'];

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

  const filteredVideos = activeFilter === 'All'
    ? videos
    : videos.filter(video => video.topic === activeFilter);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headings font-bold text-accent mb-4">
            Video Lessons
          </h1>
          <p className="text-xl text-subtle-text max-w-2xl mx-auto">
            Learn by watching. Our lessons break down complex topics into engaging, easy-to-follow videos.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-shadow-blue rounded-lg p-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "ghost"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'text-subtle-text hover:text-accent'
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
              
            />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-subtle-text text-lg">
              No videos found for the selected filter.
            </p>
          </div>
        )}
      </div>
      {selectedVideoUrl && (
        <VideoModal
          videoUrl={selectedVideoUrl}
          onClose={() => setSelectedVideoUrl(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Videos;
