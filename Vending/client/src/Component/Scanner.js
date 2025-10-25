import "./../App.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL, RETURN_URL } from "../config";
import { useNavigate } from "react-router-dom";
import {load} from '@cashfreepayments/cashfree-js';

let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: "sandbox"
    });
};
initializeSDK();

function Scanner() {
  const [data, setData] = useState([]);
  const [isScanned, setIsScanned] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const scannerRef = useRef(null);
  let totalPrice = 0;
  const navigator = useNavigate();
  
  // Initialize scanner when component mounts
  useEffect(() => {
    if (!isScanned && !isLoading) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );
      
      scanner.render(loadData, (error) => {
        console.warn(error);
      });
      
      scannerRef.current = scanner;
    }
    
    // Cleanup scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanned, isLoading]);

  async function checkStock(id, needQty) {
    var medData = { isAvailable: false, data: {}, qty: 0 };
    await axios.get(`${API_BASE_URL}/stock/${id}`).then((res) => {
      var isAvailable = res.data.stock >= needQty;
      medData.data = res.data;
      medData.qty = needQty;
      medData.isAvailable = isAvailable;
    });
    return medData;
  }

  async function loadData(decodedText, decodedResult) {
    if (!!decodedText) {
      setLoading(true);
      setLoadingText("Processing prescription...");
      
      // Clear the scanner
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      
      const decodeQrPayload = (text) => {
        if (!text) return null;
        let payload = String(text).trim();
        console.log('Raw QR payload length:', payload.length);
        console.log('Raw QR payload (start):', payload.slice(0, 80));
        console.log('Raw QR payload (end):', payload.slice(-80));
        
        // Strip data URL prefix if present
        const dataUrlMatch = payload.match(/^data:[^;]+;base64,(.+)$/i);
        if (dataUrlMatch) {
          payload = dataUrlMatch[1];
          console.log('After stripping data URL prefix');
        }
        
        // Handle Python bytes repr b'...'/b"..."
        if ((payload.startsWith("b'") && payload.endsWith("'")) || (payload.startsWith('b"') && payload.endsWith('"'))) {
          payload = payload.slice(2, -1);
          console.log('After removing Python b wrapper');
        }
        
        // If it already looks like JSON, try parsing directly
        if ((payload.startsWith('{') && payload.endsWith('}')) || (payload.startsWith('[') && payload.endsWith(']'))) {
          try {
            return JSON.parse(payload);
          } catch (_) {}
        }
        
        // Try percent-decoding then JSON
        try {
          const maybePlain = decodeURIComponent(payload);
          if ((maybePlain.startsWith('{') && maybePlain.endsWith('}')) || (maybePlain.startsWith('[') && maybePlain.endsWith(']'))) {
            return JSON.parse(maybePlain);
          }
        } catch (_) {}
        
        // Remove whitespace/newlines (including NBSP)
        payload = payload.replace(/[\s\u00A0]+/g, '');
        
        // Convert URL-safe base64 to standard (if using urlsafe_b64encode)
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');
        
        // Base64 sanity check (allow padding)
        const base64Re = /^[A-Za-z0-9+/]+={0,2}$/;
        if (!base64Re.test(payload)) {
          console.error('QR payload is not valid base64 after normalization');
          return null;
        }
        
        // Fix padding
        const padLen = payload.length % 4;
        if (padLen) payload += '='.repeat(4 - padLen);
        
        try {
          const jsonStr = atob(payload).replace(/^\uFEFF/, ''); // strip BOM
          console.log('Decoded JSON string length:', jsonStr.length);
          return JSON.parse(jsonStr);
        } catch (e) {
          console.error('Failed to decode/parse QR payload:', e);
          return null;
        }
      };

      var dd = decodeQrPayload(decodedText);
      if (!dd) {
        console.error('Failed to decode QR payload');
        setLoading(false);
        return;
      }
      var meds = [];
      setMedicines(meds);
      
      dd.map(async (d) => {
        var med = await checkStock(d.medicine_id, d.quantity);
        meds.push(med);
        if (meds.length == dd.length) {
          setMedicines(meds);
          setIsScanned(true);
          setLoading(false);
        }
      });
    }
  }

  const totalPriceofdata = () => {
    let y = 0;
    medicines.map((item, index) => {
      console.log(item.data.price)
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
    await axios.post(`${API_BASE_URL}/create-order`, order).then((res) => {
      console.log(res);
      console.log(res.data);
      sessionID = res.data.payment_session_id;
      orderID = res.data.order_id;
    });

    let checkoutOptions = {
      paymentSessionId: sessionID,
      returnUrl: RETURN_URL,
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

  const resetScanner = () => {
    setIsScanned(false);
    setMedicines([]);
    setData([]);
    // Reinitialize scanner
    setTimeout(() => {
      if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        );
        
        scanner.render(loadData, (error) => {
          console.warn(error);
        });
        
        scannerRef.current = scanner;
      }
    }, 100);
  };

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
  ) : isScanned == true && medicines.length > 0 ? (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-6">
        <h1 className="text-6xl font-black text-white mb-4 tracking-wide">Jeevika</h1>
        <div className="w-32 h-2 bg-gradient-to-r from-white to-blue-200 mx-auto rounded-full shadow-lg"></div>
        <p className="text-blue-100 text-xl mt-4 font-medium">Prescription Details</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Medicine List</h2>
            
            <div className="space-y-4 mb-8">
              {medicines.map((item, index) => (
                <div key={index} className={`p-4 rounded-2xl border-2 ${
                  item.isAvailable 
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-white' 
                    : 'bg-red-500/20 border-red-400/30 text-red-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className={`text-lg font-semibold ${
                        item.isAvailable ? 'text-white' : 'text-red-200'
                      }`}>
                        {item.data.medicine_name}
                      </p>
                      <p className={`text-sm ${
                        item.isAvailable ? 'text-emerald-100' : 'text-red-300'
                      }`}>
                        Price: ₹{item.data.price}
                      </p>
                    </div>
                    <div className={`text-xl font-bold ${
                      item.isAvailable ? 'text-white' : 'text-red-200'
                    }`}>
                      {item.isAvailable ? `x${item.qty}` : "Out of Stock"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl p-6 mb-8 border-2 border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Total Amount</p>
                <p className="text-4xl font-black text-white">₹{totalPriceofdata()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                className={`w-full rounded-2xl px-6 py-4 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-300/50 ${
                  totalPrice > 0
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-2 border-emerald-400/30"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed border-2 border-gray-400/20"
                }`}
                onClick={handleRedirect}
                disabled={!(totalPrice > 0)}
              >
                {totalPrice > 0 ? "Proceed to Payment" : "No Items Available"}
              </button>

              <button
                className="w-full rounded-2xl px-6 py-4 text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-2 border-red-400/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-300/50"
                onClick={resetScanner}
              >
                Scan New Prescription
              </button>

              <button
                className="w-full rounded-2xl px-6 py-4 text-lg font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-400/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-300/50"
                onClick={() => navigator('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-6">
        <h1 className="text-6xl font-black text-white mb-4 tracking-wide">Jeevika</h1>
        <div className="w-32 h-2 bg-gradient-to-r from-white to-blue-200 mx-auto rounded-full shadow-lg"></div>
        <p className="text-blue-100 text-xl mt-4 font-medium">Scan QR Code</p>
      </div>

      {/* Scanner Section */}
      <div className="flex-1 px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Position QR Code</h2>
              <p className="text-blue-100 text-lg">Align the prescription QR code within the scanner frame</p>
            </div>
            
            <div className="flex justify-center">
              <div 
                id="reader"
                className="rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl"
                style={{
                  width: "100%",
                  maxWidth: "400px"
                }}
              ></div>
            </div>

            <div className="text-center mt-8">
              <button
                className="rounded-2xl px-6 py-3 text-lg font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-400/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-300/50"
                onClick={() => navigator('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
