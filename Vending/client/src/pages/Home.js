import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { 
  ClipboardList, 
  Heart, 
  Pill, 
  BotMessageSquare, 
  Loader2,
  ShieldCheck
} from "lucide-react";
import Header from '../component/Header';

function Home() {
  let navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const { isDark } = useTheme();

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

  return isLoading ? (
    // Loading Screen
    <div
      className="w-full h-screen flex justify-center flex-col items-center relative overflow-hidden"
      style={{ background: theme.bg }}
    >
      {isDark && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}
      
      <Loader2 
        className="animate-spin relative z-10" 
        size={80}
        strokeWidth={2}
        style={{ color: isDark ? "#ffffff" : "#3b82f6" }}
      />
      <h3 
        className="text-2xl md:text-3xl mt-6 font-medium text-center px-4 relative z-10"
        style={{ color: theme.textPrimary }}
      >
        {loadingText}
      </h3>
    </div>
  ) : (
    <div 
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
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

      {/* Header */}
      <Header showBackButton={false} />
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto relative z-10 px-3 md:px-6 py-4 md:py-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Clear Instructions */}
          <div 
            className="text-center mb-4 md:mb-6 p-4 md:p-6 rounded-2xl"
            style={{
              background: theme.cardBg,
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <p 
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-1"
              style={{ color: theme.textPrimary }}
            >
              How can we help you today?
            </p>
            <p 
              className="text-base md:text-lg"
              style={{ color: theme.textSecondary }}
            >
              Select one option below
            </p>
          </div>

          {/* Simple Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4">
            
            {/* Option 1: Prescription */}
            <button
              className="font-bold text-base md:text-lg lg:text-xl p-6 md:p-8 rounded-2xl transition-all duration-200 active:scale-98 hover:scale-105 touch-manipulation relative group"
              style={isDark ? {
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.25) 100%)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(6, 182, 212, 0.4)",
                boxShadow: "0 4px 20px rgba(6, 182, 212, 0.25)",
                color: "white"
              } : {
                background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                border: "2px solid #7dd3fc",
                boxShadow: "0 4px 20px rgba(6, 182, 212, 0.2)",
                color: "#0c4a6e"
              }}
              onClick={() => navigate("/scan")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div 
                  className="p-3 rounded-xl border"
                  style={{
                    background: isDark ? "rgba(6, 182, 212, 0.3)" : "rgba(6, 182, 212, 0.2)",
                    borderColor: isDark ? "rgba(6, 182, 212, 0.4)" : "#7dd3fc"
                  }}
                >
                  <ClipboardList 
                    size={40} 
                    strokeWidth={2.5} 
                    className="md:w-12 md:h-12"
                    style={{ color: isDark ? "#67e8f9" : "#0891b2" }}
                  />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl mb-1">I have a Prescription</div>
                  <div 
                    className="text-sm md:text-base opacity-90"
                    style={{ color: isDark ? "#a5f3fc" : "#0e7490" }}
                  >
                    Upload doctor's prescription
                  </div>
                </div>
              </div>
            </button>
            
            {/* Option 2: Vitals */}
            <button
              className="font-bold text-base md:text-lg lg:text-xl p-6 md:p-8 rounded-2xl transition-all duration-200 active:scale-98 hover:scale-105 touch-manipulation relative group"
              style={isDark ? {
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0.25) 100%)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(236, 72, 153, 0.4)",
                boxShadow: "0 4px 20px rgba(236, 72, 153, 0.25)",
                color: "white"
              } : {
                background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                border: "2px solid #f9a8d4",
                boxShadow: "0 4px 20px rgba(236, 72, 153, 0.2)",
                color: "#831843"
              }}
              onClick={() => navigate("/vital")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div 
                  className="p-3 rounded-xl border"
                  style={{
                    background: isDark ? "rgba(236, 72, 153, 0.3)" : "rgba(236, 72, 153, 0.2)",
                    borderColor: isDark ? "rgba(236, 72, 153, 0.4)" : "#f9a8d4"
                  }}
                >
                  <Heart 
                    size={40} 
                    strokeWidth={2.5} 
                    className="md:w-12 md:h-12"
                    style={{ color: isDark ? "#f9a8d4" : "#db2777" }}
                  />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl mb-1">Check My Health</div>
                  <div 
                    className="text-sm md:text-base opacity-90"
                    style={{ color: isDark ? "#fbcfe8" : "#9d174d" }}
                  >
                    Measure vitals & BP
                  </div>
                </div>
              </div>
            </button>
            
            {/* Option 3: OTC Medicine */}
            <button
              className="font-bold text-base md:text-lg lg:text-xl p-6 md:p-8 rounded-2xl transition-all duration-200 active:scale-98 hover:scale-105 touch-manipulation relative group"
              style={isDark ? {
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(16, 185, 129, 0.4)",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)",
                color: "white"
              } : {
                background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                border: "2px solid #6ee7b7",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
                color: "#064e3b"
              }}
              onClick={() => {
                setLoading(true);
                setLoadingText("Loading medicines...");
                navigate("/counter");
              }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div 
                  className="p-3 rounded-xl border"
                  style={{
                    background: isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)",
                    borderColor: isDark ? "rgba(16, 185, 129, 0.4)" : "#6ee7b7"
                  }}
                >
                  <Pill 
                    size={40} 
                    strokeWidth={2.5} 
                    className="md:w-12 md:h-12"
                    style={{ color: isDark ? "#6ee7b7" : "#059669" }}
                  />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl mb-1">Buy Medicine Directly</div>
                  <div 
                    className="text-sm md:text-base opacity-90"
                    style={{ color: isDark ? "#a7f3d0" : "#065f46" }}
                  >
                    No prescription needed
                  </div>
                </div>
              </div>
            </button>
            
            {/* Option 4: AI Recommendation - Disabled */}
            <button
              className="font-bold text-base md:text-lg lg:text-xl p-6 md:p-8 rounded-2xl cursor-not-allowed relative opacity-60"
              style={{
                background: isDark ? "rgba(100, 116, 139, 0.2)" : "#e2e8f0",
                backdropFilter: isDark ? "blur(15px)" : "none",
                border: `2px solid ${isDark ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"}`,
                color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(100, 116, 139, 0.7)"
              }}
              disabled
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div 
                  className="p-3 rounded-xl border"
                  style={{
                    background: isDark ? "rgba(100, 116, 139, 0.2)" : "rgba(148, 163, 184, 0.2)",
                    borderColor: isDark ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"
                  }}
                >
                  <BotMessageSquare 
                    size={40} 
                    strokeWidth={2.5} 
                    className="opacity-60 md:w-12 md:h-12"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl mb-1">AI Health Assistant</div>
                  <div className="text-sm md:text-base">
                    Coming Soon
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Security Note - Compact */}
          <div 
            className="p-4 rounded-xl flex items-center justify-center gap-3 text-center"
            style={{
              background: isDark ? "rgba(6, 182, 212, 0.1)" : "#dbeafe",
              backdropFilter: isDark ? "blur(15px)" : "none",
              border: isDark ? "1px solid rgba(6, 182, 212, 0.3)" : "2px solid #93c5fd"
            }}
          >
            <ShieldCheck 
              size={24} 
              strokeWidth={2.5} 
              className="flex-shrink-0"
              style={{ color: isDark ? "#67e8f9" : "#0891b2" }}
            />
            <p 
              className="text-sm md:text-base lg:text-lg font-medium"
              style={{ color: isDark ? "#ffffff" : "#0c4a6e" }}
            >
              Your data is secure & private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
