import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/api"; // with error handling
import { useError } from "../context/ErrorContext";

// Main AuthPage component with a professional white theme and loading spinner
export default function AuthPage() {
  // State to toggle between login and sign up forms
  const [isLogin, setIsLogin] = useState(true);
  // State for form data
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  // State to manage the loading state for the submit button
  const [loading, setLoading] = useState(false);

  // Hooks from the provided code
  const { errors } = useError();
  const api = useApi();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Basic form validation
  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) return false;
    if (!isLogin && !form.name.trim()) return false;
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, form);

      if (endpoint === "/auth/register") {
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      } else {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Auth error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with a light gray background
    <div className="min-h-screen flex items-center justify-center p-2 bg-gray-100 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-b border-gray-300 bg-transparent p-3 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b border-gray-300 bg-transparent p-3 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border-b border-gray-300 bg-transparent p-3 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              // Spinner animation for the button
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </motion.svg>
            ) : // Button text
            isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
