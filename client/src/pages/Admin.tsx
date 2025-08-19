import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Award,
  History,
  Loader,
  LayoutDashboard,
  Zap,
  BookOpenText,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// Dummy data for the users and quiz attempts
const DUMMY_USERS = [
  {
    id: "user_1",
    name: "Sujit Thakur",
    email: "sujit.thakur@example.com",
    lastActive: "2025-08-18",
    quizAttempts: [
      { id: "att_1", quizTitle: "React Fundamentals Quiz", score: 85, date: "2025-08-10" },
      { id: "att_2", quizTitle: "Advanced JavaScript Quiz", score: 92, date: "2025-08-15" },
      { id: "att_3", quizTitle: "React Fundamentals Quiz", score: 90, date: "2025-08-16" },
    ],
  },
  {
    id: "user_2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    lastActive: "2025-08-19",
    quizAttempts: [
      { id: "att_4", quizTitle: "CSS Layouts", score: 78, date: "2025-08-12" },
      { id: "att_5", quizTitle: "React Fundamentals Quiz", score: 95, date: "2025-08-19" },
    ],
  },
  {
    id: "user_3",
    name: "John Smith",
    email: "john.smith@example.com",
    lastActive: "2025-08-17",
    quizAttempts: [
      { id: "att_6", quizTitle: "Advanced JavaScript Quiz", score: 65, date: "2025-08-17" },
    ],
  },
];

// Dummy data for the quizzes
const DUMMY_QUIZZES = [
  {
    id: "quiz_1",
    title: "React Fundamentals",
    description: "A quiz to test your knowledge of React basics.",
    questions: [
      {
        questionText: "What is JSX?",
        options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS preprocessor", "A state management tool"],
        correctAnswerIndex: 1,
      },
      {
        questionText: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    id: "quiz_2",
    title: "Advanced JavaScript",
    description: "Test your skills with complex JS concepts.",
    questions: [
      {
        questionText: "What is a closure?",
        options: ["A type of loop", "A function that has access to its outer function scope", "A CSS property", "A new JS keyword"],
        correctAnswerIndex: 1,
      },
    ],
  },
];

// Main App component that contains the entire dashboard
export default function Admin() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);

  // Simulate a loading state for a smoother initial experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader size={48} className="text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  // Define the content to be displayed based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "quizzes":
        return <QuizzesAdminPanel />;
      case "analytics":
      default:
        return <UserAnalyticsPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Sidebar Navigation */}
      <motion.nav
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg"
      >
        <div className="flex items-center mb-12">
          <Zap size={32} className="text-indigo-400 mr-3" />
          <h1 className="text-2xl font-extrabold tracking-wide text-white">Quizzy</h1>
        </div>
        <ul className="space-y-4">
          <li>
            <motion.button
              onClick={() => setActiveTab("analytics")}
              whileHover={{ scale: 1.05 }}
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard size={20} className="mr-3" />
              User Analytics
            </motion.button>
          </li>
          <li>
            <motion.button
              onClick={() => setActiveTab("quizzes")}
              whileHover={{ scale: 1.05 }}
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "quizzes"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <BookOpenText size={20} className="mr-3" />
              Manage Quizzes
            </motion.button>
          </li>
        </ul>
      </motion.nav>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-grow p-8 overflow-auto"
      >
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

