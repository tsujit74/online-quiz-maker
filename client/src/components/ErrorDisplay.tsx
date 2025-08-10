import { motion, AnimatePresence } from "framer-motion";
import { useError } from "../context/ErrorContext";

const ErrorDisplay = () => {
  const { errors, clearErrors } = useError();

  if (errors.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="fixed top-4 right-4 z-50 p-4 w-80 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg shadow-lg py-8"
      >
        <button
          onClick={clearErrors}
          className="absolute top-2 right-2 text-red-600 dark:text-red-200 hover:text-red-800"
        >
          &times;
        </button>
        <ul className="list-disc list-inside text-red-700 dark:text-red-200 text-sm">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;
