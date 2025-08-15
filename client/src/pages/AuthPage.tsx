import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useApi } from "../api/api";
import { Mail, Lock, User, RefreshCw } from 'lucide-react';
import { useSuccess } from "../context/SuccessContext";

interface FormState {
  name: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { login } = useContext(AuthContext);
  const api = useApi();
  const navigate = useNavigate();
  const { addMessage } = useSuccess();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Live validation
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: value && !emailRegex.test(value) ? 'Invalid email address' : null }));
    }
    if (name === 'password') {
      setErrors(prev => ({ ...prev, password: value && value.length < 6 ? 'Password must be at least 6 characters' : null }));
    }
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: !value && !isLogin ? 'Name is required' : null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email.trim() || !emailRegex.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password.trim() || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && !form.name.trim()) newErrors.name = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, form);

      if (isLogin) {
        const { token, user } = res.data;
        if (token && user) {
          login(token, user);
          addMessage("Login successful!");
          navigate("/");
        } else {
          setErrors({ email: "Login failed. Check your credentials." });
        }
      } else {
        addMessage("Account created successfully! Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
        setErrors({});
      }
    } catch (err: any) {
      setErrors({ email: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-1">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 10, stiffness: 100 }}
        className="bg-white-900 rounded-3xl p-10 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-xl placeholder-gray-500 border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-xl placeholder-gray-500 border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-xl placeholder-gray-500 border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? <RefreshCw size={24} className="animate-spin" /> : isLogin ? "Login" : "Create Account"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setForm({ name: "", email: "", password: "" }); setErrors({}); }}
            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
