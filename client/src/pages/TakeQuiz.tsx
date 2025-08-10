import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../api/api"; // Correctly import the useApi hook
import { useError } from "../context/ErrorContext"; // Import useError to manage local errors if any
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Q = {
  _id?: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export default function TakeQuiz() {
  const { id } = useParams();
  const api = useApi(); // Use the custom hook to get the API instance
  const { setErrors } = useError(); // Use the global error context

  const [quiz, setQuiz] = useState<{ title: string; questions: Q[] } | null>(
    null
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setErrors([]);
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data.data || null);
      } catch (err) {
        // The global API interceptor handles all errors.
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, api, setErrors]); // Added dependencies to the useEffect hook

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">Loading quiz...</span>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl transition-colors duration-300">
        <p className="text-2xl text-red-500 font-bold mb-6">Quiz not found or no questions available.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    );
  }

  function chooseOption(idx: number) {
    const copy = [...answers];
    copy[index] = idx;
    setAnswers(copy);
  }

  function next() {
    // Check if an answer has been selected for the current question
    if (answers[index] === undefined) {
      setErrors(["Please select an option before moving on."]);
      return;
    }

    if (quiz && index < quiz.questions.length - 1) {
      setErrors([]); // Clear errors when moving to the next question
      setIndex((i) => i + 1);
    } else {
      // Submit the quiz to the backend
      api.post(`/quizzes/${id}/submit`, { answers }).then((res) => {
        // Now, we navigate to the result page, passing the returned data via state
        navigate(`/result/${id}`, { state: res.data.data });
      }).catch(err => {
        setErrors([err]);
      });
    }
  }

  const q = quiz.questions[index];

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{quiz.title}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question {index + 1} of {quiz.questions.length}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {q.question}
        </p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => chooseOption(i)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                answers[index] === i
                  ? "bg-blue-600 text-white shadow-md border-2 border-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              }`}
              variants={optionVariants}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <motion.button
            onClick={next}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {index < quiz.questions.length - 1 ? "Next" : "Submit"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
