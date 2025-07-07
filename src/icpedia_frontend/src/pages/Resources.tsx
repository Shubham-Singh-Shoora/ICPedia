
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, FileText, Users, Github } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Resources = () => {
  const articles = [
    {
      title: 'The Internet Computer: A New Vision for the Web',
      summary: 'Understanding the revolutionary blockchain that hosts smart contracts at web speed.',
      source: 'DFINITY Blog',
      link: 'https://medium.com/dfinity/the-internet-computer-a-new-vision-for-the-web-5f4b8c6c5a7f'
    },
    {
      title: 'Introduction to Motoko',
      summary: 'Learn about the actor-based programming language designed for the Internet Computer.',
      source: 'IC Developer Portal',
      link: 'https://internetcomputer.org/docs/motoko/intro/motoko-introduction'
    },
    {
      title: 'Building Secure Smart Contracts',
      summary: 'Best practices for developing secure canisters on the Internet Computer.',
      source: 'IC Wiki',
      link: 'https://wiki.internetcomputer.org/wiki/Secure_coding_practices'
    }
  ];

  const whitepapers = [
    {
      title: 'Internet Computer Whitepaper',
      description: 'The foundational paper describing the Internet Computer protocol and architecture.',
      link: 'https://internetcomputer.org/whitepaper.pdf'
    },
    {
      title: 'Chain Key Cryptography',
      description: 'Technical paper on the cryptographic protocols that power the Internet Computer.',
      link: 'https://internetcomputer.org/how-it-works/chain-key-technology'
    },
    {
      title: 'Network Nervous System',
      description: 'Detailed explanation of the IC\'s decentralized governance system.',
      link: 'https://internetcomputer.org/nns'
    }
  ];

  const communities = [
    {
      name: 'DFINITY Developer Forum',
      description: 'Official forum for IC developers to discuss, ask questions, and share knowledge.',
      icon: <Users className="w-8 h-8 text-primary" />,
      link: 'https://forum.dfinity.org'
    },
    {
      name: 'IC Developer Discord',
      description: 'Join the community Discord for real-time discussions and support.',
      icon: <Users className="w-8 h-8 text-secondary" />,
      link: 'https://discord.gg/cA7y6ezyE2'
    },
    {
      name: 'DFINITY GitHub',
      description: 'Explore open-source projects and contribute to the IC ecosystem.',
      icon: <Github className="w-8 h-8 text-primary" />,
      link: 'https://github.com/dfinity'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headings font-bold text-accent mb-4">
            Community & Resources
          </h1>
          <p className="text-xl text-subtle-text max-w-2xl mx-auto">
            Discover articles, whitepapers, and community hubs to deepen your understanding of the Internet Computer.
          </p>
        </div>

        {/* Essential Reading Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Essential Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <a 
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-hover-purple transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-lg font-headings font-semibold text-accent mb-2">
                    {article.title}
                  </h3>
                  <p className="text-subtle-text mb-3">
                    {article.summary}
                  </p>
                  <p className="text-sm text-primary">
                    {article.source}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Whitepapers Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Whitepapers
          </h2>
          <div className="space-y-4">
            {whitepapers.map((paper, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-headings font-semibold text-accent mb-2">
                        {paper.title}
                      </h3>
                      <p className="text-subtle-text">
                        {paper.description}
                      </p>
                    </div>
                    <a 
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-hover-purple transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Hubs Section */}
        <section>
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Community Hubs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communities.map((community, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {community.icon}
                    <h3 className="text-xl font-headings font-semibold text-accent ml-3">
                      {community.name}
                    </h3>
                  </div>
                  <p className="text-subtle-text mb-4">
                    {community.description}
                  </p>
                  <a 
                    href={community.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-hover-purple transition-colors"
                  >
                    Join Community
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
