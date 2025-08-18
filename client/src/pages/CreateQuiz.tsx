import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Share2, Copy } from "lucide-react";
import { useApi } from "../api/api";
import { useError } from "../context/ErrorContext";
import { useSuccess } from "../context/SuccessContext";

type Option = string;
type Q = { question: string; options: Option[]; correctIndex: number };

export default function CreateQuiz() {
  const api = useApi();
  const { setErrors } = useError();
  const { addMessage } = useSuccess();

  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Q[]>([
    { question: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [quizLink, setQuizLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyLink = () => {
    if (!quizLink) return;
    const fullLink = `${window.location.origin}${quizLink}`;
    navigator.clipboard.writeText(fullLink).then(() => setCopied(true));
  };

  const updateQuestion = (i: number, field: Partial<Q>) => {
    const copy = [...questions];
    copy[i] = { ...copy[i], ...field };
    setQuestions(copy);
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);

  const removeQuestion = (i: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!title.trim()) newErrors.push("Quiz title is required.");
    questions.forEach((q, i) => {
      if (!q.question.trim())
        newErrors.push(`Question ${i + 1} cannot be empty.`);
      q.options.forEach((opt, j) => {
        if (!opt.trim())
          newErrors.push(
            `Option ${j + 1} for Question ${i + 1} cannot be empty.`
          );
      });
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors([]);
    if (!validateForm()) return;
    try {
      const payload = { title, questions };
      const res = await api.post("/quizzes", payload);
      const quizId = res.data.data._id;
      addMessage("Quiz Created Successfully");
      setQuizLink(`/take/${quizId}`);
      setTitle("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
    } catch (err: any) {
      setErrors([
        err.response?.data?.message ||
          "Something went wrong while creating the quiz.",
      ]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const fullQuizLink = quizLink ? `${window.location.origin}${quizLink}` : "";
  const whatsappUrl = encodeURI(
    `https://api.whatsapp.com/send?text=Take this quiz: ${fullQuizLink}`
  );

  return (
    <motion.div
      className="max-w-3xl mx-auto p-4 md:p-10 my-8 bg-white rounded-3xl shadow-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence mode="wait">
        {quizLink ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center p-8 md:p-12 bg-green-100 dark:bg-green-900 rounded-2xl shadow-lg text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 dark:text-green-200 mb-4 animate-bounce">
              Quiz Created! 🎉
            </h2>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 break-words">
              Share this link with your friends:
            </p>
            <div className="flex items-center space-x-2 w-full max-w-lg p-3 bg-white dark:bg-gray-700 rounded-lg shadow-inner">
              <a
                href={quizLink}
                className="flex-grow text-indigo-600 dark:text-indigo-400 underline break-all"
              >
                {fullQuizLink}
              </a>
              <motion.button
                onClick={handleCopyLink}
                className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Copy size={20} />
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -40 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full shadow-lg"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow-md hover:bg-green-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} /> Share on WhatsApp
              </motion.a>
              <motion.button
                onClick={() => setQuizLink(null)}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Another Quiz
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center text-gray-800 dark:text-white">
              Create a New Quiz
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quiz Title */}
              <motion.input
                whileFocus={{ scale: 1.01 }}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (submitted) validateForm();
                }}
                placeholder="Enter Quiz Title"
                className={`w-full p-3 text-lg border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  submitted && !title.trim() ? "border-red-500" : ""
                }`}
              />
              {submitted && !title.trim() && (
                <p className="text-sm text-red-500 mt-1">
                  Quiz title is required.
                </p>
              )}

              {/* Questions */}
              <AnimatePresence>
                {questions.map((q, i) => (
                  <motion.div
                    key={i}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-md"
                    initial={{ opacity: 0, x: 100 }} // Starts off-screen to the right
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      },
                    }} // Slides in
                    exit={{ opacity: 0, x: -100 }} // Slides out to the left
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <input
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(i, { question: e.target.value })
                        }
                        placeholder={`Question ${i + 1}`}
                        className={`w-full text-lg font-semibold p-2 border-b-2 bg-transparent focus:outline-none focus:border-indigo-500 dark:text-white ${
                          submitted && !q.question.trim()
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(i)}
                          className="p-2 rounded-full text-gray-400 hover:text-red-500"
                          aria-label="Remove question"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                    {submitted && !q.question.trim() && (
                      <p className="text-sm text-red-500 mt-1">
                        Question {i + 1} cannot be empty.
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {q.options.map((opt, j) => (
                        <motion.div
                          key={j}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
                        >
                          <input
                            type="radio"
                            name={`correct-${i}`}
                            checked={q.correctIndex === j}
                            onChange={() =>
                              updateQuestion(i, { correctIndex: j })
                            }
                            className="form-radio h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600"
                          />
                          <input
                            value={opt}
                            onChange={(e) => {
                              const opts = [...q.options];
                              opts[j] = e.target.value;
                              updateQuestion(i, { options: opts });
                            }}
                            placeholder={`Option ${j + 1}`}
                            className={`flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 ${
                              submitted && !opt.trim() ? "border-red-500" : ""
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {submitted && q.options.some((opt) => !opt.trim()) && (
                      <p className="text-sm text-red-500 mt-1">
                        All options for Question {i + 1} must be filled.
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <motion.button
                  type="button"
                  onClick={addQuestion}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Add Question
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Quiz
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
