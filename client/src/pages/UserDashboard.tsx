import { useEffect, useState, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  XCircle,
  Calendar,
  Trophy,
  ListChecks,
  Percent,
  ArrowRight,
  Search,
} from "lucide-react";
import { AuthContext } from "../context/authContext";
import ResultChart from "../components/ResultChart";
import { useApi } from "../api/api";

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export default function UserDashboard() {

  const api = useApi();

  const { user, token } = useContext(AuthContext);

  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Totals (for "Overall" chart)
  const [totals, setTotals] = useState({ correct: 0, incorrect: 0 });

  // Chart toggle
  const [activeChart, setActiveChart] = useState<"overall" | "latest">("overall");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Result filter (All / Passed / Failed)
  const [resultFilter, setResultFilter] = useState<"all" | "passed" | "failed">("all");

  useEffect(() => {
    if (!token) return;


// Inside your component

const fetchResults = async () => {
  setLoading(true);
  setError(null);

  try {
    // Use useApi instance to make the request
    const res = await api.get("/auth/dashboard"); // automatically includes base URL & headers
    const data = res.data;

    const formattedResults: QuizResult[] = (data.tests || []).map((r: any) => ({
      quizId: r.quizId,
      quizTitle: r.quizTitle || `Quiz ${String(r.quizId || "").substring(0, 6)}`,
      score: typeof r.score === "number" ? r.score : 0,
      totalQuestions: typeof r.totalQuestions === "number" ? r.totalQuestions : 0,
      date: r.date || new Date().toISOString(),
    }));

    // Sort newest first
    formattedResults.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Overall totals
    const totalCorrect = formattedResults.reduce((sum, q) => sum + q.score, 0);
    const totalIncorrect = formattedResults.reduce(
      (sum, q) => sum + (q.totalQuestions - q.score),
      0
    );

    setResults(formattedResults);
    setTotals({ correct: totalCorrect, incorrect: totalIncorrect });
  } catch (err: any) {
    // The interceptor in useApi may already handle some errors
    setError(err.response?.data?.message || err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


    fetchResults();
  }, [token]);

  const totalQuizzes = results.length;
  const latestQuiz = results[0] || null;

  // Derived, memoized filtered list
  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      // Title filter
      const matchesTitle = res.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter - compare YYYY-MM-DD strings
      const isoDay = new Date(res.date).toISOString().slice(0, 10);
      const matchesDate = searchDate ? isoDay === searchDate : true;

      // Pass/Fail filter
      const isPassed = res.totalQuestions > 0 && res.score >= res.totalQuestions / 2;
      const matchesStatus =
        resultFilter === "all" ||
        (resultFilter === "passed" && isPassed) ||
        (resultFilter === "failed" && !isPassed);

      return matchesTitle && matchesDate && matchesStatus;
    });
  }, [results, searchTerm, searchDate, resultFilter]);

  return (
    <motion.div
      className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* <motion.h1
          className="text-4xl md:text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {user?.name || "Dashboard"}
        </motion.h1> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT PANEL */}
          <div className="md:col-span-1 flex flex-col gap-6">
            {/* User Info Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4 border-b border-gray-200 pb-4">
                <div className="p-3 bg-indigo-600 rounded-full text-white">
                  <User size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Welcome back,</p>
                  <p className="text-2xl font-bold">{user?.name || "Guest"}</p>
                  <p className="text-md text-gray-600">{user?.email || "No Email"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg text-gray-600">Quizzes Completed</p>
                <p className="text-5xl font-extrabold text-indigo-600">{totalQuizzes}</p>
              </div>
            </motion.div>

            {/* Chart Section with toggle */}
            {totalQuizzes > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                {/* Toggle */}
                <div className="flex justify-around mb-4 border-b border-gray-200">
                  <button
                    className={`flex-1 py-2 text-center text-md font-bold transition-colors duration-200 ${
                      activeChart === "overall"
                        ? "text-indigo-600 border-b-4 border-indigo-600"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveChart("overall")}
                  >
                    Overall
                  </button>
                  <button
                    className={`flex-1 py-2 text-center text-md font-bold transition-colors duration-200 ${
                      activeChart === "latest"
                        ? "text-indigo-600 border-b-4 border-indigo-600"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveChart("latest")}
                  >
                    Latest Quiz
                  </button>
                </div>

                {/* Active chart */}
                <AnimatePresence mode="wait">
                  {activeChart === "overall" && (
                    <motion.div
                      key="overall-chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-bold mb-4 text-indigo-700">Overall Performance</h3>
                      <ResultChart correct={totals.correct} incorrect={totals.incorrect} />
                    </motion.div>
                  )}

                  {activeChart === "latest" && latestQuiz && (
                    <motion.div
                      key="latest-chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-bold mb-4 text-indigo-700">Latest Quiz Performance</h3>
                      <ResultChart
                        correct={latestQuiz.score}
                        incorrect={Math.max(0, latestQuiz.totalQuestions - latestQuiz.score)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Take New Quiz Button */}
            <motion.a
              href="/list"
              className="group flex items-center justify-center gap-2 rounded-2xl py-4 text-center text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Take a New Quiz
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2">
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200 h-full">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
                <ListChecks size={24} /> Recent Results
              </h2>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setResultFilter("all")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    resultFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Results
                </button>
                <button
                  onClick={() => setResultFilter("passed")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    resultFilter === "passed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Passed
                </button>
                <button
                  onClick={() => setResultFilter("failed")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    resultFilter === "failed"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Failed
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 flex-1">
                  <Search size={18} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by quiz title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                  />
                </div>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-gray-50 text-sm"
                />
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    className="flex justify-center items-center h-48"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    className="flex items-center justify-center h-48 text-red-600 text-lg"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <XCircle className="mr-2" /> {error}
                  </motion.div>
                ) : filteredResults.length === 0 ? (
                  <motion.p
                    key="no-results"
                    className="text-gray-500 text-lg text-center h-48 flex items-center justify-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <XCircle size={20} className="mr-2" /> No matching results.
                  </motion.p>
                ) : (
                  <motion.div
                    key="results"
                    className="grid gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                  >
                    {filteredResults.map((res, index) => {
                      const isPassed =
                        res.totalQuestions > 0 && res.score >= res.totalQuestions / 2;
                      const percent =
                        res.totalQuestions > 0
                          ? Math.round((res.score / res.totalQuestions) * 100)
                          : 0;

                      return (
                        <motion.div
                          key={res.quizId + index}
                          className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center"
                          variants={itemVariants}
                          whileHover={cardHover}
                        >
                          <div className="flex-1 mb-2 md:mb-0">
                            <h3 className="text-lg font-bold text-indigo-700">
                              {res.quizTitle}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 text-gray-700 flex-wrap justify-end">
                            {/* Pass/Fail */}
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isPassed
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {isPassed ? "Passed" : "Failed"}
                            </div>

                            {/* Score */}
                            <div className="flex items-center gap-1">
                              <Trophy size={18} className="text-yellow-500" />
                              <span className="font-semibold">{res.score}</span> / {res.totalQuestions}
                            </div>

                            {/* Percentage */}
                            <div className="flex items-center gap-1 text-sm">
                              <Percent size={16} />
                              <span className="font-semibold">{percent}%</span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar size={16} />
                              {new Date(res.date).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
