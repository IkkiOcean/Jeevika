import { useState } from "react";
import { QrReader } from "react-qr-reader-es6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { 
  Loader2, 
  ScanLine, 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  CreditCard,
  AlertCircle,
  Camera
} from "lucide-react";
import { load } from '@cashfreepayments/cashfree-js';
import Header from "../components/Header";

let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: "sandbox"
    });
};
initializeSDK();

function Scanner() {
  const [isScanned, setIsScanned] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const { isDark } = useTheme();
  let totalPrice = 0;
  const navigator = useNavigate();

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
    border: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(59, 130, 246, 0.2)",
    scannerBorder: isDark ? "#06b6d4" : "#3b82f6",
    scannerGlow: isDark ? "rgba(6, 182, 212, 0.4)" : "rgba(59, 130, 246, 0.3)"
  };

  async function checkStock(id, needQty) {
    var medData = { isAvailable: false, data: {}, qty: 0 };
    await axios.get(`http://127.0.0.1:5000/stock/${id}`).then((res) => {
      var isAvailable = res.data.stock >= needQty;
      medData.data = res.data;
      medData.qty = needQty;
      medData.isAvailable = isAvailable;
    });
    return medData;
  }

  async function loadData(result, error) {
    if (!!result) {
      setLoading(true);
      setLoadingText("Processing prescription...");
      var dd = JSON.parse(atob(result?.text));
      var meds = [];
      setMedicines(meds);
      dd.map(async (d) => {
        var med = await checkStock(d.medicine_id, d.quantity);
        meds.push(med);
        if (meds.length === dd.length) {
          setMedicines(meds);
          setIsScanned(true);
          setLoading(false);
        }
      });
    }
    if (!!error) {
      console.info(error);
    }
  }

  const totalPriceofdata = () => {
    let y = 0;
    medicines.map((item) => {
      if(item.isAvailable){
        y = y + parseFloat(item.data.price) * parseFloat(item.qty);
      }
    });
    totalPrice = y;
    return y;
  }

  const handleRedirect = async() => {
    const order_detail = {
      customer_id : '12345',
      amount : totalPrice,
    }
    const order  = {
      orderDetail : order_detail,
      medicine : medicines
    }
    let sessionID;
    let orderID;
    await axios.post(`http://127.0.0.1:5000/create-order`, order).then((res) => {
      sessionID = res.data.payment_session_id;
      orderID = res.data.order_id;
    });

    let checkoutOptions = {
      paymentSessionId: sessionID,
      returnUrl: f`http://localhost:3000/dispense-med?id=${orderID}`,
      appearance: {
          width: "425px",
          height: "700px",
      },
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        console.log("There is some payment error, Check for Payment Status");
        console.log(result.error);
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails.paymentMessage);
      }
    });
  }

  return isLoading ? (
    // Modern Loading Screen
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
  ) : isScanned === true && medicines.length > 0 ? (
    // Medicine Review Screen
    <div 
      className="w-full min-h-screen flex flex-col"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Header */}
      <Header showBackButton={true} backTo="/" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto pb-4">
          
          {/* Title Section */}
          <div 
            className="mb-4 p-4 md:p-5 rounded-2xl text-center"
            style={{
              background: theme.cardBg,
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <ShoppingCart style={{ color: theme.textSecondary }} size={28} />
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: theme.textPrimary }}>
                Your Prescription
              </h2>
            </div>
            <p className="text-sm md:text-base" style={{ color: theme.textSecondary }}>
              Review medicines and proceed to payment
            </p>
          </div>

          {/* Medicine List */}
          <div 
            className="mb-4 rounded-2xl overflow-hidden"
            style={{
              background: theme.cardBg,
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            {medicines.map((item, index) => (
              <div
                key={index}
                className="p-4 last:border-b-0 transition-colors"
                style={{ 
                  borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e5e7eb"
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.isAvailable ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0" size={18} />
                      )}
                      <h3 
                        className={`text-base md:text-lg font-semibold`}
                        style={{ color: item.isAvailable ? theme.textPrimary : "#ef4444" }}
                      >
                        {item.data.medicine_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span style={{ color: theme.textSecondary }}>
                        ₹{item.data.price} per unit
                      </span>
                      {item.isAvailable && (
                        <span style={{ color: isDark ? "#d1d5db" : "#6b7280" }}>
                          Qty: {item.qty}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {item.isAvailable ? (
                      <div 
                        className="text-lg md:text-xl font-bold"
                        style={{ color: isDark ? "#06b6d4" : "#3b82f6" }}
                      >
                        ₹{(parseFloat(item.data.price) * parseFloat(item.qty)).toFixed(2)}
                      </div>
                    ) : (
                      <div 
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2",
                          border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
                          color: "#ef4444"
                        }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Total Section */}
            <div 
              className="p-4 md:p-5"
              style={{
                background: isDark ? "rgba(6, 182, 212, 0.1)" : "#dbeafe",
                borderTop: isDark ? "2px solid rgba(6, 182, 212, 0.3)" : "2px solid #93c5fd"
              }}
            >
              <div className="flex items-center justify-between">
                <span 
                  className="text-lg md:text-xl font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  Total Amount
                </span>
                <span 
                  className="text-xl md:text-2xl font-black"
                  style={{ color: isDark ? "#06b6d4" : "#1e40af" }}
                >
                  ₹{totalPriceofdata().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Out of Stock Warning */}
          {medicines.some(item => !item.isAvailable) && (
            <div 
              className="mb-4 p-3 rounded-xl flex items-start gap-2"
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
                border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "2px solid #fecaca"
              }}
            >
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm" style={{ color: isDark ? "#fca5a5" : "#dc2626" }}>
                Some medicines are out of stock and won't be included
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleRedirect}
              disabled={!(totalPrice > 0)}
              className={`
                py-4 px-6 rounded-xl font-bold text-base md:text-lg
                transition-all duration-200 flex items-center justify-center gap-2
                ${totalPrice > 0 
                  ? 'active:scale-98 hover:scale-105' 
                  : 'cursor-not-allowed opacity-50'
                }
              `}
              style={totalPrice > 0 ? (isDark ? {
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(16, 185, 129, 0.4)",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                color: "white"
              } : {
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "2px solid #047857",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                color: "white"
              }) : {
                background: isDark ? "rgba(100, 116, 139, 0.2)" : "#e2e8f0",
                border: `2px solid ${isDark ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"}`,
                color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(100, 116, 139, 0.5)"
              }}
            >
              <CreditCard size={20} />
              Proceed to Payment
            </button>

            <button
              onClick={() => navigator('/')}
              className="py-4 px-6 rounded-xl font-bold text-base md:text-lg
                       transition-all duration-200 active:scale-98 hover:scale-105
                       flex items-center justify-center gap-2"
              style={isDark ? {
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(239, 68, 68, 0.4)",
                boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
                color: "white"
              } : {
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                border: "2px solid #b91c1c",
                boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)",
                color: "white"
              }}
            >
              <XCircle size={20} />
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // QR Scanner Screen
    <div 
      className="w-full h-screen flex flex-col"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Header */}
      <Header showBackButton={true} backTo="/" />

      {/* Scanner Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="flex flex-col items-center justify-start min-h-full px-4 py-4 md:py-6">
          
          {/* Instruction Panel */}
          <div 
            className="mb-4 p-3 md:p-4 rounded-2xl text-center max-w-2xl w-full"
            style={{
              background: theme.cardBg,
              backdropFilter: isDark ? "blur(20px)" : "none",
              border: `1px solid ${theme.border}`,
              boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Camera style={{ color: theme.textSecondary }} size={24} />
              <h2 
                className="text-lg md:text-xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                Scan QR Code
              </h2>
            </div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Align the QR code within the frame
            </p>
          </div>

          {/* Scanner Container */}
          <div className="relative w-full max-w-md mx-auto mb-4">
            <div 
              className="relative rounded-3xl overflow-hidden"
              style={{
                boxShadow: `0 0 40px ${theme.scannerGlow}`,
                border: `4px solid ${theme.scannerBorder}`
              }}
            >
              <QrReader
                constraints={{
                  facingMode: "environment",
                }}
                videoStyle={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
                onResult={async (result, error) => {
                  loadData(result, error);
                }}
                style={{ width: "100%" }}
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Dark Overlay */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    background: "radial-gradient(circle at center, transparent 25%, rgba(0, 0, 0, 0.6) 55%)"
                  }} 
                />
                
                {/* Alignment Frame */}
                <div className="relative" style={{ width: '240px', height: '240px' }}>
                  {/* Corner Brackets */}
                  <div 
                    className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-2xl"
                    style={{ 
                      borderColor: theme.scannerBorder,
                      boxShadow: `0 0 10px ${theme.scannerGlow}`,
                      animation: 'pulse 2s ease-in-out infinite'
                    }} 
                  />
                  <div 
                    className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-2xl"
                    style={{ 
                      borderColor: theme.scannerBorder,
                      boxShadow: `0 0 10px ${theme.scannerGlow}`,
                      animation: 'pulse 2s ease-in-out infinite 0.2s'
                    }} 
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-2xl"
                    style={{ 
                      borderColor: theme.scannerBorder,
                      boxShadow: `0 0 10px ${theme.scannerGlow}`,
                      animation: 'pulse 2s ease-in-out infinite 0.4s'
                    }} 
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-2xl"
                    style={{ 
                      borderColor: theme.scannerBorder,
                      boxShadow: `0 0 10px ${theme.scannerGlow}`,
                      animation: 'pulse 2s ease-in-out infinite 0.6s'
                    }} 
                  />
                  
                  {/* Scanning Line */}
                  <div 
                    className="absolute left-0 right-0 h-1"
                    style={{
                      background: `linear-gradient(to right, transparent, ${theme.scannerBorder}, transparent)`,
                      boxShadow: `0 0 10px ${theme.scannerGlow}`,
                      animation: 'scan 2s linear infinite'
                    }} 
                  />
                </div>

                {/* Bottom Hint */}
                <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                  <div 
                    className="inline-block px-3 py-1.5 rounded-lg"
                    style={{
                      background: isDark ? "rgba(6, 182, 212, 0.2)" : "rgba(59, 130, 246, 0.2)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${theme.scannerBorder}`
                    }}
                  >
                    <p 
                      className="text-xs font-medium flex items-center gap-2 justify-center"
                      style={{ color: isDark ? "#ffffff" : theme.textPrimary }}
                    >
                      <ScanLine size={14} className="animate-pulse" />
                      Place QR code here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Text */}
            <div 
              className="mt-3 p-2.5 rounded-xl text-center"
              style={{
                background: isDark ? "rgba(6, 182, 212, 0.1)" : "#dbeafe",
                border: isDark ? "1px solid rgba(6, 182, 212, 0.3)" : "2px solid #93c5fd"
              }}
            >
              <p 
                className="text-xs md:text-sm"
                style={{ color: theme.textSecondary }}
              >
                Scanning automatically when QR code is detected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

export default Scanner;
