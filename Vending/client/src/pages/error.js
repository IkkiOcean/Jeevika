// src/pages/ErrorPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  AlertTriangle, 
  Wifi, 
  Server, 
  Clock, 
  Search, 
  Lock,
  Home as HomeIcon,
  RotateCcw
} from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [errorType, setErrorType] = useState('connection');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const type = sessionStorage.getItem('errorType') || 'connection';
    setErrorType(type);
  }, []);

  // Theme styles matching Home.jsx
  const theme = {
    bg: isDark 
      ? "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)"
      : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)",
    cardBg: isDark
      ? "rgba(255, 255, 255, 0.08)"
      : "#ffffff",
    textPrimary: isDark ? "#ffffff" : "#1f2937",
    textSecondary: isDark ? "#a5f3fc" : "#3b82f6",
    border: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(59, 130, 246, 0.2)"
  };

  const errorDetails = {
    connection: {
      title: '🔌 Drug Dispenser Not Connected',
      message: 'Unable to connect to the device. Please check the connection and try again.',
      icon: Wifi,
      color: isDark 
        ? { bg: "rgba(236, 72, 153, 0.25)", border: "rgba(236, 72, 153, 0.4)", text: "#f9a8d4" }
        : { bg: "rgba(236, 72, 153, 0.2)", border: "#f9a8d4", text: "#db2777" },
    },
    server: {
      title: '⚠️ Backend Server Error',
      message: 'The backend server is not responding. Please try again later.',
      icon: Server,
      color: isDark 
        ? { bg: "rgba(239, 68, 68, 0.25)", border: "rgba(239, 68, 68, 0.4)", text: "#fca5a5" }
        : { bg: "rgba(239, 68, 68, 0.2)", border: "#fca5a5", text: "#dc2626" },
    },
    timeout: {
      title: '⏱️ Request Timeout',
      message: 'The device is not responding in time. Please try again.',
      icon: Clock,
      color: isDark 
        ? { bg: "rgba(249, 115, 22, 0.25)", border: "rgba(249, 115, 22, 0.4)", text: "#fdba74" }
        : { bg: "rgba(249, 115, 22, 0.2)", border: "#fdba74", text: "#ea580c" },
    },
    'not-found': {
      title: '🔍 Resource Not Found',
      message: 'The requested resource was not found.',
      icon: Search,
      color: isDark 
        ? { bg: "rgba(168, 85, 247, 0.25)", border: "rgba(168, 85, 247, 0.4)", text: "#e9d5ff" }
        : { bg: "rgba(168, 85, 247, 0.2)", border: "#e9d5ff", text: "#7c3aed" },
    },
    unauthorized: {
      title: '🔐 Unauthorized Access',
      message: 'You do not have permission to access this resource.',
      icon: Lock,
      color: isDark 
        ? { bg: "rgba(59, 130, 246, 0.25)", border: "rgba(59, 130, 246, 0.4)", text: "#bfdbfe" }
        : { bg: "rgba(59, 130, 246, 0.2)", border: "#bfdbfe", text: "#1d4ed8" },
    },
  };

  const details = errorDetails[errorType] || errorDetails.connection;
  const IconComponent = details.icon;

  const handleRetry = () => {
    sessionStorage.removeItem('connectionError');
    sessionStorage.removeItem('errorMessage');
    sessionStorage.removeItem('errorType');
    navigate(-1);
  };

  const handleReset = () => {
    sessionStorage.removeItem('connectionError');
    sessionStorage.removeItem('errorMessage');
    sessionStorage.removeItem('errorType');
    navigate('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      className="w-full h-screen flex flex-col justify-center items-center overflow-hidden"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      )}

      {/* Error Card */}
      <div 
        className="w-full max-w-md mx-4 p-8 md:p-10 rounded-2xl relative z-10"
        style={{
          background: theme.cardBg,
          backdropFilter: isDark ? "blur(20px)" : "none",
          border: `2px solid ${details.color.border}`,
          boxShadow: isDark 
            ? `0 4px 30px ${details.color.bg}` 
            : "0 4px 20px rgba(0, 0, 0, 0.08)"
        }}
      >
        {/* Icon Container */}
        <div 
          className="flex justify-center mb-6"
        >
          <div 
            className="p-4 rounded-2xl"
            style={{
              background: details.color.bg,
              border: `2px solid ${details.color.border}`,
              backdropFilter: isDark ? "blur(10px)" : "none",
            }}
          >
            <IconComponent 
              size={48}
              strokeWidth={2.5}
              style={{ color: details.color.text }}
            />
          </div>
        </div>

        {/* Error Title */}
        <h1 
          className="text-2xl md:text-3xl font-bold text-center mb-3"
          style={{ color: theme.textPrimary }}
        >
          {details.title}
        </h1>

        {/* Error Message */}
        <p 
          className="text-base md:text-lg text-center mb-8"
          style={{ color: theme.textSecondary }}
        >
          {details.message}
        </p>

        {/* Button Container */}
        <div className="flex flex-col gap-4">
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="font-bold text-base md:text-lg p-4 rounded-xl transition-all duration-200 active:scale-98 hover:scale-105 touch-manipulation flex items-center justify-center gap-3"
            style={isDark ? {
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(59, 130, 246, 0.4)",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.25)",
              color: "#bfdbfe"
            } : {
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "2px solid #93c5fd",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2)",
              color: "#1d4ed8"
            }}
          >
            <RotateCcw size={20} strokeWidth={2.5} />
            Retry
          </button>

          {/* Home Button */}
          <button
            onClick={handleReset}
            className="font-bold text-base md:text-lg p-4 rounded-xl transition-all duration-200 active:scale-98 hover:scale-105 touch-manipulation flex items-center justify-center gap-3"
            style={isDark ? {
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.25) 100%)",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(6, 182, 212, 0.4)",
              boxShadow: "0 4px 20px rgba(6, 182, 212, 0.25)",
              color: "#67e8f9"
            } : {
              background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
              border: "2px solid #7dd3fc",
              boxShadow: "0 4px 20px rgba(6, 182, 212, 0.2)",
              color: "#0891b2"
            }}
          >
            <HomeIcon size={20} strokeWidth={2.5} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
