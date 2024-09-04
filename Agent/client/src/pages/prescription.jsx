import "./prescription.css";
// import axios from "axios";
import React, { useState } from "react";
import PatientForm from "../component/PatientForm";
import PrescriptionForm from "../component/PrescriptionForm";
const Prescription = () => {
  const [searchText, setSearchText] = useState("");
  const [toggleNew, setToggleNew] = useState(false);
  const handleSearchText = (value) => {
    setSearchText(value);
    // if(value == ""){
    //   setMeds(data);
    // }
    // else{
    //   handleSearch(value)
    // }
  };
  const handleNew = () => {
    
  };
  return (
    <div className="container-body">
      <div className="patient-list-1">
        <div className="patient-inner">
          <div className="add-patient">
            <h1>New Patient</h1>
            <img src="/add-patient.png" alt="" />
          </div>

          <div className="patient-list-header">
            <h1>Patients</h1>
            <input
              type="text"
              className="search-box"
              placeholder="Find Patient"
              onChange={(event) => {
                handleSearchText(event.target.value);
                console.log(event.target.value);
              }}
            />
            <img src="./searchIcon.png" alt="" className="search-icon" />
          </div>

          <div className="patient-list-bottom">
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Soumya Shrivastava</h1>

                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Ritik Pandey</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
            <div className="patient-card">
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">Abhishek</h1>
                <h1 className="patient-number">9999998888</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="prescription-area">
        <div className="centre-div pres-top">
          <div className="prescription-top">
            <img src="\patient-icon.png" alt="" />
            <h1>Vivek Prakash</h1>
            {!toggleNew && (
              <button
              className="add-new"
              onClick={() => {
                setToggleNew(!toggleNew);
                handleNew();
              }}
            >
              <img src="/add-prescription.png" alt="" />
              <h3>Add New</h3>
            </button>
            )}
          </div>
        </div>

          <div className="prescription-bottom">
            <div className="centre-div">
              <div className="general-info">
                <h2 className="gi-heading">General Information</h2>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Date of birth</h2>
                  <h2 className="heading-value">March 9,1990</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Age</h2>
                  <h2 className="heading-value">30 year old</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Sex</h2>
                  <h2 className="heading-value">Male</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Phone No.</h2>
                  <h2 className="heading-value">9116532218</h2>
                </div>
              </div>
              
            </div>
            <div className="centre-div">
            {!toggleNew ? (
              <div className="prev-pres">
                <h2 className="gi-heading">Previous Prescriptions</h2>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Medication</h2>
                  <h2 className="heading-value">April 10,2024</h2>
                  <div className="medication-list"></div>
                </div>
              </div>
              ) : (
                <PrescriptionForm></PrescriptionForm>
              )}
            </div>
          </div>
        
      </div>
    </div>
  );
};
export default Prescription;
