import React, { createContext, useContext, useEffect, useState } from 'react';

const UserHistoryContext = createContext();

export const UserHistoryProvider = ({ children }) => {
  const [userHistory, setUserHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem('userHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('userHistory', JSON.stringify(userHistory));
  }, [userHistory]);

  const addToHistory = (action) => {
    setUserHistory((prevHistory) => [...prevHistory, action]);
  };

  return (
    <UserHistoryContext.Provider value={{ userHistory, addToHistory }}>
      {children}
    </UserHistoryContext.Provider>
  );
};

export const useUserHistory = () => useContext(UserHistoryContext);
