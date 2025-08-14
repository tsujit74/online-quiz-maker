import { createContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id?: string;
  name: string;
  email: string;
  tests?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUserStr = localStorage.getItem("user");

      if (!storedToken || !storedUserStr) {
        // Nothing in storage — skip
        return;
      }

      const parsedUser: User = JSON.parse(storedUserStr);

      if (parsedUser?.name && parsedUser?.email) {
        setUser(parsedUser);
        setToken(storedToken);
      } else {
        console.warn("User data incomplete in localStorage. Clearing...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.warn("Invalid user data in localStorage. Clearing...", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    if (!newUser?.name || !newUser?.email) {
      console.error("Attempted to log in with incomplete user data", newUser);
      return;
    }
    setToken(newToken);
    setUser(newUser);

    // Store safely
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
