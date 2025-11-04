import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-globemates-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GlobeMates Logo */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-none flex items-center">
            <span>Gl</span>
            <Globe className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-2 text-white animate-spin-slow" style={{ animationDuration: '20s' }} />
            <span>beMates</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide">
            Terms of Use
          </a>
          <Link to="/features" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide">
            Features
          </Link>
          <Link to="/blog" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide">
            Blog
          </Link>
          <Link 
            to="/login" 
            className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide"
          >
            Sign In
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="text-center border-t border-white/10 pt-4">
          <p className="text-sm text-white/60">
            © 2025 GlobeMates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

