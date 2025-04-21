// PrescriptionTemplate.js
import React, { useEffect, useState } from 'react';
// import QRCode from "react-qr-code";
import { QRCodeCanvas } from 'qrcode.react';
import './prescriptionTemplate.css'
import { useLocation } from "react-router-dom";
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import axios from 'axios';
const PrescriptionTemplate = () => {
  // const generatePdf = async() => {
  //   const pdfContent = document.getElementById('prescriptionTemplate');
    
  //   const file = await html2canvas(pdfContent, {
  //     useCORS: true,
  //     scale: 2, // adjust the scale to improve image quality
  //   }).then(canvas => {
  //     const doc = new jsPDF('p', 'pt', 'a4');
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = doc.internal.pageSize.getHeight();
  //     const canvasWidth = canvas.width;
  //     const canvasHeight = canvas.height;
  //     const scaleFactor = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
  //     doc.addImage(canvas, 'JPEG', 0, 0, canvasWidth * scaleFactor, canvasHeight * scaleFactor);
  //     const pdfBlob = doc.output('blob');
      
  //     // saveAs(pdfBlob, `prescription-${data.patientId}-${data.date}.pdf`);
      
  //     return pdfBlob
  //   });
  //   return file
  // };
    const generatePdf=async()=>{
      const input = document.getElementById('prescriptionTemplate');
     const pdfImage= await html2canvas(input)
  .then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    return imgData.split(';base64,')[1];
  })
  return pdfImage
;
    }
  const location = useLocation();
  const data = location.state;
  const qrValue = [];
  // prescription-${data.patientId}-${data.date}.pdf
  useEffect(() => {
    const generatePdfAndUpload = async () => {
      const pdfImage = await generatePdf();
      console.log(data.patientId)
      const dat = {
        "img" : pdfImage,
        "patientId": data.patientId,
        "date": data.date,
        "name" : data.patientName,
        "mobile" : data.patientMobile
      };
      try {
        const response = await axios.post(`http://127.0.0.1:5000/upload_pdf`, dat
        );
        console.log(response.status);
      } catch (error) {
        console.error(error);
        alert("Network error. Please try again later.");
      }
    };
    generatePdfAndUpload();
}, [data]);
    data.medicines.forEach((med)=>{
    let period;
    if(med.period === 'day')
      period = 1;
    else if(med.period === 'week')
      period = 7;
    else
      period = 30;
    

    const quant = med.dosageTime * med.duration * period
    const qrData ={
      medicine_id : med.name.id,
      quantity : quant,
    } 
    qrValue.push(qrData);
  })
  const qrEncode = btoa(JSON.stringify(qrValue))


  return (
    
    <div className="container" id='prescriptionTemplate'>
      <div className="header">
        <div className="left">
          <p><strong>Dr. {data.doctorName}</strong></p>
          <p>{data.doctorQualification}</p>
          <h4>Reg. No: {data.regNo}</h4>
        </div>
        <div className="right" style={{marginRight: '5px'}}>
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
            <td><pre>{data.chiefComplaints}</pre></td>
            <td><pre>{data.clinicalFindings}</pre></td>
          </tr>
        </table>
      </div>
      <div className="section">
        <p><strong>Diagnosis:</strong></p>
        <p><pre>{data.diagnosis}</pre></p>
      </div>
      <div className="section">
        <p><strong>℞</strong></p>
        <table>
          <tr>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Duration</th>
          </tr>
          {data.medicines.map((medicine, index) => (
            <tr key={index}>
              <td><pre>{medicine.name.label}</pre></td>
              <td><pre>{medicine.dosage}</pre></td>
              <td>{medicine.duration} {medicine.period}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="advice">
        <p><strong>Advice:</strong></p>
        <p><pre>{data.advice}</pre></p>
      </div>
      <div className="section">
        <p><strong>Follow Up:</strong> {data.followUp}</p>
      </div>
      <div className="footer">
        <p><strong>Scan QR Code:</strong> </p>
        <QRCodeCanvas
        className='qrcode'
    value={qrEncode}
  />
      </div>
      
    </div>
    
    
  );
};

export  {PrescriptionTemplate};