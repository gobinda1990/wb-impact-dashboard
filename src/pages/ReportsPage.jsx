import React, { useEffect, useState } from "react";
import { fetchReports } from "../services/dashboardService";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const ReportsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchReports();

    setData([
      { name: "Assigned Employees", value: result.assignedCount },
      { name: "Common Pool Employees", value: result.commonPoolCount }
    ]);
  };

  const COLORS = ["#0088FE", "#1c5e27ff"];

  return (
    <div align="center">
    <PieChart width={600} height={500}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((e, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
    </div>
  );
};

export default ReportsPage;
