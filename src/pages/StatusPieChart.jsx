import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

function EmployeePieChart() {
  const [data, setData] = useState({ assignedCount: 0, commonPoolCount: 0 });

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Retrieve token

    axios.get("http://localhost:8082/api/dashboard/employee-counts", {
      headers: {
        Authorization: `Bearer ${token}`,  // Send Bearer token
      },
    })
      .then(res => {
        setData({
          assignedCount: res.data.assignedCount,
          commonPoolCount: res.data.commonPoolCount
        });
      })
      .catch(err => console.error("API error: ", err));
  }, []);

  const pieData = {
    labels: ["Assigned Employees", "Common Pool Employees"],
    datasets: [
      {
        data: [data.assignedCount, data.commonPoolCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"]
      }
    ]
  };

  return (
    <div style={{ width: "300px", margin: "50px auto", textAlign: "center" }}>
      <h3>Employee Distribution</h3>

      <Pie data={pieData} />

      <div style={{ marginTop: "15px" }}>
        <strong>Assigned :</strong> {data.assignedCount}
        <br />
        <strong>Common Pool :</strong> {data.commonPoolCount}
      </div>
    </div>
  );
}

export default EmployeePieChart;
