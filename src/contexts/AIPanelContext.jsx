import React, { createContext, useContext, useState, useCallback } from 'react';

const AIPanelContext = createContext();

export const AIPanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openPanel = useCallback((query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <AIPanelContext.Provider value={{ isOpen, openPanel, closePanel, togglePanel, initialQuery }}>
      {children}
    </AIPanelContext.Provider>
  );
};

export const useAIPanel = () => {
  const context = useContext(AIPanelContext);
  if (!context) {
    throw new Error('useAIPanel must be used within an AIPanelProvider');
  }
  return context;
};
