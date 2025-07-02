
import CodeCard from '@/components/CodeCard';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Book, Code, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Libraries = () => {
  const codeSnippets = [
    {
      title: 'Simple Motoko Actor',
      language: 'Motoko',
      description: 'A basic actor with a greeting function',
      code: `actor HelloWorld {
  public func greet(name : Text) : async Text {
    "Hello, " # name # "!"
  };
}`
    },
    {
      title: 'Rust Canister Query',
      language: 'Rust',
      description: 'Query function example in Rust',
      code: `#[ic_cdk::query]
fn get_balance() -> u64 {
    ic_cdk::storage::get::<u64>()
        .unwrap_or(0)
}`
    },
    {
      title: 'Internet Identity Integration',
      language: 'JavaScript',
      description: 'Connect to Internet Identity in your frontend',
      code: `import { AuthClient } from '@dfinity/auth-client';

const authClient = await AuthClient.create();
await authClient.login({
  identityProvider: 'https://identity.ic0.app'
});`
    }
  ];

  const sdks = [
    {
      name: 'dfx',
      description: 'The Internet Computer SDK for building and deploying canisters',
      icon: <Settings className="w-8 h-8 text-primary" />,
      link: 'https://github.com/dfinity/sdk'
    },
    {
      name: 'Candid',
      description: 'Interface description language for IC canisters',
      icon: <Code className="w-8 h-8 text-secondary" />,
      link: 'https://github.com/dfinity/candid'
    },
    {
      name: 'Internet Identity SDK',
      description: 'Authentication service for the Internet Computer',
      icon: <Book className="w-8 h-8 text-primary" />,
      link: 'https://github.com/dfinity/internet-identity'
    }
  ];

  const documentation = [
    {
      title: 'Internet Computer Developer Docs',
      description: 'Official documentation for IC development',
      link: 'https://internetcomputer.org/docs'
    },
    {
      title: 'Motoko Language Guide',
      description: 'Complete guide to the Motoko programming language',
      link: 'https://internetcomputer.org/docs/motoko'
    },
    {
      title: 'Rust CDK Documentation',
      description: 'Documentation for the Rust Canister Development Kit',
      link: 'https://docs.rs/ic-cdk'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headings font-bold text-accent mb-4">
            Developer Libraries
          </h1>
          <p className="text-xl text-subtle-text max-w-2xl mx-auto">
            Your toolkit for building on the Internet Computer. Find code snippets, SDKs, and documentation.
          </p>
        </div>

        {/* Code Snippets Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Reusable Code Snippets
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {codeSnippets.map((snippet, index) => (
              <CodeCard
                key={index}
                title={snippet.title}
                language={snippet.language}
                code={snippet.code}
                description={snippet.description}
              />
            ))}
          </div>
        </section>

        {/* SDKs & Tools Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Core SDKs & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {sdk.icon}
                    <h3 className="text-xl font-headings font-semibold text-accent ml-3">
                      {sdk.name}
                    </h3>
                  </div>
                  <p className="text-subtle-text mb-4">
                    {sdk.description}
                  </p>
                  <a 
                    href={sdk.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-hover-purple transition-colors"
                  >
                    View Documentation
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Official Documentation Section */}
        <section>
          <h2 className="text-2xl font-headings font-semibold text-accent mb-8">
            Official Documentation
          </h2>
          <div className="space-y-4">
            {documentation.map((doc, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-headings font-semibold text-accent mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-subtle-text">
                        {doc.description}
                      </p>
                    </div>
                    <a 
                      href={doc.link}
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
      </div>

      <Footer />
    </div>
  );
};

export default Libraries;
