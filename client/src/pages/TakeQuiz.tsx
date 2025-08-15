import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Clock } from "lucide-react";
import { useApi } from "../api/api";
import { useError } from "../context/ErrorContext";
import { AuthContext } from "../context/authContext";
import { useSuccess } from "../context/SuccessContext";

// Define the shape of a question
type Q = {
  _id?: string;
  question: string;
  options: string[];
  correctIndex: number;
};

// Define the shape of the quiz data
type QuizData = {
  title: string;
  questions: Q[];
};

// Helper function to format time from seconds to MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default function TakeQuiz() {
  const { id } = useParams();
  const api = useApi();
  const { setErrors } = useError();
  const { addMessage } = useSuccess();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // Per-question time left in seconds
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [, setIsDevToolsModal] = useState(false);

  // Custom Modal for Alerts
  const CustomModal = ({
    isOpen,
    onClose,
    message,
    showCloseButton = true,
  }: {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    showCloseButton?: boolean;
  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
          <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              OK
            </button>
          )}
        </div>
      </div>
    );
  };

  // Disclaimer modal on initial load
  useEffect(() => {
    if (!loading) {
      setModalMessage(
        "Important: This is a timed quiz. Switching tabs or leaving this page will result in the quiz ending and the page refreshing. Inspecting the page is also disabled."
      );
      setShowModal(true);
    }
  }, [loading]);

  // Disable right-click & inspect
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        setModalMessage("Inspecting is disabled!");
        setShowModal(true);
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // Tab-switching protection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setModalMessage(
          "Warning: You left the quiz. The page will now refresh."
        );
        setShowModal(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Give user 3 seconds to read the warning before refresh
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Load quiz
  // Load quiz
  const loadQuiz = async () => {
    setErrors([]);

    // DevTools check
    const isDevToolsOpen = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      return widthThreshold || heightThreshold;
    };

    if (isDevToolsOpen()) {
      setModalMessage(
        "Developer tools detected! Please close them to start the quiz."
      );
      setIsDevToolsModal(true);
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quizData: QuizData = res.data.data;
      setQuiz(quizData);
      setAnswers(Array(quizData.questions.length).fill(null));
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Failed to load quiz"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadQuiz();
  }, [id, api, setErrors, token]);

  // Timer logic for each question
  useEffect(() => {
    if (loading || !quiz || showModal) return;

    if (timeLeft <= 0) {
      if (index < quiz.questions.length - 1) {
        setIndex((i) => i + 1);
        setTimeLeft(30); // Reset timer for next question
      } else {
        submitQuiz(answers);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz, index, answers, showModal]);

  // Handle quiz submission
  const submitQuiz = async (finalAnswers: (number | null)[] = answers) => {
    try {
      const res = await api.post(
        `/quizzes/${id}/submit`,
        { answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/result/${id}`, {
        state: {
          score: res.data.score,
          title: res.data.title,
          total: res.data.total,
          answers: finalAnswers,
          quiz,
          details: res.data.details,
        },
      });
      addMessage("Quiz Submitted Sucessfully");
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Failed to submit quiz"]);
    }
  };

  // Move to the next question or submit
  const next = async () => {
    if (index < (quiz?.questions.length ?? 0) - 1) {
      setIndex((i) => i + 1);
      setTimeLeft(30); // Reset timer for next question
    } else {
      await submitQuiz();
    }
  };

  // Handle option selection
  const chooseOption = (idx: number) => {
    const copy = [...answers];
    copy[index] = idx;
    setAnswers(copy);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-700 h-12 w-12 border-t-red-600 animate-spin"></div>
        <p className="ml-4 text-xl text-gray-400">Loading quiz...</p>
      </div>
    );

  if (!quiz || quiz.questions.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 p-4">
        <div className="max-w-xl mx-auto text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          {/* Error Title */}
          <p className="text-2xl text-red-500 font-bold mb-6 flex items-center justify-center gap-2">
            <XCircle size={28} />
            Your developer tool detected
          </p>

          {/* Description */}
          <p className="text-gray-300 mb-8">
            Close the Developer tool to start the quiz. Please try
            again or go back to the homepage. Quiz Not Found or No Questions Available.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-md shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              Go Home
            </Link>
            <button
              onClick={loadQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-md shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );

  const q = quiz.questions[index];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6 md:p-8 font-mono text-gray-200">
      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        showCloseButton={!modalMessage.includes("Warning")}
      />
      <motion.div
        className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 md:p-8 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {quiz.title}
          </h2>
          <div className="flex items-center gap-2 text-red-500 font-semibold text-xl">
            <Clock size={24} />
            <p>{formatTime(timeLeft)}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">
            Question <span className="font-bold text-red-500">{index + 1}</span>{" "}
            of{" "}
            <span className="font-bold text-red-500">
              {quiz.questions.length}
            </span>
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-200">
            {q.question}
          </p>
        </div>

        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => chooseOption(i)}
              className={`w-full text-left p-4 transition-all duration-200 transform hover:bg-gray-700 border border-gray-700 ${
                answers[index] === i
                  ? "bg-red-600 text-white shadow-md border-red-700"
                  : "bg-gray-800 text-gray-200"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 flex items-center justify-center font-bold transition-colors duration-300 border-2 border-gray-600 ${
                    answers[index] === i
                      ? "bg-white text-red-600 border-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-base sm:text-lg">{opt}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <motion.button
            onClick={next}
            className={`px-8 py-3 text-lg font-bold rounded-md shadow-lg transition-all duration-300 transform ${
              answers[index] === null
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
            disabled={answers[index] === null}
          >
            {index < (quiz?.questions.length ?? 0) - 1
              ? "Next Question"
              : "Submit Quiz"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
