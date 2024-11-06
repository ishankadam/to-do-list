import React, { createContext, useContext, useState } from "react";

const TodoContext = createContext();

export const useUser = () => {
  return useContext(TodoContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <TodoContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </TodoContext.Provider>
  );
};
