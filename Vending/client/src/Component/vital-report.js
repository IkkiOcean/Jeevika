import { useLocation } from "react-router-dom";
import Slider from "./slider/slider";
// import RangeSlider from "./slider/range_slider";
import './vital-report.css'
import { useEffect, useState } from "react";
const VitalReport = ()=>{
    // const location = useLocation();
    // const data = location.state;
    // console.log(data.temp.temp)
    const [sliderHValue, setHValue] = useState(0);
    const [sliderWValue, setWValue] = useState(0);
    const [bmiStatus, setBmiStatus] = useState("hello");
    const BMI = parseFloat((sliderWValue/Math.pow((sliderHValue/100),2)).toFixed(1));
    
    useEffect(()=>{
        if (BMI<= 18.4 && BMI > 0)
        setBmiStatus("You're Underweight");
    else if(BMI <= 24.9 && BMI >= 18.5)
    setBmiStatus("You're Healthy");
    else if(BMI >= 25.0 && BMI <= 39.9)
    setBmiStatus("You're Overweight")
    else if(BMI >= 40)
    setBmiStatus("You're Obese")
    else
        setBmiStatus("Measure BMI")
    },[BMI])
        
    
    
return (

<div className="container-fluid px-5">{console.log("h" + sliderHValue)}
{console.log("w" + sliderWValue)}
    <div className="grid-container">
        <div className="left-grid">
            <div className="heading">
                <h1 className="vital-heading">Vitals Overview</h1>
                <h4 className="date-heading">12 August 2024</h4>
            </div>
            <div className="vital-cards">
                <div className="card-element">
                    <div className="upper-card-layer">

                    <img src="./body-temp.png" alt="" className="card-logo" />
                    <h1 className="card-heading">Body Temperature</h1>
                    </div>
                    <div className="middle-card-layer">

                    <h1 className="card-data">104</h1>
                    <h4 className="card-unit">°F</h4>
                    <h1 className="card-data">/ 32</h1>
                    <h4 className="card-unit">°C</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 className="result-tag">Normal</h1>
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

                    <h1 className="card-data">98</h1>
                    <h4 className="card-unit">bpm</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 style={{backgroundColor: '#FBF0F3'}}className="result-tag">Normal</h1>
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

                    <h1 className="card-data">93</h1>
                    <h4 className="card-unit">%</h4>
                    </div>
                    <div className="tag-layer">
                        <h1 style={{backgroundColor:'#D0FBFF'}} className="result-tag">Normal</h1>
                    </div>
                    <div className="bottom-layer">
                        <img src="./oxygen-graph.png" alt="" />
                    </div>
                
                </div>
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
                            {BMI}
                        </h1>
                        <div className="bmi-health-tag">{bmiStatus}
                            </div>
                        {/* <RangeSlider/> */}
                    </div>
                </div>
            </div>

        </div>
    </div>
    </div>
)
}
export default VitalReport;