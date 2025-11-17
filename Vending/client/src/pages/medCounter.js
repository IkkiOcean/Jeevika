import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import NumberInput from "../components/Quantity.js";
import axiosInstance from "../utils/api.js";
import { useLoaderData } from "react-router-dom";
import { useTheme } from '../context/ThemeContext.js';
import {
  Search,
  ShoppingCart,
  Pill,
  X,
  CreditCard,
  Package,
} from "lucide-react";
import Header from "../components/Header.js";
import { load } from "@cashfreepayments/cashfree-js";

let cashfree;
var initializeSDK = async function () {
  cashfree = await load({
    mode: "sandbox",
  });
};
initializeSDK();

const Counter = () => {
  const data = useLoaderData();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [amount, setAmount] = useState(0);
  const [tempCount, setTempCount] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [meds, setMeds] = useState(data);
  const [resultStatus, setResultStatus] = useState("");
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

  if (meds.length == 0) {
    return (
      <div className="container">
        ADD PATIENT DATA USING APIS, NO INTERFACE AVAILABLE RIGHT NOW
      </div>
    );
  }

  const handleSearchText = (value) => {
    setSearchText(value);
    if (value == "") {
      setMeds(data);
    } else {
      handleSearch(value);
    }
  };

  const handleOpen = (item) => {
    setAmount(0);
    setCurrentItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem([]);
    setTempCount(0);
  };

  const handleCart = (item, quantity) => {
    var cart = {
      medicine_name: item.medicine_name,
      medicine_id: item.medicine_id,
      qty: quantity,
      amount: quantity * item.price,
      stock: item.stock,
    };
    setCartItems((oldArray) => [...oldArray, cart]);
  };

  const handleRemove = (item) => {
    let newCart = cartItems.filter((e) => e.medicine_id !== item.medicine_id);
    setCartItems(newCart);
    setTotalPrice(totalPrice - item.amount);
  };

  const handleRedirect = async () => {
    let medicines = [];
    cartItems.forEach((item) => {
      let data = {
        isAvailable: true,
        data: {
          medicine_id: item.medicine_id,
          medicine_name: item.medicine_name,
          price: item.amount / item.qty,
          stock: item.stock,
        },
        qty: item.qty,
      };
      medicines.push(data);
    });
    const order_detail = {
      customer_id: "12345",
      amount: totalPrice,
    };
    const order = {
      orderDetail: order_detail,
      medicine: medicines,
    };
    let sessionID;
    let orderID;
    await axios
      .post(`http://127.0.0.1:5000/create-order`, order)
      .then((res) => {
        sessionID = res.data.payment_session_id;
        orderID = res.data.order_id;
      });

    let checkoutOptions = {
      paymentSessionId: sessionID,
      returnUrl: `http://localhost:3000/dispense-med?id=${orderID}`,
      appearance: {
        width: "425px",
        height: "700px",
      },
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        console.log("There is some payment error, Check for Payment Status");
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        console.log("Payment has been completed, Check for Payment Status");
        
      }
    });
  };

  const handleButtonChange = (id) => {
    var addButton = document.getElementById(`add-to-cart-${id}`);
    if (addButton.textContent == "Add to Cart") {
      addButton.textContent = "Added";
      addButton.disabled = true;
    } else {
      addButton.textContent = "Add to Cart";
      addButton.disabled = false;
    }
  };

  const handleSearch = (search_text) => {
    search_text = search_text.replace(" ", "");
    search_text = search_text.toLowerCase();
    function checkMeds(med_name) {
      med_name = med_name.replace(" ", "").toLowerCase();
      return med_name.includes(search_text);
    }
    var searchCards = data.filter((e) => checkMeds(e.medicine_name));
    if (searchCards.length == 0) {
      setResultStatus("No Medicine Found!");
    } else {
      setResultStatus("");
    }
    setMeds(searchCards);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: theme.bg }}
    >
      {/* Background Elements - Only dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div
            className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      )}

      {/* Header */}
      <Header showBackButton={true} backTo="/" />

      {/* Search and Info Bar */}
      <div 
        className="w-full px-4 md:px-6 py-3 relative z-10 border-b"
        style={{
          background: theme.cardBg,
          backdropFilter: isDark ? "blur(20px)" : "none",
          borderBottom: `1px solid ${theme.border}`,
          boxShadow: isDark ? "none" : "0 2px 10px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative max-w-md">
            <input
              type="text"
              className="w-full py-2.5 pl-4 pr-10 rounded-xl text-sm md:text-base transition-all duration-200 focus:outline-none focus:ring-2"
              placeholder="Search medicines..."
              value={searchText}
              onChange={(event) => handleSearchText(event.target.value)}
              style={{
                background: isDark ? "rgba(255, 255, 255, 0.1)" : "#f1f5f9",
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                focusRing: theme.textSecondary
              }}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none p-1 rounded"
              style={{ background: isDark ? "rgba(6, 182, 212, 0.2)" : "rgba(59, 130, 246, 0.1)" }}
            >
              <Search style={{ color: theme.textSecondary }} size={16} />
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
              <Package size={16} />
              <span className="hidden sm:inline">{meds.length} available</span>
            </div>

            {/* Cart Badge */}
            <div className="relative">
              <ShoppingCart style={{ color: theme.textSecondary }} size={22} />
              {cartItems.length > 0 && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
                  }}
                >
                  {cartItems.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 px-4 md:px-6 py-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {resultStatus && (
            <div className="text-center py-10">
              <Package 
                className="mx-auto mb-4" 
                size={64}
                style={{ color: isDark ? "#fca5a5" : "#ef4444" }}
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: theme.textPrimary }}
              >
                {resultStatus}
              </h2>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {meds.map((item) => (
              <div
                key={item.medicine_id}
                className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105"
                style={{
                  background: theme.cardBg,
                  backdropFilter: isDark ? "blur(20px)" : "none",
                  border: `1px solid ${theme.border}`,
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.08)"
                }}
              >
                <div 
                  className="aspect-square flex items-center justify-center p-4"
                  style={{ background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc" }}
                >
                  <img
                    src={`/med-images/image_${item.medicine_id}.jpg`}
                    alt={item.medicine_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%2306b6d4' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='white'%3E💊%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 
                    className="font-semibold text-base md:text-lg mb-2 line-clamp-2"
                    style={{ color: theme.textPrimary }}
                  >
                    {item.medicine_name}
                  </h3>

                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span style={{ color: theme.textSecondary }}>
                      Stock: {item.stock}
                    </span>
                    <span 
                      className="font-bold text-lg"
                      style={{ color: isDark ? "#10b981" : "#059669" }}
                    >
                      ₹{item.price}
                    </span>
                  </div>

                  <button
                    id={`add-to-cart-${item.medicine_id}`}
                    onClick={() => handleOpen(item)}
                    className="w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                    style={isDark ? {
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)",
                      backdropFilter: "blur(15px)",
                      border: "2px solid rgba(16, 185, 129, 0.4)",
                      color: "white",
                    } : {
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "2px solid #047857",
                      color: "white",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Cart Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 p-4"
        style={{
          background: isDark ? "rgba(15, 32, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: `2px solid ${isDark ? "rgba(6, 182, 212, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
          boxShadow: isDark ? "0 -4px 20px rgba(0, 0, 0, 0.3)" : "0 -4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Cart Items */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto">
            <ShoppingCart 
              className="flex-shrink-0" 
              size={24}
              style={{ color: theme.textSecondary }}
            />

            {cartItems.length === 0 ? (
              <span className="text-sm" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                Cart is empty
              </span>
            ) : (
              <div className="flex gap-2 overflow-x-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.medicine_id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{
                      background: isDark ? "rgba(6, 182, 212, 0.2)" : "#dbeafe",
                      border: isDark ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid #93c5fd",
                    }}
                  >
                    <Pill style={{ color: theme.textSecondary }} size={16} />
                    <span className="text-sm" style={{ color: theme.textPrimary }}>
                      {item.medicine_name} x{item.qty}
                    </span>
                    <button
                      onClick={() => {
                        handleRemove(item);
                        handleButtonChange(item.medicine_id);
                      }}
                      className="hover:opacity-70"
                      style={{ color: "#ef4444" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total and Pay Button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                Total Amount
              </div>
              <div 
                className="text-xl font-bold"
                style={{ color: isDark ? "#06b6d4" : "#1e40af" }}
              >
                ₹{totalPrice}
              </div>
            </div>

            <button
              onClick={handleRedirect}
              disabled={!(totalPrice > 0)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base
                transition-all duration-200
                ${
                  totalPrice > 0
                    ? "active:scale-95 hover:scale-105"
                    : "cursor-not-allowed opacity-50"
                }
              `}
              style={
                totalPrice > 0
                  ? (isDark ? {
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)",
                      backdropFilter: "blur(15px)",
                      border: "2px solid rgba(16, 185, 129, 0.4)",
                      color: "white",
                    } : {
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "2px solid #047857",
                      color: "white",
                    })
                  : {
                      background: isDark ? "rgba(100, 116, 139, 0.2)" : "#e2e8f0",
                      border: `2px solid ${isDark ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"}`,
                      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(100, 116, 139, 0.5)",
                    }
              }
            >
              <CreditCard size={20} />
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "400px",
            bgcolor: isDark ? "#1a2a35" : "#ffffff",
            border: `2px solid ${isDark ? "rgba(6, 182, 212, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
            boxShadow: isDark ? "0 0 40px rgba(6, 182, 212, 0.4)" : "0 8px 40px rgba(0, 0, 0, 0.2)",
            p: 4,
            borderRadius: "20px",
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 hover:opacity-70"
            style={{ color: theme.textPrimary }}
          >
            <X size={24} />
          </button>

          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: theme.textPrimary }}
          >
            {currentItem.medicine_name}
          </h2>

          <div className="mb-4">
            <label 
              className="text-sm mb-2 block"
              style={{ color: theme.textSecondary }}
            >
              Quantity
            </label>
            <NumberInput
              aria-label="Quantity Input"
              min={1}
              max={currentItem.stock}
              onChange={(event, newValue) => {
                setAmount(newValue * currentItem.price);
                setTempCount(newValue);
              }}
            />
          </div>

          <div className="mb-6">
            <label 
              className="text-sm mb-2 block"
              style={{ color: theme.textSecondary }}
            >
              Amount
            </label>
            <div
              className="text-3xl font-bold text-center py-3 rounded-xl"
              style={{
                background: isDark ? "rgba(6, 182, 212, 0.1)" : "#dbeafe",
                border: `2px solid ${isDark ? "rgba(6, 182, 212, 0.3)" : "#93c5fd"}`,
                color: isDark ? "#22d3ee" : "#1e40af",
              }}
            >
              ₹{amount}
            </div>
          </div>

          <button
            disabled={!(tempCount > 0)}
            onClick={() => {
              setTotalPrice(totalPrice + amount);
              handleCart(currentItem, tempCount);
              handleClose();
              handleButtonChange(currentItem.medicine_id);
            }}
            className={`
              w-full py-3 rounded-xl font-bold text-lg
              transition-all duration-200
              ${
                tempCount > 0
                  ? "active:scale-95 hover:scale-105"
                  : "cursor-not-allowed opacity-50"
              }
            `}
            style={
              tempCount > 0
                ? (isDark ? {
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "2px solid rgba(16, 185, 129, 0.4)",
                    color: "white",
                  } : {
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "2px solid #047857",
                    color: "white",
                  })
                : {
                    background: isDark ? "rgba(100, 116, 139, 0.2)" : "#e2e8f0",
                    border: `2px solid ${isDark ? "rgba(148, 163, 184, 0.3)" : "#cbd5e1"}`,
                    color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(100, 116, 139, 0.5)",
                  }
            }
          >
            Add to Cart
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export const checkStock = async () => {
  var medData;
  await axiosInstance.get(`/get_data/1`).then((res) => {
    medData = res.data;
  });
  return medData;
};

export { Counter };
