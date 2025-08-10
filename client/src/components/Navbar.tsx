import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from 'lucide-react';

/**
 * The Navbar component for the Quizzy application.
 * This version is permanently set to a light theme and has no toggle functionality.
 */
export default function Navbar() {
  // State to control the visibility of the mobile menu.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      // The Navbar now uses a fixed light background and text color.
      className="bg-white text-gray-700 shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand Name with Framer Motion */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="text-3xl font-extrabold text-indigo-600">
            Quizzy
          </Link>
        </motion.div>

        <div className="flex items-center space-x-6">
          {/* Desktop Navigation Links */}
          <motion.div
            className="hidden md:flex items-center space-x-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div variants={navItemVariants}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Home
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Create Quiz
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                My Quizzes
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Explore
              </NavLink>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button - The theme toggle has been removed */}
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-300 md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Framer Motion for animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg pb-4"
          >
            <div className="flex flex-col items-center space-y-4 pt-4">
              <NavLink
                to="/"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/create"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Create Quiz
              </NavLink>
              <NavLink
                to="/list"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                My Quizzes
              </NavLink>
              <NavLink
                to="/explore"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 transition-colors duration-200 pb-1"
                    : "hover:text-indigo-600 transition-colors duration-200"
                }
              >
                Explore
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
