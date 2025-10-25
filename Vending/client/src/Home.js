import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Heart, 
  Pill, 
  Lightbulb 
} from "lucide-react";

function Home() {
  let navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  return isLoading ? (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 flex flex-col justify-center items-center p-8">
      <div className="text-center space-y-12">
        <div className="relative">
          <div className="w-32 h-32 border-6 border-blue-300 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg"></div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white max-w-lg leading-relaxed">{loadingText}</h3>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      {/* Header - Compact for portrait */}
      <div className="text-center py-8 px-6">
        <h1 className="text-6xl font-black text-white mb-4 tracking-wide">
          Jeevika
        </h1>
        <div className="w-32 h-2 bg-gradient-to-r from-white to-blue-200 mx-auto rounded-full shadow-lg"></div>
        <p className="text-blue-100 text-xl mt-4 font-medium">Healthcare Vending Machine</p>
      </div>

      {/* Main Content - Single column for portrait */}
      <div className="flex-1 px-8 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Scan Prescription - Primary action */}
          <button
            onClick={() => navigate("/scan")}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-3xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-6 focus:ring-emerald-300/50 border-4 border-emerald-400/30"
          >
            <div className="flex items-center space-x-8">
              <div className="bg-white/25 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
                <FileText className="w-12 h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-3xl font-black leading-tight mb-2">Scan Prescription</h3>
                <p className="text-emerald-100 text-lg opacity-95 font-medium">Upload and process medical prescriptions instantly</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>

          {/* Scan Vitals */}
          <button
            onClick={() => navigate('/vital')}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-3xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-6 focus:ring-purple-300/50 border-4 border-purple-400/30"
          >
            <div className="flex items-center space-x-8">
              <div className="bg-white/25 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
                <Heart className="w-12 h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-3xl font-black leading-tight mb-2">Scan Vitals</h3>
                <p className="text-purple-100 text-lg opacity-95 font-medium">Monitor your health metrics and vitals</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>

          {/* Over Counter Medicine */}
          <button
            onClick={() => {
              setLoading(true);
              setLoadingText("Fetching available medicines");
              navigate("/counter");
            }}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-3xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-6 focus:ring-rose-300/50 border-4 border-rose-400/30"
          >
            <div className="flex items-center space-x-8">
              <div className="bg-white/25 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
                <Pill className="w-12 h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-3xl font-black leading-tight mb-2">Over Counter Medicine</h3>
                <p className="text-rose-100 text-lg opacity-95 font-medium">Access non-prescription medications</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>

          {/* Medicine Recommendation - Disabled */}
          <button
            disabled
            className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-3xl p-8 transition-all duration-300 opacity-50 cursor-not-allowed border-4 border-gray-400/20"
          >
            <div className="flex items-center space-x-8">
              <div className="bg-white/15 p-6 rounded-2xl backdrop-blur-sm">
                <Lightbulb className="w-12 h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-3xl font-black leading-tight mb-2">Medicine Recommendation</h3>
                <p className="text-gray-200 text-lg opacity-80 font-medium">AI-powered medication suggestions (Coming Soon)</p>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Footer - Minimal for space efficiency */}
      <div className="text-center py-6 px-6 bg-black/10 backdrop-blur-sm">
        <p className="text-blue-100 text-lg font-medium">
          Touch any option above to begin
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;