// User Analytics Panel Component
const UserAnalyticsPanel = () => {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [selectedUser, setSelectedUser] = useState(DUMMY_USERS[0]);

  return (
    <motion.div
      key="analytics-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-t-8 border-indigo-600">
        <h1 className="text-4xl font-extrabold text-white">User Analytics</h1>
        <p className="mt-2 text-gray-400">View detailed information about your users and their quiz performance.</p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* User List Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col"
        >
          <h2 className="text-2xl font-bold text-gray-200 mb-6">User List</h2>
          <div className="space-y-4 overflow-y-auto pr-2">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${selectedUser?.id === user.id ? 'bg-indigo-600 shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <div className="p-2 bg-gray-600 rounded-full mr-4">
                  <User size={20} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Detail View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col"
        >
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div
                key={selectedUser.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow space-y-8"
              >
                {/* User Profile Info */}
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-indigo-600 rounded-full mr-6">
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedUser.name}</h2>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Last Active: {selectedUser.lastActive}</p>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="grid md:grid-cols-2 gap-6 text-center">
                  <div className="bg-gray-700 p-6 rounded-xl shadow-inner">
                    <div className="flex justify-center mb-2">
                      <History size={32} className="text-blue-400" />
                    </div>
                    <p className="text-4xl font-bold text-gray-100">{selectedUser.quizAttempts.length}</p>
                    <p className="text-gray-400">Quiz Attempts</p>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-xl shadow-inner">
                    <div className="flex justify-center mb-2">
                      <Award size={32} className="text-yellow-400" />
                    </div>
                    <p className="text-4xl font-bold text-gray-100">
                      {selectedUser.quizAttempts.length > 0 ? (
                        (selectedUser.quizAttempts.reduce((sum, a) => sum + a.score, 0) / selectedUser.quizAttempts.length).toFixed(1)
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className="text-gray-400">Average Score</p>
                  </div>
                </div>

                {/* Detailed Attempts List */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-200 mb-4">Quiz Attempt History</h3>
                  <div className="bg-gray-700 rounded-xl overflow-hidden shadow-inner">
                    <div className="p-4 text-gray-400 grid grid-cols-3 font-semibold border-b border-gray-600">
                      <span>Quiz</span>
                      <span className="text-center">Score</span>
                      <span className="text-right">Date</span>
                    </div>
                    <div className="divide-y divide-gray-600 max-h-80 overflow-y-auto">
                      {selectedUser.quizAttempts.sort((a, b) => new Date(b.date) - new Date(a.date)).map((attempt) => (
                        <div key={attempt.id} className="p-4 grid grid-cols-3 items-center">
                          <span className="font-medium text-gray-200">{attempt.quizTitle}</span>
                          <span className="text-center font-bold text-indigo-400">{attempt.score}%</span>
                          <span className="text-right text-sm text-gray-500">{attempt.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <h2 className="text-3xl font-semibold text-gray-300 mb-4">Select a User to View Their Analytics</h2>
                <p className="text-gray-500 max-w-md">Click on a user from the list on the left to see their detailed quiz history.</p>
                <User size={50} className="text-gray-700 mt-6 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Quizzes Admin Panel Component
const QuizzesAdminPanel = () => {
  const [quizzes, setQuizzes] = useState(DUMMY_QUIZZES);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");

  const handleSaveQuiz = () => {
    // This function will eventually save to Firestore
    console.log("Saving quiz...", { newQuizTitle, newQuizDescription, questions: currentQuiz?.questions });
    if (currentQuiz && currentQuiz.id) {
        setQuizzes(quizzes.map(q => q.id === currentQuiz.id ? { ...currentQuiz, title: newQuizTitle, description: newQuizDescription } : q));
    } else {
        const newQuiz = {
            id: `quiz_${quizzes.length + 1}`,
            title: newQuizTitle,
            description: newQuizDescription,
            questions: currentQuiz?.questions || [],
        };
        setQuizzes([...quizzes, newQuiz]);
    }
    setCurrentQuiz(null);
    setNewQuizTitle("");
    setNewQuizDescription("");
  };

  const handleDeleteQuiz = (quizId) => {
    // This will eventually delete from Firestore
    console.log("Deleting quiz with ID:", quizId);
    setQuizzes(quizzes.filter(q => q.id !== quizId));
    setCurrentQuiz(null);
  };

  const handleAddQuestion = () => {
    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (question) => {
    const questions = currentQuiz ? [...currentQuiz.questions] : [];
    if (question.id !== undefined) {
      questions[question.id] = question;
    } else {
      questions.push(question);
    }
    setCurrentQuiz({ ...currentQuiz, questions });
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (index) => {
    const questions = currentQuiz ? [...currentQuiz.questions] : [];
    questions.splice(index, 1);
    setCurrentQuiz({ ...currentQuiz, questions });
  };

  // Question Modal Component
  const QuestionModal = ({ question, onSave, onClose }) => {
    const [qText, setQText] = useState(question.questionText || "");
    const [options, setOptions] = useState(question.options || ["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(question.correctAnswerIndex || 0);

    const handleOptionChange = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };

    const handleCorrectChange = (index) => {
      setCorrectIndex(index);
    };

    const isFormValid = qText.trim() !== "" && options.every(opt => opt.trim() !== "");

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              {question.id !== undefined ? "Edit Question" : "Add New Question"}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="question-text" className="block text-sm font-medium text-gray-400">Question Text</label>
              <input
                type="text"
                id="question-text"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Type your question here..."
                className="mt-1 block w-full rounded-md bg-gray-700 text-white border-transparent focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <p className="block text-sm font-medium text-gray-400">Options</p>
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctIndex === index}
                    onChange={() => handleCorrectChange(index)}
                    className="h-4 w-4 text-indigo-500 border-gray-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="ml-3 block w-full rounded-md bg-gray-700 text-white border-transparent focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => onSave({ ...question, questionText: qText, options: options, correctAnswerIndex: correctIndex })}
              disabled={!isFormValid}
              className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg disabled:bg-indigo-300 transition-all hover:bg-indigo-700"
            >
              Save Question
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      key="quizzes-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-t-8 border-indigo-600">
        <h1 className="text-4xl font-extrabold text-white">Manage Quizzes</h1>
        <p className="mt-2 text-gray-400">Create, edit, and delete quizzes and their questions.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quiz List Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-200">Your Quizzes</h2>
            <button
              onClick={() => {
                setCurrentQuiz({ title: "", description: "", questions: [] });
                setNewQuizTitle("");
                setNewQuizDescription("");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-colors"
              title="Create new quiz"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2">
            {quizzes.length === 0 ? (
              <p className="text-center text-gray-500">No quizzes created yet. Add one!</p>
            ) : (
              quizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    setCurrentQuiz(quiz);
                    setNewQuizTitle(quiz.title);
                    setNewQuizDescription(quiz.description);
                  }}
                >
                  <span className="font-medium text-gray-200 truncate">{quiz.title || "Untitled Quiz"}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuiz(quiz.id);
                      }}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Delete quiz"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quiz Editor Main Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col"
        >
          {!currentQuiz ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <h2 className="text-3xl font-semibold text-gray-300 mb-4">Select a Quiz to Edit or Create a New One</h2>
              <p className="text-gray-500 max-w-md">Use the button on the left to create a new quiz, or select an existing one from the list to start editing.</p>
              <RefreshCw size={50} className="text-gray-700 mt-6 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 flex-grow"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Quiz Title"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  className="w-full text-4xl font-bold text-white bg-transparent border-b-2 border-gray-700 pb-2 focus:outline-none focus:border-indigo-600"
                />
                <textarea
                  placeholder="Quiz Description"
                  value={newQuizDescription}
                  onChange={(e) => setNewQuizDescription(e.target.value)}
                  className="w-full text-gray-400 bg-transparent border-b-2 border-gray-700 pb-2 resize-none focus:outline-none focus:border-indigo-600"
                  rows="2"
                />
              </div>

              {/* Questions Section */}
              <div className="flex justify-between items-center mt-8">
                <h3 className="text-2xl font-bold text-gray-200">Questions</h3>
                <button
                  onClick={handleAddQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full shadow-md transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Add Question
                </button>
              </div>
              <div className="space-y-4">
                {currentQuiz.questions.length === 0 ? (
                  <p className="text-center text-gray-500 italic mt-4">This quiz has no questions yet.</p>
                ) : (
                  currentQuiz.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-700 rounded-lg p-5 border border-gray-600 transition-shadow hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-200 text-lg mr-4">{index + 1}. {q.questionText}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentQuestion({ ...q, id: index });
                              setIsQuestionModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            title="Edit question"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="text-red-400 hover:text-red-500 transition-colors"
                            title="Delete question"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className={`flex items-center ${optIndex === q.correctAnswerIndex ? 'text-green-400' : 'text-gray-400'}`}>
                            {optIndex === q.correctAnswerIndex && <CheckCircle size={16} className="mr-2" />}
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Save Button */}
              <motion.button
                onClick={handleSaveQuiz}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg flex justify-center items-center hover:bg-indigo-700 transition-colors"
              >
                <Save size={20} className="mr-2" /> Save Quiz
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isQuestionModalOpen && (
          <QuestionModal
            question={currentQuestion}
            onSave={handleSaveQuestion}
            onClose={() => setIsQuestionModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
