
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Shield, Trophy, Play, BookOpen, Code, Users, Star, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { AuthClient } from '@dfinity/auth-client';
import Footer from '@/components/Footer';

const Index = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleStartJourney = async () => {
    setIsAuthenticating(true);

    try {
      // Create auth client with longer timeout
      const authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });

      // Check if user is already authenticated
      const isAuthenticated = await authClient.isAuthenticated();

      if (isAuthenticated) {
        // User is already authenticated, redirect to tutor
        console.log('User already authenticated, redirecting to tutor');
        window.location.href = '/tutor';
        return;
      }

      // Configure Internet Identity based on environment
      const isLocal = import.meta.env.VITE_DFX_NETWORK === 'local';
      const LOCAL_II_CANISTER_ID = import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID;
      const LOCAL_REPLICA_PORT = import.meta.env.VITE_LOCAL_REPLICA_PORT || 4943;

      let identityProvider;
      identityProvider = 'https://identity.ic0.app';

      console.log('Environment variables:', {
        VITE_DFX_NETWORK: import.meta.env.VITE_DFX_NETWORK,
        VITE_INTERNET_IDENTITY_CANISTER_ID: import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID,
        VITE_LOCAL_REPLICA_PORT: import.meta.env.VITE_LOCAL_REPLICA_PORT,
        isLocal,
        identityProvider
      });

      console.log('Starting Internet Identity authentication with:', identityProvider);

      // Start Internet Identity authentication
      await authClient.login({
        identityProvider,
        windowOpenerFeatures: 'width=525,height=525,left=100,top=100',
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
        onSuccess: async () => {
          console.log('Authentication successful!');
          const identity = authClient.getIdentity();
          console.log('User principal:', identity.getPrincipal().toString());
          setIsAuthenticating(false);
          window.location.href = '/tutor';
        },
        onError: (error) => {
          console.error('Authentication failed:', error);
          alert('Authentication failed. Please try again. Error: ' + error);
          setIsAuthenticating(false);
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication error. Please try again. Error: ' + error);
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-2 h-2 bg-secondary rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-40 w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse delay-3000"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/icpedia_logo.png"
                alt="ICPedia Logo"
                className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 floating-element"
              />
            </div>

            {/* Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-headings font-bold mb-6 text-gradient">
                  Master Web3
                  <br />
                  with AI-Powered
                  <br />
                  Education
                </h1>
                <p className="text-xl md:text-2xl text-subtle-text mb-8 leading-relaxed">
                  Experience the future of learning with personalized AI tutoring,
                  blockchain-secured progress, and hands-on Internet Computer development.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    onClick={handleStartJourney}
                    size="lg"
                    className="bg-primary hover:bg-hover-purple text-white px-8 py-4 text-lg font-medium rounded-full glow-effect hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthenticating ? 'Authenticating...' : 'Start Your Journey'}
                    {!isAuthenticating && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-subtle-text">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>10,000+ Students</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/Course app-pana.png"
                    alt="Course Learning"
                    className="w-full h-48 object-cover rounded-2xl premium-card floating-element"
                  />
                  <img
                    src="/Webinar-amico.png"
                    alt="Interactive Learning"
                    className="w-full h-48 object-cover rounded-2xl premium-card floating-element delay-1000"
                  />
                  <img
                    src="/Raising hand-bro.png"
                    alt="Student Engagement"
                    className="w-full h-48 object-cover rounded-2xl premium-card floating-element delay-2000"
                  />
                  <img
                    src="/Student stress-cuate.png"
                    alt="Stress-Free Learning"
                    className="w-full h-48 object-cover rounded-2xl premium-card floating-element delay-3000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headings font-bold mb-6 text-accent">
              Why Choose <span className="text-gradient">ICPedia</span>?
            </h2>
            <p className="text-xl text-subtle-text max-w-3xl mx-auto leading-relaxed">
              Experience revolutionary learning with cutting-edge AI technology,
              blockchain security, and gamified education tailored for the Web3 era.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="premium-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">AI-Powered Personalization</h3>
                <p className=" text-white leading-relaxed">
                  Our advanced AI tutor adapts to your learning style, provides real-time feedback,
                  and creates personalized study paths that evolve with your progress.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-success-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>Voice-enabled interactions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Blockchain-Secured Privacy</h3>
                <p className=" text-white leading-relaxed ">
                  Your learning data is stored securely on the Internet Computer in your own canister.
                  Complete privacy, no tracking, and full ownership of your educational journey.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-success-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>Decentralized data storage</span>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Gamified Learning Experience</h3>
                <p className=" text-white leading-relaxed">
                  Master complex Web3 concepts through interactive challenges, code competitions,
                  and achievement systems that make learning addictive and rewarding.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-success-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>Progressive skill building</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-shadow-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headings font-bold mb-6 text-accent">
              Master the <span className="text-gradient">ICP Ecosystem</span>
            </h2>
            <p className="text-xl text-subtle-text max-w-3xl mx-auto leading-relaxed">
              Choose your learning path and dive deep into the technologies that power the decentralized web.
              From fundamentals to advanced development, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <img
                    src="/Course app-pana.png"
                    alt="Course Learning"
                    className="w-24 h-24 mx-auto rounded-2xl object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">ICP Fundamentals</h3>
                <p className="text-subtle-text leading-relaxed mb-6">
                  Master the core concepts of the Internet Computer, from chain-key cryptography
                  to the Network Nervous System and decentralized governance.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Blockchain Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Consensus Mechanisms</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Network Governance</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="premium-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Motoko Development</h3>
                <p className="text-subtle-text leading-relaxed mb-6">
                  Learn Motoko from scratch. Write, compile, and deploy your first smart contracts
                  directly from your browser with our interactive coding environment.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Language Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Actor Model</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Live Deployment</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="premium-card group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <img
                    src="/Webinar-amico.png"
                    alt="Rust Development"
                    className="w-24 h-24 mx-auto rounded-2xl object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-headings font-semibold mb-4 text-accent">Rust for ICP</h3>
                <p className="text-subtle-text leading-relaxed mb-6">
                  Leverage the power and safety of Rust to build high-performance, secure
                  decentralized applications on the Internet Computer platform.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>CDK Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Memory Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-success-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Performance Optimization</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <img
                src="/Raising hand-bro.png"
                alt="Ready to Learn"
                className="w-32 h-32 mx-auto mb-8 floating-element"
              />
              <h2 className="text-4xl md:text-5xl font-headings font-bold mb-6 text-accent">
                Ready to <span className="text-gradient">Transform</span> Your Future?
              </h2>
              <p className="text-xl text-subtle-text mb-8 leading-relaxed max-w-2xl mx-auto">
                Join thousands of developers already building the decentralized future.
                Start your Web3 journey today with personalized AI guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                onClick={handleStartJourney}
                disabled={isAuthenticating}
                size="lg"
                className="bg-primary hover:bg-hover-purple text-white px-10 py-5 text-xl font-medium rounded-full glow-effect hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? 'Authenticating...' : 'Get Started Free'}
                {!isAuthenticating && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
              <div className="flex items-center gap-4 text-subtle-text">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-5 h-5 text-success-green" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-5 h-5 text-success-green" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-subtle-text">Active Students</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">500+</div>
                <div className="text-subtle-text">Interactive Lessons</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-success-green">95%</div>
                <div className="text-subtle-text">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
