import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {apiGet} from "../utils/api.js";
import { useTheme } from '../context/ThemeContext';
import { 
  Loader2, 
  Heart,
  Activity,
  Sparkles
} from "lucide-react";
import Header from "../components/mainHeader.js";

const Vital = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { isDark } = useTheme();
  let navigator = useNavigate();

  async function handleVitals() {
    setIsScanning(true);
    await apiGet(`/vitals`).then((res) => {

      navigator('/vital-report', {
        state: res.data
      });
    });
  }

  // Theme styles
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

  return (
    <div 
      className="w-full h-screen flex flex-col"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only in dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Header - Fixed */}
      <Header showBackButton={true} backTo="/" />

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="flex flex-col items-center justify-start min-h-full px-4 py-6">
          
          {/* Instruction Panel */}
          <div 
            className="mb-6 p-4 md:p-5 rounded-2xl text-center max-w-2xl w-full"
            style={{
              background: theme.cardBg,
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart 
                className={isDark ? "text-pink-300" : "text-pink-500"} 
                size={28} 
              />
              <h2 
                className="text-xl md:text-2xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                Health Vitals Check
              </h2>
            </div>
            <p 
              className="text-sm md:text-base"
              style={{ color: theme.textSecondary }}
            >
              Place your finger on the sensor to begin scanning
            </p>
          </div>

          {/* Scanning Animation Area */}
          <div 
            className="relative w-full max-w-sm rounded-3xl mb-6 overflow-hidden"
            style={{
              height: "320px",
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "#fdf2f8",
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: isDark 
                ? "2px solid rgba(236, 72, 153, 0.3)" 
                : "2px solid #fbcfe8",
              boxShadow: isDark 
                ? "0 0 40px rgba(236, 72, 153, 0.3)"
                : "0 4px 20px rgba(236, 72, 153, 0.2)"
            }}
          >
            {/* Animated Background */}
            {isScanning && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
                <div 
                  className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-pink-400 to-transparent" 
                  style={{ animation: 'scan 2s linear infinite' }} 
                />
              </div>
            )}

            {/* Hand Animation or Status */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
              {isScanning ? (
                <div className="text-center">
                  <Activity 
                    className={isDark ? "mx-auto text-pink-300 animate-pulse mb-3" : "mx-auto text-pink-500 animate-pulse mb-3"} 
                    size={64} 
                  />
                  <p 
                    className="text-lg font-semibold"
                    style={{ color: theme.textPrimary }}
                  >
                    Scanning...
                  </p>
                  <p 
                    className="text-sm mt-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Keep your finger steady
                  </p>
                </div>
              ) : (
                <img 
                  src="./hand-animation.gif" 
                  alt="Place finger here"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Pulse Ring Animation */}
            {isScanning && (
              <>
                <div 
                  className="absolute inset-0 rounded-3xl animate-ping"
                  style={{
                    border: "2px solid rgba(236, 72, 153, 0.5)",
                    animationDuration: "2s"
                  }}
                />
                <div 
                  className="absolute inset-4 rounded-3xl animate-ping"
                  style={{
                    border: "2px solid rgba(236, 72, 153, 0.3)",
                    animationDuration: "2.5s",
                    animationDelay: "0.5s"
                  }}
                />
              </>
            )}
          </div>

          {/* Scan Button */}
          <button
            onClick={handleVitals}
            disabled={isScanning}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
              transition-all duration-200 mb-6
              ${isScanning 
                ? 'cursor-not-allowed opacity-70' 
                : 'active:scale-95 hover:scale-105'
              }
            `}
            style={isScanning ? {
              background: "rgba(236, 72, 153, 0.2)",
              border: "2px solid rgba(236, 72, 153, 0.4)",
              color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(31, 41, 55, 0.6)"
            } : isDark ? {
              background: "linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(219, 39, 119, 0.3) 100%)",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(236, 72, 153, 0.4)",
              boxShadow: "0 4px 20px rgba(236, 72, 153, 0.3)",
              color: "white"
            } : {
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              border: "2px solid #be185d",
              boxShadow: "0 4px 20px rgba(236, 72, 153, 0.4)",
              color: "white"
            }}
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Scanning Vitals...
              </>
            ) : (
              <>
                <Activity size={24} />
                Start Vital Scan
              </>
            )}
          </button>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-2xl pb-4">
            <div 
              className="p-3 rounded-xl text-center"
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fee2e2",
                border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "2px solid #fecaca"
              }}
            >
              <Heart 
                className={isDark ? "mx-auto text-red-300 mb-2" : "mx-auto text-red-500 mb-2"} 
                size={20} 
              />
              <p 
                className="text-xs font-semibold"
                style={{ color: isDark ? "#fca5a5" : "#dc2626" }}
              >
                Heart Rate
              </p>
            </div>
            
            <div 
              className="p-3 rounded-xl text-center"
              style={{
                background: isDark ? "rgba(59, 130, 246, 0.1)" : "#dbeafe",
                border: isDark ? "1px solid rgba(59, 130, 246, 0.3)" : "2px solid #93c5fd"
              }}
            >
              <Activity 
                className={isDark ? "mx-auto text-blue-300 mb-2" : "mx-auto text-blue-500 mb-2"} 
                size={20} 
              />
              <p 
                className="text-xs font-semibold"
                style={{ color: isDark ? "#93c5fd" : "#1e40af" }}
              >
                Blood Pressure
              </p>
            </div>
            
            <div 
              className="p-3 rounded-xl text-center"
              style={{
                background: isDark ? "rgba(16, 185, 129, 0.1)" : "#d1fae5",
                border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "2px solid #6ee7b7"
              }}
            >
              <Sparkles 
                className={isDark ? "mx-auto text-green-300 mb-2" : "mx-auto text-green-500 mb-2"} 
                size={20} 
              />
              <p 
                className="text-xs font-semibold"
                style={{ color: isDark ? "#6ee7b7" : "#059669" }}
              >
                Oxygen Level
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vital;
