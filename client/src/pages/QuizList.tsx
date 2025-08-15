import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Clock, ListOrdered, Search } from 'lucide-react';
import { useApi } from "../api/api";
import { useError } from "../context/ErrorContext";

// Updated interface to include time and question count
interface Quiz {
  _id: string;
  title: string;
  createdAt: string;
  timeLimit: number; // Time limit in minutes
  questionCount: number; // Total number of questions
}

export default function QuizList() {
  const api = useApi();
  const { setErrors } = useError();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch quizzes from the API
  async function fetchQuizzes() {
    setErrors([]);
    try {
      const res = await api.get("/quizzes");
      const quizzesWithDetails = (res.data.data || []).map((quiz: any) => ({
        ...quiz,
        timeLimit: quiz.timeLimit || 10,
        questionCount: quiz.questionCount || 10,
      }));
      setQuizzes(quizzesWithDetails);
    } catch (error) {
      // The global API interceptor handles errors
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [api, setErrors]);

  // Filter quizzes based on search input (title or date)
  const filteredQuizzes = quizzes.filter((quiz) => {
    const titleMatch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = new Date(quiz.createdAt)
      .toLocaleDateString()
      .includes(searchTerm);
    return titleMatch || dateMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, when: "beforeChildren", duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div className="p-8 mt-5 min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="max-w-screen-xl mx-auto">
        

        {/* Header + Search Bar */}
<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full max-w-4xl mx-auto">
  {/* Title */}
  <h2 className="text-xl sm:text-3xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
  Available Quizzes
</h2>


  {/* Search Bar */}
  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 shadow-sm flex-1 sm:max-w-xs">
    <Search size={18} className="text-gray-400 dark:text-gray-300" />
    <input
      type="text"
      placeholder="Search by title or date..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-transparent outline-none w-full text-sm text-gray-700 dark:text-gray-200"
    />
  </div>
</div>


        {loading ? (
          <div className="flex justify-center items-center h-40 text-indigo-600">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-4 text-xl">Loading quizzes...</span>
          </div>
        ) : (
          <>
            {filteredQuizzes.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-lg border border-dashed border-gray-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-xl text-gray-600 mb-6">No quizzes found.</p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus size={20} /> Create a New Quiz
                </Link>
              </motion.div>
            ) : (
              <motion.div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {filteredQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz._id}
                      className="p-6 border border-gray-200 rounded-xl bg-white shadow-md flex flex-col justify-between transition-all duration-300 transform"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex-grow w-full text-left">
                        <h3 className="text-2xl font-bold text-gray-800">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>

                        <div className="mt-4 flex items-center justify-start gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={16} className="text-indigo-500" /> {quiz.timeLimit} min
                          </span>
                          <span className="flex items-center gap-1">
                            <ListOrdered size={16} className="text-indigo-500" /> {quiz.questionCount} Questions
                          </span>
                        </div>
                      </div>

                      <div className="w-full mt-6">
                        <Link
                          to={`/take/${quiz._id}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Take Quiz <ArrowRight size={20} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
