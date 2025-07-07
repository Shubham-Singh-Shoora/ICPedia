import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface VideoCardProps {
  thumbnailUrl: string;
  title: string;
  duration: string;
  topic: string;
  progress: number;
  videoId: string;
  videoUrl: string; // ✅ make sure this prop is received
}

const VideoCard = ({
  thumbnailUrl,
  title,
  duration,
  topic,
  progress,
  videoId,
  videoUrl,
}: VideoCardProps) => {
  return (
    <Card className="glass-card transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-48">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={title}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-48 rounded-t-lg"
            ></iframe>
          ) : (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          {/* {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )} */}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-primary text-white">
              {topic}
            </Badge>
            <div className="flex items-center text-subtle-text text-sm">
              {/* <Clock className="w-4 h-4 mr-1" />
              {duration}
            </div> */}
            </div>
            <h3 className="text-lg font-headings font-semibold text-accent mb-2 line-clamp-2">
              {title}
            </h3>
            {/* {progress > 0 && (
            <p className="text-sm text-subtle-text">{progress}% complete</p>
          )} */}
          </div>
          </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
