// PrescriptionTemplate.js
import React from 'react';
import QRCode from "react-qr-code";
import './prescriptionTemplate.css'
import { useLocation } from "react-router-dom";
const PrescriptionTemplate = () => {
  const location = useLocation();
  const data = location.state;
  const qrValue = [];
  data.medicines.forEach((med)=>{
    const quant = med.dosageTime * med.duration * (med.period == 0)?1:30
    const qrData ={
      medicine_id : med.name.id,
      quantity : quant,
    } 
    qrValue.push(qrData);
  })
  const qrEncode = btoa(JSON.stringify(qrValue))
  return (
    
    <div className="container">
      <div className="header">
        <div className="left">
          <p><strong>{data.doctorName}</strong></p>
          <p>{data.doctorQualification}</p>
          <p>Reg. No: {data.regNo}</p>
        </div>
        <div className="right">
          <h1>{data.hospitalName}</h1>
          <p>{data.hospitalAddress}</p>
          <p>Ph: {data.hospitalPhone}, Timing: {data.hospitalTiming} | Closed: Sunday</p>
        </div>
      </div>
      <hr />
      <div className="info">
        <p><strong>ID: {data.patientId} - {data.patientName} ({data.patientGender}) / {data.patientAge} Y</strong> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mob. No.: {data.patientMobile}</strong></p>
        <p><strong>Date:</strong> {data.date}</p>
      </div>
      <div className="section">
        <table>
          <tr>
            <th>Chief Complaints</th>
            <th>Clinical Findings</th>
          </tr>
          <tr>
            <td>{data.chiefComplaints}</td>
            <td>{data.clinicalFindings}</td>
          </tr>
        </table>
      </div>
      <div className="section">
        <p><strong>Diagnosis:</strong></p>
        <p>{data.diagnosis}</p>
      </div>
      <div className="section">
        <p><strong>R</strong></p>
        <table>
          <tr>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Duration</th>
          </tr>
          {data.medicines.map((medicine, index) => (
            <tr key={index}>
              <td>{medicine.name.label}</td>
              <td>{medicine.dosage}</td>
              <td>{medicine.duration} {medicine.period?' days':' month'}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="advice">
        <p><strong>Advice:</strong></p>
        <p>{data.advice}</p>
      </div>
      <div className="section">
        <p><strong>Follow Up:</strong> {data.followUp}</p>
      </div>
      <div className="footer">
        <p><strong>Scan QR Code:</strong> </p>
        <QRCode 
        className='qrcode'
    value={qrEncode}
  />
      </div>
    </div>
    
    
  );
};

export default PrescriptionTemplate;