import './inventory.css'
import axios from "axios";
import { API_BASE_URL } from "../config";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
const Inventory = ()=>{
    const data = useLoaderData();
    const [searchText, setSearchText] = useState("");
    const [resultStatus,setResultStatus] = useState("");
    const [meds,setMeds] = useState(data);
    const handleSearchText = (value) => {
        setSearchText(value);
        if(value == ""){
          setMeds(data);
        }
        else{
          handleSearch(value)
        }
      }
      const handleSearch = (search_text)=>{
        search_text = search_text.replace(" ","");
        search_text = search_text.toLowerCase();
        function checkMeds(med_name) {
          med_name = med_name.replace(" ","").toLowerCase();
          return med_name.includes(search_text);
        }
          var searchCards = data.filter(e => checkMeds(e.medicine_name));
          if(searchCards.length == 0){
            setResultStatus("No Medicine Found!");
          }
          else{
            setResultStatus("");
          }
          setMeds(searchCards);
      }
    
    return(
        <div className="container">
            <div className="header">
                <h1 className="heading">Update Inventory</h1>
            </div>
            <div className="searchBar">
                <div style={{ display: "flex" ,paddingBottom:'5px'}}>
                    <div style={{ flex: 1 }}>
                    
                    <input
                        type="text"
                        
                        placeholder="Search"
                        style={{ width: "30%",height: '30px',borderRadius:'20px',borderColor : 'black',marginRight: '-27px',display:'inline-block',marginBottom:'5px',padding:'6px',zIndex: '4' }}
                        value={searchText}
                        onChange={(event) => {
                        
                        handleSearchText(event.target.value);
                        console.log(event.target.value)
                        
                        }}
                    />
                    <img src="./searchIcon.png" alt="" className="search-icon" />
                        </div>
                </div>
            </div>
        </div>
    )
}

export const  checkInventory = async()=> {
    var medData;
    await axios.get(`${API_BASE_URL}/fetch_data/1`).then((res) => {
      medData = res.data;
    });
    console.log(medData)
    return medData;
  }

export {Inventory};