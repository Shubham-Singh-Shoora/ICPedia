
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, Play, Code } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Profile = () => {
  // Mock user data - replace with actual data from backend
  const userData = {
    name: 'John Doe',
    principal: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
    joinDate: '2024-01-15',
    totalXP: 2850,
    level: 7,
    completedCourses: 12,
    totalQuizzes: 28,
    averageScore: 87
  };

  const achievements = [
    { name: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: true },
    { name: 'Motoko Master', description: 'Completed all Motoko courses', icon: '⚡', earned: true },
    { name: 'Quick Learner', description: 'Scored 90%+ on 5 quizzes', icon: '🚀', earned: false },
    { name: 'Rust Expert', description: 'Completed all Rust courses', icon: '🦀', earned: false }
  ];

  const recentActivity = [
    { type: 'video', title: 'Advanced ICP Concepts', progress: 75, date: '2024-01-20' },
    { type: 'quiz', title: 'Motoko Basics Assessment', score: 92, date: '2024-01-19' },
    { type: 'video', title: 'Building Canisters with Rust', progress: 100, date: '2024-01-18' },
    { type: 'quiz', title: 'ICP Fundamentals Quiz', score: 85, date: '2024-01-17' }
  ];

  const topicProgress = [
    { topic: 'ICP Fundamentals', progress: 85, color: 'bg-primary' },
    { topic: 'Motoko', progress: 92, color: 'bg-secondary' },
    { topic: 'Rust', progress: 68, color: 'bg-success-green' }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-6">
                    <span className="text-2xl font-bold text-white">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-headings font-bold text-accent mb-2">
                      {userData.name}
                    </h1>
                    <p className="text-subtle-text font-mono text-sm mb-2">
                      {userData.principal}
                    </p>
                    <p className="text-subtle-text">
                      Member since {new Date(userData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-1">
                    Level {userData.level}
                  </div>
                  <div className="text-subtle-text">
                    {userData.totalXP} XP
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-accent">
                      {userData.completedCourses}
                    </div>
                    <div className="text-subtle-text">Courses Completed</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-accent">
                      {userData.totalQuizzes}
                    </div>
                    <div className="text-subtle-text">Quizzes Taken</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-accent">
                      {userData.averageScore}%
                    </div>
                    <div className="text-subtle-text">Average Score</div>
                  </CardContent>
                </Card>
              </div>

              {/* Topic Progress */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-headings font-semibold text-accent mb-6">
                    Learning Progress
                  </h2>
                  <div className="space-y-6">
                    {topicProgress.map((topic, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-accent font-medium">{topic.topic}</span>
                          <span className="text-subtle-text text-sm">{topic.progress}%</span>
                        </div>
                        <Progress value={topic.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-headings font-semibold text-accent mb-6">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-shadow-blue rounded-lg">
                        <div className="flex items-center">
                          {activity.type === 'video' ? (
                            <Play className="w-5 h-5 text-primary mr-3" />
                          ) : (
                            <Trophy className="w-5 h-5 text-secondary mr-3" />
                          )}
                          <div>
                            <div className="text-accent font-medium">{activity.title}</div>
                            <div className="text-subtle-text text-sm">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {'progress' in activity ? (
                            <div className="text-accent">{activity.progress}% complete</div>
                          ) : (
                            <div className="text-secondary font-bold">{activity.score}%</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Achievements */}
            <div>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-headings font-semibold text-accent mb-6">
                    Achievements
                  </h2>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'bg-shadow-blue border-border-color'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              achievement.earned ? 'text-accent' : 'text-subtle-text'
                            }`}>
                              {achievement.name}
                            </div>
                            {achievement.earned && (
                              <Badge variant="secondary" className="bg-primary text-white text-xs">
                                Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-subtle-text text-sm">
                          {achievement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
