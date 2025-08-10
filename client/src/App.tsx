import React, { type JSX } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import Result from "./pages/Result";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ErrorProvider } from "./context/ErrorContext";
import ErrorDisplay from "./components/ErrorDisplay";
import Explore from "./pages/Explore";
import AuthPage from "./pages/AuthPage";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Get the navigate function

  // Use a useEffect hook to handle the redirection
  React.useEffect(() => {
    if (!token) {
      // Redirect using useNavigate, which prevents a full page reload
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]); // Rerun the effect if token or navigate changes

  // Only render the children if the token exists
  return token ? children : null;
};

export default function App() {
  return (
    <ErrorProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />

        <main className="container mx-auto px-4 flex-1">
          <ErrorDisplay />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route path="/list" element={<QuizList />} />
            <Route
              path="/take/:id"
              element={
                <ProtectedRoute>
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route path="/result/:id" element={<Result />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ErrorProvider>
  );
}
