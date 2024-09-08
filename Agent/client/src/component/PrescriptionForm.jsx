import { useState, useEffect, useRef } from "react";
import "../pages/prescription.css";
import "./prescriptionForm.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import PSPDFKit from "pspdfkit";
import html2canvas from "html2canvas";
import ReactDOMServer from 'react-dom/server';
import axios from "axios";
import { TextareaAutosize } from "@mui/material";
import { TextField, Autocomplete } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PrescriptionTemplate } from "./PrescriptionTemplate";
const PrescriptionForm = ({ patientInfo, medicineList }) => {
  const [nextDate, setNextDate] = useState(null);
  var medList = [];
  medicineList.forEach((item) => {
    var med = { label: item.name, id: item.id };
    medList.push(med);
  });
  const [rows, setRows] = useState([
    {
      medicineName: "",
      dosage: "",
      duration: 0,
      period: '',
    },
  ]); // Initialize an empty array of rows
  const navigate = useNavigate();
  const [patientAdvice, setAdvice] = useState("");
  const [patientDiagnosis, setDiagnosis] = useState("");
  const [complaint, setComplaint] = useState("");
  const [findings, setFindings] = useState("");
  const [data, setData] = useState({
    doctorName: "",
    doctorQualification: "",
    regNo: "",
    hospitalName: "",
    hospitalAddress: "",
    hospitalPhone: "",
    patientId: "",
    patientName: "",
    patientGender: "",
    patientAge: "",
    patientMobile: "",
    date: "",
    chiefComplaints: "",
    clinicalFindings: "",
    diagnosis: "",
    medicines: [],
    advice: "",
    followUp: "",
  });
  useEffect(() => {
    if(data.doctorName !== ""){
      const url = "/pdf";
      navigate(url, {
        state: data,
      });
    }
}, [data]);
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const hasEmptyMedicineName = rows.some((row) => row.medicineName === "");
    const hasEmptyPeriod = rows.some((row) => row.period === "");
    const hasEmptyDuration = rows.some((row) => row.duration === 0);
    if (complaint == "" || patientDiagnosis == "" || hasEmptyMedicineName || hasEmptyDuration || hasEmptyPeriod) {
      alert("Please fill all the fields");
    } else {
      // Collect data from the form
      const doctorName = "Tanishq bagchi";
      const doctorQualification = "MBBS";
      const regNo = "123";
      const hospitalName = "Saint parmanand hospital";
      const hospitalAddress = "civil lines, new delhi";
      const hospitalPhone = "1800-0981-9008";
      const patientId = patientInfo.id;
      const patientName = patientInfo.name;
      const patientGender = patientInfo.sex ? "Female" : "Male";
      const patientAge = calculateAge(patientInfo.dob);
      const patientMobile = patientInfo.mobile;
      const date = dayjs().format("DD/MM/YYYY");
      const chiefComplaints = complaint;
      const clinicalFindings = findings;
      const diagnosis = patientDiagnosis;
      const advice = patientAdvice;
      const followUp =
        nextDate !== null ? dayjs(nextDate).format("DD/MM/YYYY") : "No Need";
      const medicines = [];
      rows.forEach((element) => {
        const medicine = {
          name: element.medicineName,
          dosage: element.dosage,
          duration: element.duration,
          period: element.period,
        };
        medicines.push(medicine);
      });

      // Populate the data object
      setData({
        doctorName,
        doctorQualification,
        regNo,
        hospitalName,
        hospitalAddress,
        hospitalPhone,
        patientId,
        patientName,
        patientGender,
        patientAge,
        patientMobile,
        date,
        chiefComplaints,
        clinicalFindings,
        diagnosis,
        medicines,
        advice,
        followUp,
      });
      
    }
  };
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        medicineName: "",
        dosage: "",
        dosageTime: 0,
        duration: 0,
        period: "",
      },
    ]); // Add a new empty row to the array
  };

  const handleInputChange = (index, name, value) => {
    const updatedRows = [...rows];

    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    console.log(data);
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
      // Also remove the data from the state array
      const updatedData = [...rows].filter(
        (row, rowIndex) => rowIndex !== index
      );
      setRows(updatedData);
    }
  };

  return (
    <div className="prescription-form">
      <h2 className="gi-heading">New Prescription</h2>
      <div className="form-info">
        <div className="pres-row">
          <li className="heading-list">
          <span>•&ensp;Patient's Complaint :</span>
            <TextareaAutosize
              className="textArea"
              multiline={true}
              minRows={4}
              placeholder="Patients Complaint"
              value={complaint}
              onFocus={() => {
                if (complaint === "") {
                  setComplaint("• ");
                }
              }}
              onBlur={() => {
                if (complaint === "• ") {
                  setComplaint("");
                }
              }}
              onChange={(event) => {
                setComplaint(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  let line = complaint;
                  let cursor = event.target.selectionStart;
                  if (!line.startsWith("•")) {
                    line = "• " + line;
                    cursor += 2;
                  }
                  setComplaint(
                    line.slice(0, cursor) + "• " + line.slice(cursor)
                  );
                }
              }}
            ></TextareaAutosize>
          </li>
          <li className="heading-list">
          <span>•&ensp;Clinical Findings :</span>
            <TextareaAutosize
              className="textArea"
              multiline={true}
              minRows={4}
              placeholder="Complaint Findings"
              value={findings}
              onFocus={() => {
                if (findings === "") {
                  setFindings("• ");
                }
              }}
              onBlur={() => {
                if (findings === "• ") {
                  setFindings("");
                }
              }}
              onChange={(event) => {
                setFindings(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  let line = findings;
                  let cursor = event.target.selectionStart;
                  if (!line.startsWith("•")) {
                    line = "• " + line;
                    cursor += 2;
                  }
                  setFindings(
                    line.slice(0, cursor) + "• " + line.slice(cursor)
                  );
                }
              }}
            ></TextareaAutosize>
          </li>
        </div>
        <div className="pres-row">
          <li className="heading-list">
          <span>•&ensp;Diagnosis :</span>
            <TextareaAutosize
              className="textArea"
              style={{ width: "44.5%" }}
              multiline={true}
              minRows={4}
              placeholder="Diagnosis"
              value={patientDiagnosis}
              onFocus={() => {
                if (patientDiagnosis === "") {
                  setDiagnosis("• ");
                }
              }}
              onBlur={() => {
                if (patientDiagnosis === "• ") {
                  setDiagnosis("");
                }
              }}
              onChange={(event) => {
                setDiagnosis(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  let line = patientDiagnosis;
                  let cursor = event.target.selectionStart;
                  if (!line.startsWith("•")) {
                    line = "• " + line;
                    cursor += 2;
                  }
                  setDiagnosis(
                    line.slice(0, cursor) + "• " + line.slice(cursor)
                  );
                }
              }}
            ></TextareaAutosize>
          </li>
        </div>
        <div className="pres-row table-med">
          <table className="med-table">
            <tr className="table-head">
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Duration</th>
            </tr>
            {rows.map((row, index) => (
              <tr key={index} className="table-row">
                <td className="med-row">
                  {rows.length > 1 && (
                    <img
                      className="remove-row"
                      onClick={() => handleRemoveRow(index)}
                      src="./remove-prescription.png"
                      alt=""
                    ></img>
                  )}
                  <Autocomplete
                    options={medList}
                    sx={{
                      width: "80%",
                      backgroundColor: "#00829b",
                      margin: "auto",

                      borderRadius: "0.25rem",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "none",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "none",
                        },
                      },
                    }}
                    onChange={(event, value) => {
                      console.log(value);
                      handleInputChange(index, "medicineName", value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        OutlinedInput
                        {...params}
                        value={row.medicineName}
                      />
                    )}
                  />
                </td>
                <td>
                  <div className="duration">
                    <TextField
                      sx={{
                        width: "70%",
                        margin: "auto",
                        backgroundColor: "#00829b",
                        borderRadius: "0.25rem 0rem 0rem 0.25rem",
                      }}
                      multiline={true}
                      minRows={1}
                      placeholder="Dosage..."
                      value={row.dosage}
                      onFocus={() => {
                        if (row.dosage === "") {
                          handleInputChange(index,"dosage","• ");
                        }
                      }}
                      onBlur={() => {
                        if (row.dosage === "• ") {
                          handleInputChange(index,"dosage","");
                        }
                      }}
                      onChange={(event) => {
                        handleInputChange(index,"dosage",event.target.value);
                      }}
                      onKeyUp={(event) => {
                        if (event.key === "Enter") {
                          let line = row.dosage;
                          let cursor = event.target.selectionStart;
                          if (!line.startsWith("•")) {
                            line = "• " + line;
                            cursor += 2;
                          }
                          handleInputChange(index,"dosage",
                            line.slice(0, cursor) + "• " + line.slice(cursor)
                          );
                        }
                      }}
                      
                    ></TextField>
                    <TextField
                      type="number"
                      label="Total"
                      InputProps={{
                        inputProps: {
                          max: 100,
                          min: 1,
                        },
                      }}
                      sx={{
                        width: "30%",
                        margin: "auto",
                        backgroundColor: "#00829b",
                        borderRadius: "0rem 0.25rem 0.25rem 0rem",
                      }}
                      value={row.dosageTime}
                      onChange={(event) =>
                        handleInputChange(
                          index,
                          "dosageTime",
                          event.target.value
                        )
                      }
                    ></TextField>
                  </div>
                </td>
                <td>
                  <div className="duration">
                    <TextField
                      type="number"
                      InputProps={{
                        inputProps: {
                          max: 100,
                          min: 1,
                        },
                      }}
                      sx={{
                        width: "5rem",
                        backgroundColor: "#00829b",
                        display: "inline-block",
                        borderRadius: "0.25rem 0rem 0rem 0.25rem",
                      }}
                      value={row.duration}
                      onChange={(event) =>
                        handleInputChange(index, "duration", event.target.value)
                      }
                    ></TextField>

                    <Select
                      sx={{
                        width: "6rem",
                        backgroundColor: "#00829b",
                        borderRadius: "0rem 0.25rem 0.25rem 0rem",
                      }}
                      defaultValue="D"
                      value={row.period}
                      onChange={(event) =>
                        handleInputChange(index, "period", event.target.value)
                      }
                    >
                      <MenuItem value={'day'}>Day</MenuItem>
                      <MenuItem value={'week'}>Week</MenuItem>
                      <MenuItem value={'month'}>Month</MenuItem>
                    </Select>
                  </div>
                </td>
              </tr>
            ))}
          </table>
          <button className="add-row" onClick={handleAddRow}>
            <img src="/add-prescription.png" alt="" />
            <h3>Add Medicine</h3>
          </button>
        </div>
        <div className="pres-row">
          <li className="heading-list">
          <span>•&ensp;Advice :
          </span>
            <TextareaAutosize
              className="textArea"
              style={{ width: "44.5%" }}
              multiline={true}
              minRows={4}
              placeholder="Advice to follow"
              value={patientAdvice}
              onFocus={() => {
                if (patientAdvice === "") {
                  setAdvice("• ");
                }
              }}
              onBlur={() => {
                if (patientAdvice === "• ") {
                  setAdvice("");
                }
              }}
              onChange={(event) => {
                setAdvice(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  var line = patientAdvice;
                  if (!patientAdvice.startsWith("•")) line = "• " + line;
                  const cursor = event.target.selectionStart;
                  setAdvice(line.slice(0, cursor) + "• " + line.slice(cursor));
                }
              }}
            ></TextareaAutosize>
          </li>
        </div>
        <div className="pres-row">
          <li className="heading-list">
          <span>•&ensp;Follow Up :</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  width: "11rem",
                  marginTop: "1rem",
                  backgroundColor: "#00829b",
                  borderRadius: '0.5rem',
                  marginLeft:'1%'
                }}
                value={nextDate}
                onChange={(newValue) => {
                  setNextDate(newValue);
                }}
              />
            </LocalizationProvider>
          </li>
        </div>
        <div className="pres-row">
          <div
            style={{
              height: 2,
              width: "100%",
              marginRight: 10,
              marginLeft: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          />
          <button className="generate" onClick={handleSubmit}>
            <img src="/generate-prescription.png" alt="" />
            <h2>Generate Prescription</h2>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
