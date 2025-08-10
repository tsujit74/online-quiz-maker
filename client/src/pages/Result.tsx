
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Home } from "lucide-react";

interface QuestionResult {
  question: string;
  options: string[];
  correctIndex: number;
  yourAnswer: number | null;
}

interface ResultData {
  total: number;
  score: number;
  details: QuestionResult[];
}

export default function Result() {
  //const { id } = useParams();
  const location = useLocation();

  // Get the result data from the navigation state instead of fetching it
  const resultData = location.state as ResultData;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  if (!resultData) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-colors duration-300">
        <p className="text-xl text-red-500 font-bold mb-4">No result data found.</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The quiz results could not be loaded. Please ensure you have completed the quiz.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-md font-medium rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Home size={18} /> Go Home
        </Link>
      </div>
    );
  }

  const { total, score, details } = resultData;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(0) : "0";

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 my-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Score Summary */}
        <div className="lg:w-1/3">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 text-center sticky top-6 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-3">Quiz Results</h2>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3">
              You scored{" "}
              <span className="text-blue-600 dark:text-blue-400">{score}</span> out of{" "}
              <span className="text-gray-800 dark:text-white">{total}</span>
            </p>
            <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">{percentage}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-center mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <Home size={20} /> Go Home
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Detailed Feedback */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {details.map((q, i) => {
              const isCorrect = q.correctIndex === q.yourAnswer;
              return (
                <motion.div
                  key={i}
                  className={`p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/40 border border-green-300 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/40 border border-red-300 dark:border-red-800"
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle size={24} className="text-green-500 dark:text-green-400" />
                      ) : (
                        <XCircle size={24} className="text-red-500 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-md font-bold text-gray-800 dark:text-white mb-1">
                        {i + 1}. {q.question}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        Correct Answer:{" "}
                        <span className="text-green-600 dark:text-green-400">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Your Answer:{" "}
                        {q.yourAnswer !== null
                          ? q.options[q.yourAnswer]
                          : "Not answered"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
