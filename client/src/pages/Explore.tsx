import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, History, Computer, Sparkles, Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// Mock data for the quizzes to be displayed on the page.
// In a real application, this data would be fetched from a server.
const mockQuizzes = [
  {
    id: 1,
    title: "World History Trivia",
    description: "Test your knowledge of key historical events and figures from around the globe.",
    category: "History",
    icon: <History size={24} className="text-white" />,
    color: "bg-purple-500"
  },
  {
    id: 2,
    title: "Science Superlatives",
    description: "Explore fascinating facts and concepts across physics, biology, and chemistry.",
    category: "Science",
    icon: <FlaskConical size={24} className="text-white" />,
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Computer Science Basics",
    description: "A beginner-friendly quiz on fundamental programming and computer science topics.",
    category: "Technology",
    icon: <Computer size={24} className="text-white" />,
    color: "bg-green-500"
  },
  {
    id: 4,
    title: "Literature Legends",
    description: "From Shakespeare to modern authors, how well do you know classic books and their stories?",
    category: "Literature",
    icon: <BookOpen size={24} className="text-white" />,
    color: "bg-red-500"
  },
  {
    id: 5,
    title: "General Knowledge",
    description: "A wide-ranging quiz to test your general knowledge on various topics.",
    category: "Misc",
    icon: <Sparkles size={24} className="text-white" />,
    color: "bg-yellow-500"
  },
];

const Explore = () => {
  // State to hold the search query. This is for demonstration purposes.
  const [searchQuery, setSearchQuery] = useState('');

  // Variants for card animation
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Header Section */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2"
          >
            Explore Quizzes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover and play a variety of quizzes on different topics. Challenge yourself and learn something new!
          </motion.p>
        </div>

        {/* Search Bar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 w-full max-w-md mx-auto"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none shadow-sm"
            />
          </div>
        </motion.div>

        {/* Quiz Cards Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {mockQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              variants={cardVariants}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-all border-l-4"
              style={{ borderLeftColor: quiz.color.split('-')[0] + "-400" }} // Dynamic border color
            >
              {/* Card Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-full ${quiz.color}`}>
                  {quiz.icon}
                </div>
                <span className="text-sm font-semibold text-gray-500">{quiz.category}</span>
              </div>
              
              {/* Card Body */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm">{quiz.description}</p>
              </div>

              {/* Card Footer */}
              <div className="mt-4">
                <button className="flex items-center space-x-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  <span>Start Quiz</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
