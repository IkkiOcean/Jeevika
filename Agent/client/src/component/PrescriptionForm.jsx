import { useState } from "react";
import "../pages/prescription.css";
import "./prescriptionForm.css";
import { TextField, Autocomplete, OutlinedInput } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const PrescriptionForm = () => {
    const[nextDate, setNextDate] = useState();
  const [rows, setRows] = useState([
    {
      medicineName: "",
      dosage: "",
      duration: 0,
      period: 0,
    },
  ]); // Initialize an empty array of rows

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        medicineName: "",
        dosage: "",
        duration: 0,
        period: 0,
      },
    ]); // Add a new empty row to the array
  };

  const handleInputChange = (index, name, value) => {
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
      // Also remove the data from the state array
      const updatedData = [...rows].filter((row, rowIndex) => rowIndex !== index);
      setRows(updatedData);
    }
  };

  return (
    <div className="prescription-form">
      <h2 className="gi-heading">New Prescription</h2>
      <div className="form-info">
        <div className="pres-row">
          <li className="heading-list">
            Patient's Complaint :
            <TextField
              sx={{
                position: "relative",
                left: "1%",
                width: "90%",
                marginTop: "1rem",
                backgroundColor: "white",
              }}
              multiline={true}
              minRows={2}
              placeholder="Patients Complaint"
            ></TextField>
          </li>
          <li className="heading-list">
            Clinical Findings :
            <TextField
              sx={{
                position: "relative",
                left: "1%",
                width: "90%",
                marginTop: "1rem",
                backgroundColor: "white",
              }}
              multiline={true}
              minRows={2}
              placeholder="Clinical Findings"
            ></TextField>
          </li>
        </div>
        <div className="pres-row">
          <li className="heading-list">
            Diagnosis :
            <TextField
              sx={{
                position: "relative",
                left: "0.5%",
                width: "45%",
                marginTop: "1rem",
                backgroundColor: "white",
              }}
              multiline={true}
              minRows={2}
              placeholder="Diagnosis"
            ></TextField>
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
                      src="./remove-prescription.png" alt=""
                    >
                    </img>
                  )}
                  <Autocomplete
                    sx={{
                      width: "80%",
                      backgroundColor: "white",
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
                    renderInput={(params) => (
                      <OutlinedInput
                        {...params}
                        label="Medicine"
                        value={row.medicineName}
                        onChange={(event) =>
                          handleInputChange(
                            index,
                            "medicineName",
                            event.target.value
                          )
                        }
                      />
                    )}
                  />
                </td>
                <td>
                  <div className="duration">
                    <TextField
                      sx={{
                        width: "100%",
                        margin: "auto",
                        backgroundColor: "white",
                        borderRadius: "0.25rem",
                      }}
                      multiline={true}
                      minRows={1}
                      placeholder="Dosage..."
                      value={row.dosage}
                      onChange={(event) =>
                        handleInputChange(index, "dosage", event.target.value)
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
                        backgroundColor: "white",
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
                        backgroundColor: "white",
                        borderRadius: "0rem 0.25rem 0.25rem 0rem",
                      }}
                      defaultValue="D"
                      value={row.period}
                      onChange={(event) =>
                        handleInputChange(index, "period", event.target.value)
                      }
                    >
                      <MenuItem value={0}>Days</MenuItem>
                      <MenuItem value={1}>Month</MenuItem>
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
            Advice :
            <TextField
              sx={{
                position: "relative",
                left: "0.5%",
                width: "45%",
                marginTop: "1rem",
                backgroundColor: "white",
              }}
              multiline={true}
              minRows={2}
              placeholder="Advice to follow"
            ></TextField>
          </li>
        </div>
        <div className="pres-row">
          <li className="heading-list">
            Follow Up :
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "11rem", marginTop:'1rem', backgroundColor:'white'}}
                  value={nextDate}
                  onChange={(newValue) => {
                    setNextDate(newValue);
                    
                  }}
                />
              </LocalizationProvider>
              </li>
        </div>
        <div className="pres-row">
        <div style={{ height: 2, width: '100%', backgroundColor: '#ccc', marginRight: 10, marginLeft: 10, marginBottom: 10, marginTop: 10 }} />
            <button className="generate add-row">
                <img src="/generate-prescription.png" alt="" />
                <h2>Generate Prescription</h2>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
