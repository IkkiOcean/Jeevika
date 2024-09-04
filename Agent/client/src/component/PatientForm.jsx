import "../pages/prescription.css";
import "./patientForm.css";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
const PatientForm = () => {
  const [DOB, setDOB] = useState(null);
  const [age, setAge] = useState("----");
  const [sex, setSex] = useState("----");
  const handleSex = (event) => {
    setSex(event.target.value);
  };
  return (
    <div className="patient-form">
      <div className="centre-div">
        <div className="general-info">
          <h2 className="gi-heading">General Information</h2>
          <div className="heading-element">
            <h2 className="heading-text">Date of birth</h2>
            <div className="heading-value">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "11rem" }}
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
                sx={{ width: "7rem" }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={sex}
                onChange={handleSex}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </div>
          </div>
          <div className="heading-element">
            <h2 className="heading-text">Phone No.</h2>
            <div className="heading-value">
              <TextField sx={{ width: "9rem" }} placeholder="91+"></TextField>
            </div>
          </div>
        </div>
        <div className="patient-complaints"></div>
      </div>
    </div>
  );
};

export default PatientForm;
