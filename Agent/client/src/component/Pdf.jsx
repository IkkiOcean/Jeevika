import PrescriptionTemplate from "./PrescriptionTemplate"
import { useLocation } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
const Pdf = ()=>{
    const location = useLocation();
    const data = location.state;
    console.log(data);
    return(
        <div>

        <PDFViewer width="1000" height="650" className="app" >

            <PrescriptionTemplate data={data}></PrescriptionTemplate>
        </PDFViewer>
        </div>
    )
}
export default Pdf;