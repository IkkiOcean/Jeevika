import "./prescription.css";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import PatientForm from "../component/PatientForm";
import PrescriptionForm from "../component/PrescriptionForm";
import { useLoaderData } from "react-router-dom";
const Prescription = () => {
  const data = useLoaderData();
  const [patient, setPatient] =useState(1);
  const [toggleAddPatient, setAddPatient] = useState(false)
  const medicineList = data.medData;
  const [patientList, setPatientList] = useState(data.patData);
  console.log(patientList)
  const [searchText, setSearchText] = useState("");
  const [toggleNew, setToggleNew] = useState(false);
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleSearchText = (value) => {
    setSearchText(value);
    // if(value == ""){
    //   setMeds(data);
    // }
    // else{
    //   handleSearch(value)
    // }
  };
  const handleAddPatient = () => {
    setAddPatient(true)
  };
  return (
    <div className="container-body">
      <div className="patient-list-1">
        <div className="patient-inner">
          {!toggleAddPatient?(
            <button className="add-patient" onClick={handleAddPatient}>
            <h1>New Patient</h1>
            <img src="/add-patient.png" alt="" />
          </button>

          ):
          <></>}
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
          {patientList.map((patient, index) => (
            <div key= {index} className="patient-card" onClick={()=>{
              setAddPatient(false)
              setPatient(patient.id)
            }}>
              <div className="patient-profile">
                <img src="/patient-icon.png" alt="" />
              </div>
              <div className="patient-info">
                <h1 className="patient-name">{patient.name}</h1>

                <h1 className="patient-number">{patient.mobile}</h1>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      <div className="prescription-area">
      {toggleAddPatient?(
          <PatientForm setToggleNew={setToggleNew}
          setAddPatient={setAddPatient} setPatient={setPatient} patientList={patientList} setPatientList={setPatientList}/>)
          :
        (  
        <div className="toggle-div">

        <div className="centre-div pres-top">
          <div className="prescription-top">
            <img src="\patient-icon.png" alt="" />
            <h1>{patientList[patient-1].name}</h1>
            {!toggleNew && (
              <button
              className="add-new"
              onClick={() => {
                setToggleNew(!toggleNew);
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
                  <h2 className="heading-value">{dayjs(patientList[patient-1].dob).format('DD/MM/YYYY')}</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Age</h2>
                  <h2 className="heading-value">{calculateAge(patientList[patient-1].dob)}</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Sex</h2>
                  <h2 className="heading-value">{patientList[patient-1].sex ? 'Female' : 'Male'}</h2>
                </div>
                <div className={`heading-element transform ${toggleNew ? 'heading-new' : ''}`}>
                  <h2 className="heading-text">Phone No.</h2>
                  <h2 className="heading-value">{patientList[patient-1].mobile}</h2>
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
                <PrescriptionForm patientInfo={patientList[patient-1]} medicineList={medicineList}></PrescriptionForm>
              )}
            </div>
          </div>
        </div>
        )}
        
      </div>
    </div>
  );
};
export {Prescription};

export const loadPriscription = async()=> {
  var medData;
  var patData;
  await axios.get(`http://127.0.0.1:5000/fetch_medicine_name`).then((res) => {
    medData = res.data;
  });
  await axios.get(`http://127.0.0.1:5000/fetch_patientlist`).then((res) => {
    patData = res.data;
  });
  var Data = {
    medData : medData,
    patData : patData
  }

  return Data;
}