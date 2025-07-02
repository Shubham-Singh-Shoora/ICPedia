
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Shield, Trophy, Play, BookOpen, Code, Users } from 'lucide-react';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Featured Images */}
            <div className="mb-8 flex justify-center space-x-8">
              <img 
                src="/lovable-uploads/8650c725-98fc-46ec-81fe-6f8e71664db9.png" 
                alt="AI Tutor Bot" 
                className="w-24 h-24 md:w-32 md:h-32 animate-float"
              />
              <img 
                src="/lovable-uploads/7616c929-6994-4ef6-a9ef-319a92c4d335.png" 
                alt="Online Learning" 
                className="w-24 h-24 md:w-32 md:h-32 animate-float delay-1000"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-headings font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ICPedia
            </h1>
            <h2 className="text-2xl md:text-3xl font-headings font-medium mb-8 text-accent">
              Learn Web3 on Web3. Your Personal AI Tutor for the Internet Computer.
            </h2>
            <Link to="/tutor">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-hover-purple text-white px-8 py-4 text-lg font-medium rounded-full glow-effect hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why ICPedia Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headings font-bold mb-4 text-accent">A Smarter Way to Learn</h2>
            <p className="text-xl text-subtle-text max-w-2xl mx-auto">
              Experience the future of education with AI-powered tutoring, blockchain privacy, and gamified learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card hover:glow-effect transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Brain className="w-16 h-16 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">AI-Powered Guidance</h3>
                <p className="text-subtle-text">
                  Interact with a speaking AI tutor that adapts to your pace, answers your questions, and provides real-time feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:glow-effect transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Shield className="w-16 h-16 text-secondary mx-auto" />
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Your Data, Your Canister</h3>
                <p className="text-subtle-text">
                  Your learning journey is stored privately on the Internet Computer in your own canister. No third-party tracking, ever.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:glow-effect transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Trophy className="w-16 h-16 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Learn by Doing</h3>
                <p className="text-subtle-text">
                  Master complex topics through interactive quizzes, code challenges, and rewarding gamification that keeps you motivated.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Functionalities Section */}
      <section className="py-20 bg-shadow-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headings font-bold mb-4 text-accent">Master the ICP Ecosystem</h2>
            <p className="text-xl text-subtle-text max-w-2xl mx-auto">
              Choose your learning path and dive deep into the technologies that power the Internet Computer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/videos" className="group">
              <Card className="glass-card hover:glow-effect transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img 
                      src="/lovable-uploads/a6ab8d7d-b9d7-4ba8-9f24-8e11492cb8b0.png" 
                      alt="Course Learning" 
                      className="w-20 h-20 mx-auto rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Learn ICP Fundamentals</h3>
                  <p className="text-subtle-text">
                    Dive into the core concepts of the Internet Computer, from chain-key cryptography to the Network Nervous System.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/videos" className="group">
              <Card className="glass-card hover:glow-effect transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <Code className="w-16 h-16 text-secondary mx-auto" />
                  </div>
                  <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Code in Motoko</h3>
                  <p className="text-subtle-text">
                    Learn Motoko from scratch. Write, compile, and deploy your first smart contracts directly from your browser.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/videos" className="group">
              <Card className="glass-card hover:glow-effect transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img 
                      src="/lovable-uploads/fc1ca50c-9fd6-46b8-b736-3fa24b7e1181.png" 
                      alt="Student Learning" 
                      className="w-20 h-20 mx-auto rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Build with Rust</h3>
                  <p className="text-subtle-text">
                    Leverage the power and safety of Rust to build high-performance decentralized applications on ICP.
                  </p>
                </CardContent>
            </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/c93188d2-e08e-40bb-a92a-bc4b920f993c.png" 
                alt="Frustrated Learning" 
                className="w-32 h-32 mx-auto mb-6"
              />
            </div>
            <h2 className="text-4xl font-headings font-bold mb-6 text-accent">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl text-subtle-text mb-8">
              Join thousands of developers already mastering Web3 with our AI-powered platform.
            </p>
            <Link to="/tutor">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-hover-purple text-white px-8 py-4 text-lg font-medium rounded-full glow-effect hover:scale-105 transition-all duration-300"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
