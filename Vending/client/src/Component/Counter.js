import "./../App.css";
import "./counter.css"
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import NumberInput from './quantity.js'
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {load} from '@cashfreepayments/cashfree-js';

let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: "sandbox"
    });
};
initializeSDK();

const Counter = ()=>{
  const data = useLoaderData();
  const [totalPrice,setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [amount,setAmount] = useState(0);
  const [tempCount,setTempCount] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [meds,setMeds] = useState(data);
  const [resultStatus,setResultStatus] = useState("");
  const [loadingText, setLoadingText] = useState('');
  const handleSearchText = (value) => {
    setSearchText(value);
    if(value == ""){
      setMeds(data);
    }
    else{
      handleSearch(value)
    }
  }
  const handleOpen = (item) =>{
    setAmount(0)
    setCurrentItem(item)
    setOpen(true)};
  const handleClose = () => {setOpen(false)
    setCurrentItem([])
    setTempCount(0);
  };
  const handleCart = (item,quantity)=>{
    console.log(item.stock)
    var cart = {
      medicine_name : item.medicine_name,
      medicine_id : item.medicine_id,
      qty : quantity,
      amount : quantity*item.price,
      stock : item.stock
    }
    setCartItems(oldArray  => [...oldArray,cart]);
  }
  const handleRemove = (item)=>{
    let newCart = cartItems.filter(e => e.medicine_id!==item.medicine_id)
    setCartItems(newCart)
    setTotalPrice(totalPrice-item.amount)
  }
  const handleRedirect = async()=>{
    let medicines = [];
    cartItems.forEach(item => {
      let data = 
      {'isAvailable': true, 'data': {'medicine_id': item.medicine_id, 'medicine_name': item.medicine_name,
       'price': item.amount/item.qty, 'stock': item.stock}, 'qty': item.qty};
      medicines.push(data)
    });
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
  // const handlePay = async()=>{
  //   let medicines = [];
  //   cartItems.forEach(item => {
  //     let data = 
  //     {'isAvailable': true, 'data': {'medicine_id': item.medicine_id, 'medicine_name': item.medicine_name,
  //      'price': item.amount/item.qty, 'stock': item.stock}, 'qty': item.qty};
  //     medicines.push(data)
  //   });
  //   setLoading(true);
  //   setLoadingText("Dispensing Medicines");
  //   console.log("Sending data to server...");
  //   await axios.post(`http://127.0.0.1:5000/dispense`, medicines).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     setLoading(false);
  //     navigator("/thank");
  //   });
  // }
  const handleButtonChange = (id)=>{
    var addButton = document.getElementById(`add-to-cart-${id}`)
    if(addButton.textContent == 'Add to Cart'){
      addButton.textContent = 'Added'
      addButton.disabled = true;
  }
    else{
      addButton.textContent = 'Add to Cart';
      addButton.disabled = false;
    }
  }

  const handleSearch = (search_text)=>{
    search_text = search_text.replace(" ","");
    search_text = search_text.toLowerCase();
    function checkMeds(med_name) {
      med_name = med_name.replace(" ","").toLowerCase();
      return med_name.includes(search_text);
    }
      var searchCards = data.filter(e => checkMeds(e.medicine_name));
      if(searchCards.length == 0){
        setResultStatus("No Medicine Found!");
      }
      else{
        setResultStatus("");
      }
      setMeds(searchCards);
  }

  
  const navigator = useNavigate();
  
  // const isLoading = (navigator.state === "loading");
    return (isLoading ? (
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
    ):(
      <>
      <div style={{position:'relative',backgroundColor:"#b6b5b5",boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px', zIndex:'10'}}>
        
      <h1 id='jeevika' className="text-3xl font-bold p-2 text-center ">
      <img onClick={()=>navigator('/')} src="./backArrow.png" alt="" className="backArrow" />
        Jeevika
      </h1>
      <div style={{ display: "flex" ,paddingBottom:'5px'}}>
        <div style={{ flex: 1 }}>
          <img src="./searchIcon.png" alt="" className="search-icon" />
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            style={{ width: "30%",height: '30px',borderRadius:'20px',float:'right',marginRight: '-27px',display:'inline-block',marginBottom:'5px',padding:'6px',zIndex: '4' }}
            value={searchText}
            onChange={(event) => {
              
              handleSearchText(event.target.value);
              console.log(event.target.value)
              
            }}
          />
        </div>
        
      </div>
      </div>
      <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#e8e8e8",
        minHeight: '100vh'
      }}
    >
      
      <div className="container-fluid px-5">
      <ul className="cardList">
          {meds.map((item, index) => {
            return (
              <>
              <li className="card">
                <div className="card-body">
                  <img src="./../medicine.jpg" alt="" width={'270px'} className="med-image" />
                  <div className="card-bottom">
                  <h1 className="med-name">{item.medicine_name}</h1>
                  <h3 className="stock">Available : {item.stock}</h3>
                  <h3 className="price">Price : ₹{item.price}</h3>
                  <button id={`add-to-cart-${item.medicine_id}`} onClick= {()=>handleOpen(item)} className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add to Cart</button>
                  </div>
                </div>
              </li>
              
            </>
            );
            
          }
          )}
          </ul>
          <h1 className="result-status">{resultStatus}</h1>
          <div className="bottom-bar">
            
           

              <div className="bottom-bar-area-left">
                <img className="cart-item-icon" src="./cartIcon.png" width="40px" alt="" />
                <h1 className="cart-item-text">Medicine Cart: 
                </h1>
                <ul className="cart-item">
                {cartItems.map((item, index) => {
                  console.log(item)
                  return(
                    <>
                    <li className="medicine-tag">
                    <img id='med-icon'src="./medicineIcon.png" alt="" />
                    {item.medicine_name} x{item.qty}  
                    </li>
                    <img onClick={()=>{handleRemove(item)
                    handleButtonChange(item.medicine_id)
                    }} src="./tagCross.png"alt="" className="tag-cross" />
                    </>
                  )
                })}
                {(cartItems.length == 0) && 
                  <li className="cart-empty">
                  <img id='cart-empty-gif'src="./buyIcon.gif" alt="" />
                  Cart is Empty
                  </li>
                }
                  
                  </ul>
              </div>
              <div className="bottom-bar-area-right">
                <h1>Total Amount : ₹{totalPrice}</h1>
                <button onClick={handleRedirect}disabled={!(totalPrice>0)} id='pay' className={totalPrice>0?"block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600":"block w-full rounded-md bg-green-300 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm  focus-visible:outline "}>Proceed to pay</button>
                </div>
            
            
          </div>

        
      </div>
    </div>
    <Modal open={open} onClose={handleClose}>
              <Box sx={ {
            position: "absolute",
            // display: 'flex',
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "fit-content",
            height : 'fit-content',
            bgcolor: "background.paper",
            border: "2px solid #000",
            alignItems:"center",
        justifyContent:"center",
            boxShadow: 24,
            p: 4,
            borderRadius: "15px",
          }}>
              <h1 className="modal-text">Quantity:</h1>
              <NumberInput aria-label="Quantity Input" min={1} max={currentItem.stock} 
              
              onChange={(event, newValue) => {setAmount(newValue*currentItem.price)
                console.log(newValue)
              setTempCount(newValue);
              }}/>
              <h1 className="modal-text">Amount:</h1>
              <TextField
              sx={{input: {textAlign: "center"}}}
                disabled
               id="outlined-basic"
               defaultValue='0'
               value={`₹${amount}`}
              variant="outlined" />
          <button disabled = {!(tempCount>0)} onClick={()=>{
            setTotalPrice(totalPrice + amount);
            handleCart(currentItem,tempCount);
          handleClose();
            handleButtonChange(currentItem.medicine_id);
        }
            }id="done-button" class={(tempCount>0)?"mt-5 w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600":"mt-5 w-full rounded-md bg-indigo-300 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm  focus-visible:outline"} >Done</button>
                <img
                    src="./crossIcon.png"
                    alt=""
                    className="viewMore"
                    onClick={handleClose}
                  />
                
                
                  
              </Box>
            </Modal>
  
  </>
)
      
        
    )
}

export const  checkStock = async()=> {
  var medData;
  await axios.get(`http://127.0.0.1:5000/get_data/1`).then((res) => {
    medData = res.data;
  });
  return medData;
}
export {Counter};