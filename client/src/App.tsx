import { type JSX, useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import Result from "./pages/Result";
import Explore from "./pages/Explore";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorDisplay from "./components/ErrorDisplay";
import { ErrorProvider } from "./context/ErrorContext";
import { AuthProvider, AuthContext } from "./context/authContext";
import UserDashboard from "./pages/UserDashboard";
import { SuccessProvider } from "./context/SuccessContext";
import SuccessDisplay from "./components/SucessDisplay";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until token is loaded from localStorage
    setLoading(false);
  }, [token]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <SuccessProvider>
        <ErrorProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <Navbar />

            <main className="container mx-auto px-1 flex-1">
              <ErrorDisplay />
              <SuccessDisplay />
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
                <Route
                  path="/take/:id"
                  element={
                    <ProtectedRoute>
                      <TakeQuiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/list" element={<QuizList />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </ErrorProvider>
      </SuccessProvider>
    </AuthProvider>
  );
}
