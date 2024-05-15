import { useLocation } from "react-router-dom";
import Slider from "./slider/slider";
import Markdown from 'react-markdown'
// import RangeSlider from "./slider/range_slider";
import './vital-report.css'
import { useEffect, useState } from "react";
const VitalReport = ()=>{
    const location = useLocation();
    const data = location.state;
    console.log(data)
    const tempF = (data.temp * 9)/5 + 32;
    const [sliderHValue, setHValue] = useState(0);
    const [sliderWValue, setWValue] = useState(0);
    const [bmiStatus, setBmiStatus] = useState("");
    const [bmi, setBmi] = useState(0);
    let BMI = parseFloat((sliderWValue/Math.pow((sliderHValue/100),2)).toFixed(1));
    let tempReport
    let heartReport
    let oxygenReport
    if (tempF >= 95 && tempF <= 99){
        tempReport = "Normal"
    }
    else if(tempF>= 99.1 && tempF <= 100.4 ){
        tempReport = "Low-grade Fever"
    }
    else if(tempF >= 100.5 && tempF <= 102.2){
        tempReport = "Moderate-grade Fever"
    }
    else if(tempF >= 102.4 && tempF <= 105.8){
        tempReport = "High-grade Fever"
    }
    else if  (tempF < 95){
        tempReport = "Low Temperature"
    }
    else {
        tempReport = "Temperature not clear"
    }

    if(data.heart >60 && data.heart < 100){
        heartReport = "Normal"
    }
    else if(data.heart <60){
        heartReport = "Slow Heart Rate"
    }
    else{
        heartReport = "Fast Heart Rate"
    }

    if(data.oxygen >= 95){
        oxygenReport = "Normal"
    }
    else{
        oxygenReport = "Low Oxygen Level"
    }

    const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    ];
    let date  =new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}))
    console.log()
    useEffect(()=>{
        if (BMI<= 18.4 && BMI > 0){
            setBmi(BMI)
            setBmiStatus("You're Underweight");
        }
    else if(BMI <= 24.9 && BMI >= 18.5){
        setBmi(BMI)
        setBmiStatus("You're Healthy");
    }
    else if(BMI >= 25.0 && BMI <= 39.9){
        setBmi(BMI)
        setBmiStatus("You're Overweight")
    }
    else if(BMI >= 40){
        setBmi(BMI)
        setBmiStatus("You're Obese")
    }
    
    else{
        setBmi(0)
        setBmiStatus("Measure BMI")
    }
    },[BMI])
        
    
    
return (

<div className="container-fluid px-5">
    <div className="grid-container">
        <div className="left-grid">
            <div className="heading">
                <h1 className="vital-heading">Vitals Overview</h1>
                <h4 className="date-heading">{date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</h4>
            </div>
            <div className="vital-cards">
                <div className="card-element">
                    <div className="upper-card-layer">

                    <img src="./body-temp.png" alt="" className="card-logo" />
                    <h1 className="card-heading">Body Temperature</h1>
                    </div>
                    <div className="middle-card-layer">

                    <h1 className="card-data">{tempF}</h1>
                    <h4 className="card-unit">°F</h4>
                    <h1 className="card-data">/ {data.temp}</h1>
                    <h4 className="card-unit">°C</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 className="result-tag">{tempReport}</h1>
                    </div>
                    <div className="bottom-layer">
                        <img src="./temp-graph.png" alt="" />
                    </div>
                
                </div>
                <div className="card-element">
                    <div className="upper-card-layer">

                    <img style={{backgroundColor: '#FBF0F3',padding:'2px'}} src="./body-heart.png" alt="" className="card-logo" />
                    <h1 className="card-heading">Heart Rate</h1>
                    </div>
                    <div className="middle-card-layer">

                    <h1 className="card-data">{data.heart}</h1>
                    <h4 className="card-unit">bpm</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 style={{backgroundColor: '#FBF0F3'}}className="result-tag">{heartReport}</h1>
                    </div>
                    <div className="bottom-layer">
                        <img src="./heart-graph.png" alt="" />
                    </div>
                
                </div>
                <div className="card-element">
                    <div className="upper-card-layer">

                    <img style={{backgroundColor:'#D0FBFF',padding: '2px'}}src="./body-oxygen.png" alt="" className="card-logo" />
                    <h1 className="card-heading">Oxygen Level</h1>
                    </div>
                    <div className="middle-card-layer">

                    <h1 className="card-data">{data.oxygen}</h1>
                    <h4 className="card-unit">%</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 style={{backgroundColor:'#D0FBFF'}} className="result-tag">{oxygenReport}</h1>
                    </div>
                    <div className="bottom-layer">
                        <img src="./oxygen-graph.png" alt="" />
                    </div>
                
                </div>
                
            </div>
            <div className="vital-report-container">
                    <Markdown>{data.report}</Markdown>
                </div>
        </div>
        <div className="right-grid">
            <div className="heading">
                    <h1 style={{color:'white',fontWeight:'500'}}className="vital-heading">BMI Calculator</h1>
                </div>
            <div className="middle-right">
                <div className="bmi-left-child">
                    <div className="bmi-h-w">
                        <div className="left">
                            <h1>Height</h1>
                        </div>
                        <div className="right">

                            <Slider setter = {setHValue} id= {0} maxUnit = {190}/>
                        </div>
                    </div>
                    <div className="bmi-h-w" style={{backgroundColor: '#D0FBFF'}}>
                    <div className="left">
                            <h1>Weight</h1>
                        </div>
                        <div className="right">
                        <Slider setter = {setWValue} id={1} maxUnit = {150}/>
                        </div>
                    </div>
                </div>
                

                <div className="bmi-right-child">
                    <div className="bmi-result">
                        <h1 className="bmi-heading">Body Mass Index (BMI)</h1>
                        <h1 className="bmi-result-value">
                            {bmi}
                        </h1>
                        <div className="bmi-health-tag">{bmiStatus}
                            </div>
                    </div>
                </div>
                
            </div>
            <div className="bmi-bottom">
                {/* <div className="bmi-bottom-left">
                    <h1 className="health-tips">Health Tips</h1>
                </div>
                <div className="bmi-bottom-right"> */}
                    <img src="./male-body.png" alt="" className="body-male" />
                {/* </div> */}
            </div>

        </div>
    </div>
    </div>
)
}
export default VitalReport;