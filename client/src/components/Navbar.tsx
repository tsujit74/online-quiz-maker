// Navbar.tsx
import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Mail, Info } from 'lucide-react';
import { AuthContext } from "../context/authContext";
import type { Variants } from 'framer-motion';
import { useSuccess } from "../context/SuccessContext";

// An array of navigation links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Create Quiz", path: "/create" },
  { name: "My Quizzes", path: "/list" },
  { name: "Explore", path: "/explore" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user and logout function from the AuthContext
  const { user, logout } = useContext(AuthContext);
  const {addMessage} = useSuccess();

  // Function to toggle the mobile menu and close the modal if it's open
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isModalOpen) setIsModalOpen(false);
  };

  // Function to toggle the user modal and close the menu if it's open
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  // Function to handle logout and close the modal
  const handleLogout = () => {
    logout();
    addMessage("Logout Sucessfully");
    setIsModalOpen(false);
  };
  
  // Function to handle the dashboard link click
  const handleDashboardClick = () => {
    setIsModalOpen(false); // Close the modal when the user navigates
  };

  // Dynamically apply classes for active links
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition-colors duration-200"
      : "hover:text-indigo-600 transition-colors duration-200";

  // Framer Motion variants for the mobile menu
  const mobileMenuVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Framer Motion variants for the user modal
  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.5 } },
  };

  return (
    <nav className="bg-white text-gray-700 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand Name */}
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
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClasses}>
                {link.name}
              </NavLink>
            ))}
          </motion.div>

          {/* User Avatar and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.button
                onClick={toggleModal}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:ring-2 ring-indigo-500 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="User profile"
              >
                {/* Assuming `user` is an object with a `name` property */}
                {user && user.name.charAt(0).toUpperCase()}
              </motion.button>
            ) : (
              <NavLink
                to="/auth"
                className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </NavLink>
            )}

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

      {/* Mobile Menu */}
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
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={toggleMobileMenu}
                  className={linkClasses}
                >
                  {link.name}
                </NavLink>
              ))}
              {user?.name ? (
                <button
                  onClick={() => { toggleModal(); toggleMobileMenu(); }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-1/2"
                >
                  {user.name}
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={toggleMobileMenu}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-1/2 text-center"
                >
                  Login
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {isModalOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={toggleModal}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants as Variants}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Info size={24} className="text-indigo-600" />
                  User Profile
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-800 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <User size={24} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    {/* Assuming `user` is an object with a `name` property */}
                    <p className="font-semibold text-gray-800">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <Mail size={24} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {/* Assuming `user` is an object with an `email` property */}
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/dashboard"
                      onClick={handleDashboardClick}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={20} />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
