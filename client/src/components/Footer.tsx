import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    // The footer now uses a dark background with a gradient top border to match the hero section.
    <footer className="bg-gray-30 text-black-900 pt-12 pb-8 mt-20 border-t-4 border-transparent bg-clip-padding" style={{ borderImage: "linear-gradient(to right, #6366f1, #9333ea) 1", borderImageSlice: 1 }}>
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div>
            <h4 className="text-3xl font-extrabold mb-2 text-indigo-700">Quizzy</h4>
            <p className="text-black-400 text-sm">Create, share, and conquer.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-black">Quick Links</h5>
            <ul className="space-y-2 text-black">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-indigo-400 transition-colors duration-200">Create a Quiz</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-indigo-400 transition-colors duration-200">Explore Quizzes</Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media Links */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-black">Connect with Us</h5>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://github.com/tsujit74/" target="blank" className="text-gray-400 hover:text-black transition-colors duration-200 transform hover:scale-110">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/sujit-thakur-463b45229/" target="blank" className="text-gray-400 hover:text-black transition-colors duration-200 transform hover:scale-110">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 transform hover:scale-110">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Quizzy. All rights reserved By Sujit.
          </p>
        </div>
      </div>
    </footer>
  );
}
