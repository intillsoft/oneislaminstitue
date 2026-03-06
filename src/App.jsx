import React, { useEffect } from "react";
import Routes from "./Routes";
import ToastProvider from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initTheme } from "./utils/theme";
import CareerAdvisorWidget from "./components/ui/CareerAdvisorWidget";
import { SidebarProvider } from "./contexts/SidebarContext";
import "./styles/scrollbar.css";

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen pb-16 md:pb-0 overflow-x-hidden relative">
              <div className="pt-0">
                <Routes />
              </div>
            </div>
          </AuthProvider>
        </ToastProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;