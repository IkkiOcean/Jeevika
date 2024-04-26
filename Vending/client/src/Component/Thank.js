import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Thank() {
let navigator = useNavigate();
useEffect(()=>{
    setTimeout(()=>{
        navigator("/");
    },5000);
},[])
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>
        <img src='./success.png' height={200} width={200} />
        <h1 className='text-6xl font-bold mt-5'>Thank You</h1>
        <br /><br /><br />
        <h1 className='text-3xl font-bold mt-5'>You will receive your bill on SMS
        </h1><img src="./message.gif" height={60} width={60} />
    </div>
  )
}

export default Thank