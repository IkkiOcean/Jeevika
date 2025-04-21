import './doctor.css'
// import axios from "axios";
import React, { useState } from "react";

const DoctorPage = ()=>{
    const [searchText, setSearchText] = useState("");
    const handleSearchText = (value) => {
        setSearchText(value);
        // if(value == ""){
        //   setMeds(data);
        // }
        // else{
        //   handleSearch(value)
        // }
      }
    return(
        <div className="container-prescription">
            <div className="upperlayer">
            
        <div style={{ flex: 1 }} className='search-bar'>
          
          <input
            type="text"
            className="search-box"
            placeholder="Find Patient"
            
            onChange={(event) => {
              
              handleSearchText(event.target.value);
              console.log(event.target.value)
              
            }}
          />
          <img src="./searchIcon.png" alt="" className="search-icon" />
        </div>
        
            </div>
            <div className="bottomlayer">
                <div className="bottomleft">
                    
                    <h1 style={{display : 'inline-block', fontFamily: 'Poppins:ital',fontWeight: '400',marginLeft:'45px'}}>Good Morning &nbsp; </h1>
                    <h1 style={{display : 'inline-block', color:'#088187'}}>Dr. Shrivastav!</h1>
                    <div className="patient-stats">
                        <div className="patient-stats-left">
                            <h1 className="heading1" style={{paddingLeft:"20px",fontSize:'25px',fontWeight:'500'}}>Visits for Today</h1>
                            <h1 className="visits-count" style={{paddingLeft:"20px",fontSize:'40px'}}>104</h1>
                            <div className="visit-stats">
                                <div className="left-stats"></div>
                                <div className="right-stats"></div>
                            </div>
                        </div>
                        <div className="image-stats">
                            {/* <img src="/doctor-image.png" alt="" width={300} style={{transform: 'scaleX(-1)'}} /> */}
                        </div>
                    </div>
                    <div className="patient-list-container">
                        <div className="patient-list-container-left">
                        <h1 className='patient-list-heading'>Patient List</h1>
                        <div className="patient-list"></div>
                        </div>
                        
                        <div className="patient-list-container-right">
                            <h1 className='patient-list-heading'>Patient detail</h1>
                            <div className="patient-detail"></div>
                        </div>
                    </div>
                </div>
                <div className="bottomright">
                    <div className="calender">
                    <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&showNav=0&showTitle=0&showPrint=0&showCalendars=0&src=ZTAyNTBlNGQ1YWY5YTNjNmYxNTg0NGIyZjYwNmZiNDQzNjk4ZmRkY2JjYzQyOTM5YjdiOGNiYzViYjVlYmViMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%238E24AA&color=%230B8043" style={{borderWidth :"0", width:"90%", height:"300px",margin:"5% 5% 5% 5%",borderRadius:"15px", frameborder:"0", scrolling:"no"}}></iframe>
                    {/* <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&src=aWtraS5kZWJ1Z0BnbWFpbC5jb20&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZTAyNTBlNGQ1YWY5YTNjNmYxNTg0NGIyZjYwNmZiNDQzNjk4ZmRkY2JjYzQyOTM5YjdiOGNiYzViYjVlYmViMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%2333B679&color=%238E24AA&color=%230B8043" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorPage;