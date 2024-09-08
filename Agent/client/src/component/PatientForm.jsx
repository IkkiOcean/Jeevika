import "../pages/prescription.css";
import "./patientForm.css";
import axios from "axios";
import { TextareaAutosize } from "@mui/material";
import { loadPriscription } from "../pages/prescription";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState , useEffect} from "react";
const PatientForm = ({setAddPatient, setToggleNew, setPatient,patientList, setPatientList}) => {
  const [DOB, setDOB] = useState(null);
  const [age, setAge] = useState("----");
  const [sex, setSex] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone]= useState("");
  const handleSex = (event) => {
    setSex(event.target.value);
  };

  useEffect(() => {
      setPatient(patientList[patientList.length - 1].patient_id);
    
  }, [patientList]);
  const handleSubmit = async () => {
    try {
      const data = {
        "name": name,
        "sex": sex,
        "dob": dayjs(DOB).format("YYYY-MM-DD HH:mm:ss"),
        "mobile": phone
      }
      const response = await axios.post(`http://127.0.0.1:5000/add_patient`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.id);
      if (response.status === 200) {

        setPatientList([...patientList, response.data.id]) 
        
        setPatient(response.data.id.patient_id)
        setAddPatient(false);
        setToggleNew(true);
      } else {
        alert("Failed to add patient!\nPatient already exits for this mobile no.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again later.");
    }
  }
  return (
    <div className="patient-form">
      <div className="centre-div">
      <div className="prescription-top">
            <img src="\patient-icon.png" alt="" />
            <h1>Register Patient</h1>
            </div>
        <div className="general-info">
          <h2 className="gi-heading">General Information</h2>
          <div className="heading-element">
          <h2 className="heading-text">Name</h2>
          <TextareaAutosize multiline={false} maxRows={1}type="text" className="input-field"
          onChange={(event)=>{
            setName(event.target.value);
          }} ></TextareaAutosize>
          </div>
          <div className="heading-element">
            <h2 className="heading-text">Date of birth</h2>
            <div className="heading-value">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "11rem", backgroundColor:"#00829b", borderRadius:'0.25rem' }}
                  value={DOB}
                  onChange={(newValue) => {
                    setDOB(newValue);
                    var dob = dayjs(newValue);
                    var currDate = dayjs();
                    setAge(
                      Math.floor(currDate.diff(dob, "day", true) / 365) +
                        " years"
                    );
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="heading-element">
            <h2 className="heading-text">Age</h2>
            <h2 className="heading-value">{age}</h2>
          </div>
          <div className="heading-element">
            <h2 className="heading-text">Sex</h2>
            <div className="heading-value">
              <Select
                sx={{ width: "7rem" , backgroundColor:"#00829b", borderRadius:'0.25rem'}}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={sex}
                onChange={handleSex}
              >
                <MenuItem  value={0}>Male</MenuItem>
                <MenuItem value={1}>Female</MenuItem>
              </Select>
            </div>
          </div>
          <div className="heading-element">
            <h2 className="heading-text">Phone No.</h2>
            <div className="heading-value">
              <TextField  maxLength={10} sx={{ width: "10rem", backgroundColor:"#00829b", borderRadius:'0.25rem' }} placeholder="91+" onBlur={(event)=>{
                setPhone(event.target.value)
              }}></TextField>
            </div>
          </div>
          <button className="submit-patient" onClick={handleSubmit}>
            <img src="/generate-prescription.png" alt="" />
            <h2>Add patient</h2>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PatientForm;
