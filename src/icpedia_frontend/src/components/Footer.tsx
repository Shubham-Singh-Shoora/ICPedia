
import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-shadow-blue border-t border-border-color mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-2xl font-headings font-bold text-accent">ICPedia</span>
            </div>
            <p className="text-subtle-text">
              Your Personal AI Tutor for the Internet Computer. Learn Web3 on Web3.
            </p>
          </div>

          {/* Learn Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-headings font-semibold text-accent">Learn</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/videos" className="text-subtle-text hover:text-primary transition-colors">
                ICP Fundamentals
              </Link>
              <Link to="/videos" className="text-subtle-text hover:text-primary transition-colors">
                Motoko
              </Link>
              <Link to="/videos" className="text-subtle-text hover:text-primary transition-colors">
                Rust
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-headings font-semibold text-accent">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/videos" className="text-subtle-text hover:text-primary transition-colors">
                Videos
              </Link>
              <Link to="/quizzes" className="text-subtle-text hover:text-primary transition-colors">
                Quizzes
              </Link>
              <Link to="/libraries" className="text-subtle-text hover:text-primary transition-colors">
                Libraries
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-headings font-semibold text-accent">Company</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-subtle-text hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/terms" className="text-subtle-text hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-subtle-text hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center">
          <p className="text-subtle-text">
            © 2024 ICPedia. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-subtle-text hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-subtle-text hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-subtle-text hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
