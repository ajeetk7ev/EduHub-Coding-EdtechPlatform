
import { Linkedin, Instagram, Twitter, Youtube, GraduationCap } from 'lucide-react';
// The Link component is imported from a routing library, such as 'react-router-dom'.
// Note: This component needs to be rendered inside a Router (e.g., BrowserRouter) to work correctly.
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        {/* Company Info Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-gray-200">EduHub</span>
          </div>
          <p className="text-sm">
            Empowering the next generation of developers with hands-on, practical coding skills.
            Join us to transform your career.
          </p>
        </div>

        {/* Navigation Links - Courses */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Courses</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition-colors duration-300">
                Full Stack Development
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition-colors duration-300">
                Data Science
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition-colors duration-300">
                Frontend Mastery
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition-colors duration-300">
                Backend Engineering
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation Links - Resources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/blog" className="hover:text-blue-400 transition-colors duration-300">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-blue-400 transition-colors duration-300">
                Community
              </Link>
            </li>
            <li>
              <Link to="/success-stories" className="hover:text-blue-400 transition-colors duration-300">
                Success Stories
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-blue-400 transition-colors duration-300">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media & Legal Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Connect</h3>
          <div className="flex space-x-4">
            <Link to="https://www.linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link to="https://www.instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link to="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-sky-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link to="https://www.youtube.com" aria-label="YouTube" className="text-gray-400 hover:text-red-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-6 w-6" />
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} EduHub. All rights reserved.
            </p>
            <div className="mt-2 flex space-x-4 text-xs text-gray-500">
              <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-gray-300 transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom Section - just a simple line to separate */}
      <div className="max-w-7xl mx-auto pt-8 text-center text-sm text-gray-500">
        <p>
          Designed and developed with passion for aspiring coders everywhere.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
