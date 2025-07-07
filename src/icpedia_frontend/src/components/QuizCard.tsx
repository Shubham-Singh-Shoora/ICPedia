
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

interface QuizCardProps {
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  bestScore: number | null;
  quizId: string;
}

const QuizCard = ({ title, topic, difficulty, questionCount, bestScore, quizId }: QuizCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-green';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-error-red';
      default: return 'bg-primary';
    }
  };

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'ICP': return '🌐';
      case 'Motoko': return '⚡';
      case 'Rust': return '🦀';
      default: return '📚';
    }
  };

  return (
    <Card className="glass-card hover:glow-effect transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{getTopicIcon(topic)}</span>
              <div>
                <h3 className="text-xl font-headings font-semibold text-accent mb-1">
                  {title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary text-white">
                    {topic}
                  </Badge>
                  <Badge variant="outline" className={`${getDifficultyColor(difficulty)} text-white border-0`}>
                    {difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center text-subtle-text text-sm mb-4">
              <Clock className="w-4 h-4 mr-1" />
              {questionCount} questions
            </div>
          </div>
          
          <div className="text-right">
            {bestScore !== null ? (
              <div className="flex items-center text-secondary mb-2">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="text-lg font-semibold">{bestScore}%</span>
              </div>
            ) : (
              <div className="text-subtle-text mb-2">
                Not Attempted
              </div>
            )}
            <Button 
              className="bg-primary hover:bg-hover-purple text-white"
              onClick={() => {
                // TODO: Navigate to quiz
                console.log(`Starting quiz: ${quizId}`);
              }}
            >
              {bestScore !== null ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
