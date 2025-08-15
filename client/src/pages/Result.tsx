// src/pages/Result.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  LayoutDashboard,
  Trophy,
} from "lucide-react";
import { useApi } from "../api/api";

interface QuestionResult {
  question: string;
  options: string[];
  correctIndex: number;
  yourAnswer: number | null;
}

interface ResultData {
  title: string;
  total: number;
  score: number;
  details: QuestionResult[];
}

export default function Result() {
  const { id } = useParams(); // quiz ID
  const location = useLocation();
  const navigate = useNavigate();
  const api = useApi();

  const [resultData, setResultData] = useState<ResultData | null>(
    location.state as ResultData | null
  );
  const [loading, setLoading] = useState(!resultData);
  const [error, setError] = useState<string | null>(null);

  // State for the custom modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDevToolsModal, setIsDevToolsModal] = useState(false);

  // Fetch result if location.state is missing
  useEffect(() => {
    if (resultData || !id) return;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/quizzes/${id}/result`);
        if (!res.data.success)
          throw new Error(res.data.message || "Failed to load result");

        const data = res.data.data;
        setResultData(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, resultData, api]);

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable dev tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.metaKey && e.altKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Detect dev tools
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        setModalMessage("Developer tools detected! Closing...");
        setIsDevToolsModal(true);
        setShowModal(true);
        clearInterval(interval);
      }
    };
    const interval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [navigate]);

  const handleRetakeQuiz = () => {
    if (id) {
      navigate(`/take/${id}`);
    } else {
      setModalMessage("Quiz ID not found. Cannot retake quiz.");
      setIsDevToolsModal(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isDevToolsModal) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <span className="loader border-indigo-600 border-4 border-t-transparent rounded-full w-12 h-12 animate-spin"></span>
      </div>
    );
  }

  if (!resultData || error) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4 bg-white rounded-2xl shadow-xl transition-colors duration-300">
        <p className="text-xl text-red-500 font-bold mb-4">
          {error || "No result data found."}
        </p>
        <p className="text-gray-600 mb-6">
          The quiz results could not be loaded.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-md font-medium rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <Home size={18} /> Go Home
          </Link>
          {id && (
            <button
              onClick={handleRetakeQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-md font-medium rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw size={18} /> Retake Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  const { title, total, score, details } = resultData;
  console.log("Title", title, " ", total, " ", score, "all result");
  const percentage = total > 0 ? ((score / total) * 100).toFixed(0) : "0";
  const passed = total > 0 && score >= total / 2;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto p-4 my-4 font-sans"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2
          className="text-2xl sm:text-4xl font-extrabold mb-8 
             text-gray-800 dark:text-white leading-snug"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <span className="text-indigo-600 dark:text-indigo-400">
            Subject:&nbsp;
          </span>
          {title || "Untitled Quiz"}
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Score Summary */}
          <div className="lg:w-1/3">
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 mb-6 text-center sticky top-6 transition-colors duration-300 border border-gray-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                {passed ? (
                  <Trophy size={48} className="text-yellow-500" />
                ) : (
                  <XCircle size={48} className="text-red-500" />
                )}
                <h2
                  className={`text-4xl font-extrabold ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passed ? "Passed!" : "Failed"}
                </h2>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
                Quiz Results
              </h2>
              <p className="text-xl font-bold text-gray-600 mb-3">
                You scored <span className="text-blue-600">{score}</span> out of{" "}
                <span className="text-gray-800">{total}</span>
              </p>
              <p className="text-5xl font-extrabold text-blue-600 mb-4">
                {percentage}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Home size={20} /> Go Home
                </Link>
                {id && (
                  <button
                    onClick={handleRetakeQuiz}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <RotateCcw size={20} /> Retake Quiz
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Detailed Feedback */}
          <div className="lg:w-2/3">
            <div className="space-y-4">
              {details && details.length > 0 ? (
                details.map((q, i) => {
                  const isCorrect = q.correctIndex === q.yourAnswer;
                  return (
                    <motion.div
                      key={i}
                      className={`p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
                        isCorrect
                          ? "bg-green-50 border border-green-300"
                          : "bg-red-50 border border-red-300"
                      }`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle size={24} className="text-green-500" />
                          ) : (
                            <XCircle size={24} className="text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-md font-bold text-gray-800 mb-1">
                            {i + 1}. {q.question}
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            Correct Answer:{" "}
                            <span className="text-green-600">
                              {q.options[q.correctIndex]}
                            </span>
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isCorrect ? "text-green-600" : "text-red-600"
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
                })
              ) : (
                <p className="text-gray-500">No feedback available.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Modal for alerts */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center"
              initial={{ y: -50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alert</h3>
              <p className="text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                {isDevToolsModal ? "Go to Home" : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
