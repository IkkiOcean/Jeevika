import { useLocation } from "react-router-dom";
import Slider from "../component/slider/slider";
import Markdown from 'react-markdown';
import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import { 
  Thermometer,
  Heart,
  Wind,
  Activity,
  User,
  Calendar,
  TrendingUp
} from "lucide-react";
import Header from "../component/Header";

const VitalReport = () => {
    const location = useLocation();
    const { isDark } = useTheme();
    const data = location.state;
    const tempF = (data.temp * 9)/5 + 32;
    const [sliderHValue, setHValue] = useState(0);
    const [sliderWValue, setWValue] = useState(0);
    const [bmiStatus, setBmiStatus] = useState("");
    const [bmi, setBmi] = useState(0);
    let BMI = parseFloat((sliderWValue/Math.pow((sliderHValue/100),2)).toFixed(1));
    
    let tempReport, heartReport, oxygenReport;
    
    if (tempF >= 95 && tempF <= 99){
        tempReport = "Normal"
    } else if(tempF>= 99.1 && tempF <= 100.4 ){
        tempReport = "Low-grade Fever"
    } else if(tempF >= 100.5 && tempF <= 102.2){
        tempReport = "Moderate-grade Fever"
    } else if(tempF >= 102.4 && tempF <= 105.8){
        tempReport = "High-grade Fever"
    } else if (tempF < 95){
        tempReport = "Low Temperature"
    } else {
        tempReport = "Temperature not clear"
    }

    if(data.heart >60 && data.heart < 100){
        heartReport = "Normal"
    } else if(data.heart <60){
        heartReport = "Slow Heart Rate"
    } else {
        heartReport = "Fast Heart Rate"
    }

    if(data.oxygen >= 95){
        oxygenReport = "Normal"
    } else {
        oxygenReport = "Low Oxygen Level"
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}))
    
    useEffect(()=>{
        if (BMI<= 18.4 && BMI > 0){
            setBmi(BMI)
            setBmiStatus("You're Underweight");
        } else if(BMI <= 24.9 && BMI >= 18.5){
            setBmi(BMI)
            setBmiStatus("You're Healthy");
        } else if(BMI >= 25.0 && BMI <= 39.9){
            setBmi(BMI)
            setBmiStatus("You're Overweight")
        } else if(BMI >= 40){
            setBmi(BMI)
            setBmiStatus("You're Obese")
        } else {
            setBmi(0)
            setBmiStatus("Measure BMI")
        }
    },[BMI])

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
            className="w-full min-h-screen flex flex-col"
            style={{ background: theme.bg }}
        >
            {/* Background Elements - Only dark mode */}
            {isDark && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
                    <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
            )}

            {/* Header */}
            <Header showBackButton={true} backTo="/" />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto relative z-10 px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Title Section */}
                    <div 
                        className="mb-6 p-5 rounded-2xl"
                        style={{
                            background: theme.cardBg,
                            backdropFilter: isDark ? "blur(20px)" : "none",
                            border: `1px solid ${theme.border}`,
                            boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
                        }}
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400">
                                    <Activity className="text-white" size={28} />
                                </div>
                                <div>
                                    <h1 
                                        className="text-2xl md:text-3xl font-bold"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        Vitals Overview
                                    </h1>
                                    <p 
                                        className="text-sm"
                                        style={{ color: theme.textSecondary }}
                                    >
                                        Your health snapshot
                                    </p>
                                </div>
                            </div>
                            <div 
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{
                                    background: isDark ? "rgba(6, 182, 212, 0.1)" : "#dbeafe",
                                    color: isDark ? "#a5f3fc" : "#1e40af"
                                }}
                            >
                                <Calendar size={20} />
                                <span className="text-base font-medium">
                                    {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        
                        {/* Left: Vital Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Vital Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                
                                {/* Temperature Card */}
                                <div 
                                    className="rounded-2xl p-5 transition-all duration-200 hover:scale-105"
                                    style={{
                                        background: theme.cardBg,
                                        backdropFilter: isDark ? "blur(20px)" : "none",
                                        boxShadow: isDark ? "none" : "0 4px 20px rgba(251, 146, 60, 0.15)",
                                        border: isDark ? "1px solid rgba(251, 146, 60, 0.3)" : "2px solid #fed7aa"
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-300 to-orange-400">
                                            <Thermometer className="text-white" size={24} />
                                        </div>
                                        <h3 
                                            className="font-bold"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            Temperature
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span 
                                            className="text-4xl font-black"
                                            style={{ color: isDark ? "#fb923c" : "#ea580c" }}
                                        >
                                            {tempF.toFixed(1)}
                                        </span>
                                        <span 
                                            className="text-sm"
                                            style={{ color: isDark ? "#fdba74" : "#f97316" }}
                                        >
                                            °F
                                        </span>
                                        <span 
                                            className="text-sm"
                                            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                                        >
                                            / {data.temp}°C
                                        </span>
                                    </div>
                                    
                                    <div 
                                        className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold mb-4"
                                        style={{
                                            background: tempReport === "Normal" ? "#d1fae5" : "#fecaca",
                                            color: tempReport === "Normal" ? "#059669" : "#dc2626"
                                        }}
                                    >
                                        {tempReport}
                                    </div>

                                    {/* Mini Graph */}
                                    <div className="mt-4">
                                        <img src="./temp-graph.png" alt="Temperature trend" className="w-full h-16 object-cover rounded-lg opacity-70" />
                                    </div>
                                </div>

                                {/* Heart Rate Card */}
                                <div 
                                    className="rounded-2xl p-5 transition-all duration-200 hover:scale-105"
                                    style={{
                                        background: theme.cardBg,
                                        backdropFilter: isDark ? "blur(20px)" : "none",
                                        boxShadow: isDark ? "none" : "0 4px 20px rgba(236, 72, 153, 0.15)",
                                        border: isDark ? "1px solid rgba(236, 72, 153, 0.3)" : "2px solid #fbcfe8"
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400">
                                            <Heart className="text-white" size={24} />
                                        </div>
                                        <h3 
                                            className="font-bold"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            Heart Rate
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span 
                                            className="text-4xl font-black"
                                            style={{ color: isDark ? "#f472b6" : "#db2777" }}
                                        >
                                            {data.heart}
                                        </span>
                                        <span 
                                            className="text-sm"
                                            style={{ color: isDark ? "#f9a8d4" : "#ec4899" }}
                                        >
                                            bpm
                                        </span>
                                    </div>
                                    
                                    <div 
                                        className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold mb-4"
                                        style={{
                                            background: heartReport === "Normal" ? "#d1fae5" : "#fecaca",
                                            color: heartReport === "Normal" ? "#059669" : "#dc2626"
                                        }}
                                    >
                                        {heartReport}
                                    </div>

                                    {/* Mini Graph */}
                                    <div className="mt-4">
                                        <img src="./heart-graph.png" alt="Heart rate trend" className="w-full h-16 object-cover rounded-lg opacity-70" />
                                    </div>
                                </div>

                                {/* Oxygen Level Card */}
                                <div 
                                    className="rounded-2xl p-5 transition-all duration-200 hover:scale-105"
                                    style={{
                                        background: theme.cardBg,
                                        backdropFilter: isDark ? "blur(20px)" : "none",
                                        boxShadow: isDark ? "none" : "0 4px 20px rgba(6, 182, 212, 0.15)",
                                        border: isDark ? "1px solid rgba(6, 182, 212, 0.3)" : "2px solid #a5f3fc"
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400">
                                            <Wind className="text-white" size={24} />
                                        </div>
                                        <h3 
                                            className="font-bold"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            Oxygen
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span 
                                            className="text-4xl font-black"
                                            style={{ color: isDark ? "#22d3ee" : "#0891b2" }}
                                        >
                                            {data.oxygen}
                                        </span>
                                        <span 
                                            className="text-sm"
                                            style={{ color: isDark ? "#67e8f9" : "#06b6d4" }}
                                        >
                                            %
                                        </span>
                                    </div>
                                    
                                    <div 
                                        className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold mb-4"
                                        style={{
                                            background: oxygenReport === "Normal" ? "#d1fae5" : "#fecaca",
                                            color: oxygenReport === "Normal" ? "#059669" : "#dc2626"
                                        }}
                                    >
                                        {oxygenReport}
                                    </div>

                                    {/* Mini Graph */}
                                    <div className="mt-4">
                                        <img src="./oxygen-graph.png" alt="Oxygen trend" className="w-full h-16 object-cover rounded-lg opacity-70" />
                                    </div>
                                </div>
                            </div>

                            {/* AI Report Section */}
                            <div 
                                className="rounded-2xl p-6"
                                style={{
                                    background: theme.cardBg,
                                    backdropFilter: isDark ? "blur(20px)" : "none",
                                    border: `1px solid ${theme.border}`,
                                    boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
                                }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400">
                                        <TrendingUp className="text-white" size={24} />
                                    </div>
                                    <h3 
                                        className="text-xl font-bold"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        Health Analysis
                                    </h3>
                                </div>
                                <div 
                                    className="prose max-w-none leading-relaxed"
                                    style={{ color: isDark ? "#d1d5db" : "#374151" }}
                                >
                                    <Markdown>{data.report}</Markdown>
                                </div>
                            </div>
                        </div>

                        {/* Right: BMI Calculator */}
                        <div className="space-y-4">
                            <div 
                                className="rounded-2xl p-6"
                                style={{
                                    background: theme.cardBg,
                                    backdropFilter: isDark ? "blur(20px)" : "none",
                                    border: `1px solid ${theme.border}`,
                                    boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
                                }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400">
                                        <User className="text-white" size={24} />
                                    </div>
                                    <h3 
                                        className="text-xl font-bold"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        BMI Calculator
                                    </h3>
                                </div>

                                {/* Height Slider */}
                                <div 
                                    className="mb-4 p-4 rounded-xl border-2"
                                    style={{
                                        background: isDark ? "rgba(251, 146, 60, 0.1)" : "#fff7ed",
                                        borderColor: isDark ? "rgba(251, 146, 60, 0.3)" : "#fed7aa"
                                    }}
                                >
                                    <label 
                                        className="text-sm font-bold mb-2 block"
                                        style={{ color: isDark ? "#fdba74" : "#c2410c" }}
                                    >
                                        Height (cm)
                                    </label>
                                    <Slider setter={setHValue} id={0} maxUnit={190}/>
                                </div>

                                {/* Weight Slider */}
                                <div 
                                    className="mb-6 p-4 rounded-xl border-2"
                                    style={{
                                        background: isDark ? "rgba(6, 182, 212, 0.1)" : "#cffafe",
                                        borderColor: isDark ? "rgba(6, 182, 212, 0.3)" : "#a5f3fc"
                                    }}
                                >
                                    <label 
                                        className="text-sm font-bold mb-2 block"
                                        style={{ color: isDark ? "#67e8f9" : "#0e7490" }}
                                    >
                                        Weight (kg)
                                    </label>
                                    <Slider setter={setWValue} id={1} maxUnit={150}/>
                                </div>

                                {/* BMI Result */}
                                <div 
                                    className="p-6 rounded-xl text-center mb-6 border-3"
                                    style={{
                                        background: isDark 
                                            ? "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)"
                                            : "linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)",
                                        border: `3px solid ${isDark ? "rgba(251, 191, 36, 0.4)" : "#fbbf24"}`
                                    }}
                                >
                                    <p 
                                        className="text-sm font-bold mb-2"
                                        style={{ color: isDark ? "#fcd34d" : "#b45309" }}
                                    >
                                        Body Mass Index
                                    </p>
                                    <div 
                                        className="text-5xl font-black mb-3"
                                        style={{ color: isDark ? "#fbbf24" : "#d97706" }}
                                    >
                                        {bmi || "--"}
                                    </div>
                                    <div 
                                        className="inline-block px-4 py-2 rounded-lg font-bold text-sm"
                                        style={{
                                            background: bmi > 0 ? (isDark ? "rgba(251, 191, 36, 0.3)" : "#fbbf24") : (isDark ? "rgba(148, 163, 184, 0.2)" : "#cbd5e1"),
                                            color: bmi > 0 ? (isDark ? "#fef3c7" : "white") : (isDark ? "#94a3b8" : "#64748b")
                                        }}
                                    >
                                        {bmiStatus}
                                    </div>
                                </div>

                                {/* Body Illustration */}
                                <div 
                                    className="flex justify-center p-4 rounded-xl"
                                    style={{
                                        background: isDark 
                                            ? "linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
                                            : "linear-gradient(to bottom, #dbeafe 0%, #f3e8ff 100%)"
                                    }}
                                >
                                    <img src="./male-body.png" alt="Body" className="h-48" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VitalReport;
