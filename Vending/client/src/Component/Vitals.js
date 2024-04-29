import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './vitals.css'
import axios from 'axios'
const Vital = ()=>{
    const [isLoading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [vitalData, setVital] = useState([]);
    let navigator = useNavigate();
    async function handleVitals(){
      document.getElementById('scan-btn').textContent = 'Scanning'
      await axios.get(`http://127.0.0.1:5000/vitals`).then((res) => {
      
      // console.log(res);
      // console.log(res.data);
      setVital(res.data);
      navigator('/vital-report',{
        state: {
          temp : res.data
        }
      })
    });
    }
    return(
        isLoading ? (
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
            <img onClick={()=>navigator('/')}src="./backArrow.png" alt="" className="backArrow" />
              Jeevika
            </h1>
            </div>
            <div className="scan-animation">
                <img src="./hand-animation.gif" alt=""/>
            </div>
            <div className="scan-button">
                <button onClick={handleVitals} id="scan-btn" className="block m-auto rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Start Vital Scan
                </button>
            </div>
            <div>{vitalData}</div>
            </>
    ))

}

export default Vital;