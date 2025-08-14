// SuccessContext.tsx
import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface SuccessContextType {
  messages: string[];
  addMessage: (msg: string) => void;
  clearMessages: () => void;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const SuccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (msg: string) => setMessages(prev => [...prev, msg]);
  const clearMessages = () => setMessages([]);

  return (
    <SuccessContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </SuccessContext.Provider>
  );
};

export const useSuccess = () => {
  const context = useContext(SuccessContext);
  if (!context) throw new Error('useSuccess must be used within SuccessProvider');
  return context;
};
