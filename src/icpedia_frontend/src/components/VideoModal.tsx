import { X } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal = ({ videoUrl, onClose }: VideoModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video">
        <button onClick={onClose} className="absolute top-2 right-2 text-white z-10">
          <X size={24} />
        </button>
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title="YouTube Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;
