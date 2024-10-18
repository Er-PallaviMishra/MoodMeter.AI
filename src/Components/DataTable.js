import React from "react";

export default function DataTable({theadData, tbodyData}) {
  console.log("data head",theadData);
 return (
   <table class="table">
       <thead>
          <tr>
           {theadData.map(heading => {
             return <th scope="col" key={heading}>{heading}</th>
           })}
         </tr>
       </thead>
       <tbody>
           {tbodyData.map((row, index) => {
               return <tr key={index}>
                   {theadData.map((key, index) => {
                        return<td scope="row">{row._id?row._id.$oid:row[key]}</td>
                   })}
             </tr>;
           })}
       </tbody>
   </table>
);
}
