
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuizCard from '@/components/QuizCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Quizzes = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'ICP', 'Motoko', 'Rust'];

  // Mock data - replace with actual data from backend
  const quizzes = [
    {
      id: '1',
      title: 'ICP Fundamentals Quiz',
      topic: 'ICP',
      difficulty: 'Easy' as const,
      questionCount: 10,
      bestScore: 85
    },
    {
      id: '2',
      title: 'Motoko Basics Assessment',
      topic: 'Motoko',
      difficulty: 'Medium' as const,
      questionCount: 15,
      bestScore: null
    },
    {
      id: '3',
      title: 'Rust for ICP Challenge',
      topic: 'Rust',
      difficulty: 'Hard' as const,
      questionCount: 20,
      bestScore: 92
    },
    {
      id: '4',
      title: 'Network Nervous System Deep Dive',
      topic: 'ICP',
      difficulty: 'Hard' as const,
      questionCount: 25,
      bestScore: 78
    }
  ];

  const filteredQuizzes = activeFilter === 'All' 
    ? quizzes 
    : quizzes.filter(quiz => quiz.topic === activeFilter);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headings font-bold text-accent mb-4">
            Test Your Knowledge
          </h1>
          <p className="text-xl text-subtle-text max-w-2xl mx-auto">
            Apply what you've learned and earn rewards through interactive quizzes and challenges.
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

        {/* Quizzes List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quizId={quiz.id}
              title={quiz.title}
              topic={quiz.topic}
              difficulty={quiz.difficulty}
              questionCount={quiz.questionCount}
              bestScore={quiz.bestScore}
            />
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-subtle-text text-lg">
              No quizzes found for the selected filter.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Quizzes;
