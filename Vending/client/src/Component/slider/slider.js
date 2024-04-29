import React, { useEffect, useRef,useState } from "react";
import "./slider.css";

const Slider = ({setter,id,maxUnit}) => {
  const sliderWrapper = useRef();
  const sliderSvg = useRef();
  const sliderPath = useRef();
  const sliderPathLength = useRef();
  const sliderThumb = useRef();
  const sliderInput = useRef();
  const sliderMinValue = useRef(0);
  const sliderMaxValue = useRef(100);
  // const [sliderValue, setValue] = useState(0);
  const time = useRef();
  const setValue = setter;
  const Id = id;
  let quantity;
  if (Id == 0){
    quantity = 'Cm';
  }else{
    quantity = 'Kg'
  }
  const updateTime = (timeInMinutes) => {
    const formattedHours = String(timeInMinutes);
    time.current.textContent = `${formattedHours} ${quantity}`;
  };

  const setColor = (progress) => {
    const colorStops = [
      { r: 243, g: 217, b: 112 }, // #F3D970
      { r: 252, g: 187, b: 93 }, // #FCBB5D
      { r: 246, g: 135, b: 109 }, // #F6876D
      { r: 147, g: 66, b: 132 }, // #934284
      { r: 64, g: 40, b: 98 }, // #402862
      { r: 1, g: 21, b: 73 } // #011549
    ];
    const numStops = colorStops.length;

    const index = (numStops - 1) * progress;
    const startIndex = Math.floor(index);
    const endIndex = Math.ceil(index);

    const startColor = colorStops[startIndex];
    const endColor = colorStops[endIndex];

    const percentage = index - startIndex;

    const [r, g, b] = [
      Math.round(startColor.r + (endColor.r - startColor.r) * percentage),
      Math.round(startColor.g + (endColor.g - startColor.g) * percentage),
      Math.round(startColor.b + (endColor.b - startColor.b) * percentage)
    ];

    sliderThumb.current.style.setProperty("--color", `rgb(${r} ${g} ${b})`);
  };

  // updating position could be done with CSS Motion Path instead of absolute positioning but Safari <15.4 doesn’t seem to support it
  const updatePosition = (progress) => {
    const point = sliderPath.current.getPointAtLength(progress * sliderPathLength.current);
    const svgRect = sliderSvg.current.getBoundingClientRect();
    const scaleX = svgRect.width / sliderSvg.current.viewBox.baseVal.width;
    const scaleY = svgRect.height / sliderSvg.current.viewBox.baseVal.height;
    sliderThumb.current.style.left = `${(point.x * scaleX * 100) / svgRect.width}%`;
    sliderThumb.current.style.top = `${(point.y * scaleY * 100) / svgRect.height}%`;
    const value = Math.round(progress * (sliderMaxValue.current - sliderMinValue.current));
    sliderInput.current.value = value;
    updateTime(value);
    setValue(value);
    setColor(progress);
  };

  useEffect(() => {
    sliderPathLength.current = sliderPath.current.getTotalLength();
    sliderMinValue.current = +sliderInput.current.min || 0;
    sliderMaxValue.current = +sliderInput.current.max || 100;
    time.current = document.querySelector(`#slider-value-${Id}`);
    updatePosition(sliderInput.current.valueAsNumber / (sliderMaxValue.current - sliderMinValue.current));
   
  }, []);

  useEffect(() => {
    sliderInput.current.addEventListener("input", () => {
      const progress =
        sliderInput.current.valueAsNumber / (sliderMaxValue.current - sliderMinValue.current);
      updatePosition(progress);
console.log(progress)
    });

    const handlePointerMove = (event) => {
      const sliderWidth = sliderPath.current.getBoundingClientRect().width;
      const pointerX = event.clientX - sliderPath.current.getBoundingClientRect().left;
      const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
      updatePosition(progress);
    };

    const handlePointerDown = (event) => {
      const sliderWidth = sliderPath.current.getBoundingClientRect().width;
      const pointerX = event.clientX - sliderPath.current.getBoundingClientRect().left;
      const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
      const isThumb = event.target.classList.contains("slider-thumb");
      if (!isThumb) updatePosition(progress);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", () => {
        window.removeEventListener("pointermove", handlePointerMove);
      });
    };

    sliderThumb.current.addEventListener("pointerdown", handlePointerDown);
    sliderPath.current.addEventListener("pointerdown", handlePointerDown);

    sliderWrapper.current.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
  }, []);

  return (
    <div ref={sliderWrapper} className="slider-wrapper">
      <input ref={sliderInput} className="slider-input" type="range" value="0" max={maxUnit} step="1"/>
      <div ref={sliderThumb} className="slider-thumb">
        <div className="slider-value-container">
          <p id={`slider-value-${Id}`} className="slider-value-">0 {quantity}</p>
        </div>
      </div>
      <svg ref={sliderSvg} className="slider-svg" viewBox="0 0 238 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path ref={sliderPath} className="slider-svg-path" d="M2 34L7.21879 31.0968C78.5901 -8.60616 165.659 -7.50128 236 34V34" stroke="url(#paint0_linear_339_100980)" stroke-width=".25em" stroke-linecap="round" vector-effect="non-scaling-stroke" filter="url(#filter0_i_339_100980)"/>
        <defs>
          <filter id="filter0_i_339_100980" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_339_100980"/>
          </filter>
          <linearGradient id="paint0_linear_339_100980" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F3D970"/>
            <stop offset="0.2" stop-color="#FCBB5D"/>
            <stop offset="0.4" stop-color="#F6876D"/>
            <stop offset="0.6" stop-color="#934284"/>
            <stop offset="0.8" stop-color="#402862"/>
            <stop offset="1" stop-color="#011549"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Slider;