import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Home() {
  let navigate = useNavigate();
  return (
    <div className="body">
      <div className="overlay" />
      <h1 className="text-5xl font-bold text-center mt-3 uppercase up underline">Jeevika</h1>
      <div className="grid">
        <div>
          <button style={{backgroundColor: '#0acfab', opacity: '0.7'}}
            onClick={() => {
              navigate("/scan");
            }}
          >
            Scan your Prescription
          </button>
          <button style={{backgroundColor: '#cc67eb', opacity: '0.7'}} onClick={()=>{
            navigate('/vital')
          }}>
            Scan Vitals
          </button>
        </div>
        <div>
          <button  style={{backgroundColor: '#f24b80', opacity: '0.7'}} 
          onClick={() => {
              navigate("/counter");
            }}>
            Get over the counter medicine
          </button>
          <button style={{backgroundColor: '#e8d066', opacity: '0.7'}}disabled>
            Get Medicine Recommendation
            <br />
            <span className="construction">Under Construction</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
