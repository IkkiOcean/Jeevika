import React, { useEffect, useRef } from "react";
import "./rangeslider.css";
import './range_slider.css'
import $ from "jquery";
import _ from "lodash";

const RangeSlider = () => {
  const $element = useRef();
  var currentState;
  var $handle;
  const sliderStates = [
    {name: "low", range: _.range(5, 26) },
    {name: "med",range: _.range(26, 51)},
    {name: "high",range: [51] },
  ];
  useEffect(() => {
    $element.current.rangeslider({
      polyfill: false,
      onInit: function() {
        $handle = $('.rangeslider__handle', this.$range);
        updateHandle($handle[0], this.value);
        updateState($handle[0], this.value);
      }
    })
  .on('input', function() {
      updateHandle($handle[0], this.value);
      checkState($handle[0], this.value);
    });
  }, []);

  // Update the value inside the slider handle
  const updateHandle = (el, val) => {
    el.textContent = val;
  }

  // Check if the slider state has changed
  const checkState = (el, val) => {
    // if the value does not fall in the range of the current state, update that shit.
    if (!_.contains(currentState.range, parseInt(val))) {
      updateState(el, val);
    }
  }

  // Change the state of the slider
  const updateState = (el, val) => {
    for (var j = 0; j < sliderStates.length; j++){
      if (_.contains(sliderStates[j].range, parseInt(val))) {
        currentState = sliderStates[j];
        // updateSlider();
      }
    }
    // If the state is high, update the handle count to read 50+
    if (currentState.name == "high") {
      updateHandle($handle[0], "50+");
    }
    // Update handle color
    $handle
    .removeClass (function (index, css) {
      return (css.match (/(^|\s)js-\S+/g) ||   []).join(' ');
    })
    .addClass("js-" + currentState.name);
  }

  return (
    <div className="main">
      <input
          type="range"
          name="participants"
          min="5"
          max="51"
          value="20"
          ref={$element}
      />
      
    </div>
  );
};

export default RangeSlider;