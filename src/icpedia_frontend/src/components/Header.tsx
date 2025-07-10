
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { AuthClient } from '@dfinity/auth-client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authClient = await AuthClient.create();
        const authenticated = await authClient.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          setUserPrincipal(principal);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
      setIsAuthenticated(false);
      setUserPrincipal('');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: import.meta.env.VITE_DFX_NETWORK === 'local'
          ? `http://127.0.0.1:${import.meta.env.VITE_LOCAL_REPLICA_PORT || 4943}/?canisterId=${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}`
          : 'https://identity.ic0.app',
        onSuccess: () => {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const navLinks = [
    { name: 'AI Tutor', href: '/tutor' },
    { name: 'Videos', href: '/videos' },
    { name: 'Quizzes', href: '/quizzes' },
    { name: 'Libraries', href: '/libraries' },
    { name: 'Resources', href: '/resources' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-border-color">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/icpedia_logo.png" alt="ICPedia" className="w-8 h-8" />
            <span className="text-xl font-headings font-bold text-gradient">ICPedia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.href
                    ? 'text-primary'
                    : 'text-subtle-text hover:text-accent'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm text-accent">{userPrincipal.slice(0, 8)}...</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-border-color hover:bg-shadow-blue"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                variant="outline"
                size="sm"
                className="border-border-color hover:bg-shadow-blue"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-shadow-blue border-t border-border-color">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block text-sm font-medium transition-colors duration-200 ${location.pathname === link.href
                    ? 'text-primary'
                    : 'text-subtle-text hover:text-accent'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border-color">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm text-accent">{userPrincipal.slice(0, 8)}...</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-border-color hover:bg-shadow-blue"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="w-full border-border-color hover:bg-shadow-blue"
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
