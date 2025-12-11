import React, { useEffect } from "react";
import Routes from "./Routes";
import ToastProvider from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initTheme } from "./utils/theme";
import CareerAdvisorWidget from "./components/ui/CareerAdvisorWidget";
import "./styles/scrollbar.css";

function App() {
  useEffect(() => {
    // Initialize theme on app load
    initTheme();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-[#0A0E27] transition-colors duration-300 pb-16 md:pb-0 overflow-x-hidden">
            <div className="pt-16">
              <Routes />
            </div>
            <CareerAdvisorWidget />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;