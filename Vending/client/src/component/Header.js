// Component/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './../context/ThemeContext';
import { ArrowLeft, Pill, Moon, Sun } from 'lucide-react';

const Header = ({ showBackButton = false, backTo = '/' }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div 
      className="w-full py-4 px-4 md:px-6 relative z-20 border-b flex-shrink-0"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(15, 32, 39, 0.95) 0%, rgba(32, 58, 67, 0.95) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 100%)",
        backdropFilter: "blur(30px)",
        boxShadow: isDark 
          ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
          : "0 4px 20px rgba(59, 130, 246, 0.1)",
        borderBottom: isDark 
          ? "2px solid rgba(6, 182, 212, 0.3)"
          : "2px solid rgba(59, 130, 246, 0.1)"
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Back Button or Spacer */}
          {showBackButton ? (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={isDark ? {
                background: "rgba(6, 182, 212, 0.15)",
                border: "1px solid rgba(6, 182, 212, 0.3)"
              } : {
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                border: "2px solid #93c5fd"
              }}
            >
              <ArrowLeft 
                size={20} 
                style={{ color: isDark ? "#06b6d4" : "#1e40af" }} 
              />
              <span 
                className="text-base font-medium hidden sm:inline"
                style={{ color: isDark ? "#06b6d4" : "#1e40af" }}
              >
                Back
              </span>
            </button>
          ) : (
            <div className="w-20" />
          )}
          
          {/* Center: Branding */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                border: isDark ? "2px solid rgba(6, 182, 212, 0.5)" : "none",
                boxShadow: isDark
                  ? "0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2)"
                  : "0 4px 20px rgba(59, 130, 246, 0.4)",
              }}
            >
              <Pill className="text-white" size={24} strokeWidth={2.5} />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                style={{
                  background: "#22d3ee",
                  boxShadow: "0 0 10px #22d3ee",
                }}
              />
            </div>

            <div>
              <h1
                className="text-2xl md:text-3xl font-black tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: isDark 
                    ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))"
                    : "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
                }}
              >
                JEEVIKA
              </h1>
              <p
                className="text-xs font-medium tracking-wide hidden sm:block"
                style={{ 
                  color: isDark ? "#a5f3fc" : "#0ea5e9",
                  textShadow: isDark 
                    ? "0 0 8px rgba(6, 182, 212, 0.5)" 
                    : "0 1px 2px rgba(59, 130, 246, 0.2)"
                }}
              >
                Smart Medical Solutions
              </p>
            </div>
          </div>
          
          {/* Right: Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            style={isDark ? {
              background: "rgba(251, 191, 36, 0.15)",
              border: "2px solid rgba(251, 191, 36, 0.3)"
            } : {
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              border: "2px solid #475569"
            }}
          >
            {isDark ? (
              <Sun className="text-yellow-300" size={20} />
            ) : (
              <Moon className="text-white" size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
