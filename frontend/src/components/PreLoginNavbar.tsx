import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/globelogo.svg';

const PreLoginNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="GlobeMates" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              to="/about" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900/25 hover:bg-gray-900/100 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900/25 hover:bg-gray-900/100 transition-colors"
            >
              Privacy
            </Link>
            {/* <Link 
              to="/login" 
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#FF9C00', color: '#000' }}
            >
              Create Account
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <div className="flex flex-col gap-2 mt-2">
                <Link 
                  to="/login" 
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors text-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors text-center"
                  style={{ backgroundColor: '#FF9C00', color: '#000' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PreLoginNavbar;

