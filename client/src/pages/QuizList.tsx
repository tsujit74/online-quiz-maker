import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from 'lucide-react';
import { useApi } from "../api/api";
import { useError } from "../context/ErrorContext";

interface Quiz {
  _id: string;
  title: string;
  createdAt: string;
}

export default function QuizList() {
  const api = useApi();
  const { setErrors } = useError();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch quizzes from the API
  async function fetchQuizzes() {
    setErrors([]);
    try {
      const res = await api.get("/quizzes");
      setQuizzes(res.data.data || []);
    } catch (error) {
      // The global API interceptor handles errors, so we don't need to do anything here.
    } finally {
      setLoading(false);
    }
  }

  // Effect to load quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, [api, setErrors]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="p-8 mt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
          Available Quizzes
        </h2>

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
            {quizzes.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border border-dashed border-gray-300 dark:border-gray-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  No quizzes available yet. Be the first to create one!
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus size={20} /> Create a New Quiz
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz._id}
                      className="p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between items-center transition-colors duration-300"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)" }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-grow w-full text-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Created: {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-4 w-full justify-center mt-4">
                        <Link
                          to={`/take/${quiz._id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Take Quiz <ArrowRight size={20} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
