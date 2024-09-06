import "./../App.css";
import { QrReader } from "react-qr-reader";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import pgPromise from 'pg-promise';
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
  let totalPrice = 0;
  const navigator = useNavigate();
  console.log("start");
  

  // useEffect(()=>{
  //   checkStock(1);
  // },[data])
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
  // [{"id": 1, "medicine_id": 999, "medicine_name": "paracetamol", "quantity": 3}, {"id": 2, "medicine_id": 998, "medicine_name": "cplox", "quantity": 6}]

  async function loadData(result, error) {
    if (!!result) {
      setLoading(true);
      var dd = JSON.parse(atob(result?.text));
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
    if (!!error) {
      console.info(error);
    }
  }

  const totalPriceofdata = ()=>{
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
  const handleRedirect = async()=>{
    
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
      console.log(res);
      console.log(res.data);
      sessionID = res.data.payment_session_id;
      orderID = res.data.order_id;
    });

    let checkoutOptions = {
      paymentSessionId: sessionID,
      returnUrl: 'http://localhost:3000/dispense-med?id={order_id}',
      appearance: {
          width: "425px",
          height: "700px",
      },
  };
  cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        // This will be true when there is any error during the payment
        console.log("There is some payment error, Check for Payment Status");
        console.log(result.error);
      }
      if (result.redirect) {
        // This will be true when the payment redirection page couldnt be opened in the same window
        // This is an exceptional case only when the page is opened inside an inAppBrowser
        // In this case the customer will be redirected to return url once payment is completed
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        // This will be called whenever the payment is completed irrespective of transaction status
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails.paymentMessage);
      }
 });
  }
  return isLoading ? (
    <div className="w-full flex justify-center flex-col items-center" style={{height:"100vh"}}>
      <div role="status">
        <svg
          aria-hidden="true"
          class="w-32 h-32 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
      <h3 className="text-3xl">{loadingText}</h3>
    </div>
  ) : isScanned == true && medicines.length > 0 ? (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <h1 className="text-3xl font-bold p-5 text-center">Jeevika</h1>
      <div className="container-fluid px-5">
        <ul role="list" className="divide-y divide-gray-100">
          {medicines.map((item, index) => {
            return (
              <li className="flex justify-between gap-x-6 py-5 p-2 w-full">
                <div className="flex justify-between w-full">
                  <div className="min-w-0 flex-auto ">
                    <p className={item.isAvailable ? 'text-sm font-semibold leading-6 text-gray-900' : 'text-sm font-semibold leading-6 text-red-500'}>
                      {item.data.medicine_name}
                    </p>
                    <p className={item.isAvailable ? 'mt-1 truncate text-xs leading-5 text-gray-500':'mt-1 truncate text-xs leading-5 text-red-400'}>
                      Price : ₹{item.data.price}
                    </p>
                  </div>

                  <div className={item.isAvailable ? 'text-sm font-semibold leading-6 text-gray-900' : 'text-sm font-semibold leading-6 text-red-500'}>{item.isAvailable == false ? "Out of stock" :`x ${item.qty}`}</div>
                </div>
              </li>
            );
          })}
          <li className="flex justify-between gap-x-6 py-5 p-2 w-full">

          <p className="text-m font-semibold leading-6 text-gray-900">Total Pricing : ₹{totalPriceofdata()}</p>
          </li>
        </ul>


        <button
          className={totalPrice>0?"mt-10 mb-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600":"mt-10 mb-10 block w-full rounded-md bg-indigo-300 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm  focus-visible:outline "}
          onClick={handleRedirect}
          disabled = {!(totalPrice>0)}
        >
          Proceed to Pay
        </button>
        <button
          className="mt-10 mb-10 block w-full rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={()=>{
            navigator('/')
          }}
        >
          Cancel{" "}
        </button>
      </div>
    </div>
  ) : (
    <div className="body">
      <div className="overlay" />
      <h1 className="text-5xl font-bold text-center mt-3 mb-20 up">Scan QR Code</h1>
      <div className="scanner">
        <QrReader
          constraints={{
            facingMode: "environment",
          }}
          className="shadow-lg"
          videoStyle={{
            height: "400px",
            width: "400px",
            border: "5px solid skyblue",
            borderRadius: 10,
            objectFit: "cover",
          }}
          onResult={async (result, error) => {
            loadData(result, error);
          }}
          style={{ width: "100%" }}
        />
      </div>
      {/* <p>{data}</p> */}
    </div>
  );
}

export default Scanner;
