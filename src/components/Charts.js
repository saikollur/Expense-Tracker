// src/components/Charts.js
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B19CD9"];

function Charts({ expenses }) {
  const dataByCategory = useMemo(() => {
    const totals = {};
    expenses.forEach((exp) => {
      if (!totals[exp.category]) totals[exp.category] = 0;
      totals[exp.category] += exp.amount;
    });

    return Object.entries(totals).map(([category, total]) => ({
      name: category,
      value: total,
    }));
  }, [expenses]);

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 300, height: 300 }}>
        <h3>Expenses by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {dataByCategory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1, minWidth: 300, height: 300 }}>
        <h3>Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
