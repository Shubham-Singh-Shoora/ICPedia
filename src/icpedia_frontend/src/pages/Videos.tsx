
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Videos = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'ICP', 'Motoko', 'Rust'];

  // Mock data - replace with actual data from backend
  const videos = [
    {
      id: '1',
      thumbnailUrl: '/lovable-uploads/a6ab8d7d-b9d7-4ba8-9f24-8e11492cb8b0.png',
      title: 'Introduction to Internet Computer',
      duration: '15:30',
      topic: 'ICP',
      progress: 75
    },
    {
      id: '2',
      thumbnailUrl: '/lovable-uploads/7616c929-6994-4ef6-a9ef-319a92c4d335.png',
      title: 'Getting Started with Motoko',
      duration: '22:15',
      topic: 'Motoko',
      progress: 0
    },
    {
      id: '3',
      thumbnailUrl: '/lovable-uploads/8650c725-98fc-46ec-81fe-6f8e71664db9.png',
      title: 'Building Canisters with Rust',
      duration: '28:45',
      topic: 'Rust',
      progress: 30
    },
    {
      id: '4',
      thumbnailUrl: '/lovable-uploads/fc1ca50c-9fd6-46b8-b736-3fa24b7e1181.png',
      title: 'Advanced ICP Concepts',
      duration: '35:20',
      topic: 'ICP',
      progress: 0
    }
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
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeFilter === filter 
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

      <Footer />
    </div>
  );
};

export default Videos;
