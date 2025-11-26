import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import parseCSVLine from "./utils/parseCsvLine";

const COLORS = ["#6366f1", "#ec4899"];

export default function ContentTypePie({ filter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/netflix_titles_clean.csv")
      .then((res) => res.text())
      .then((csvData) => {
        const rows = csvData.split("\n").slice(1);
        const counts = {};

        const minYear = filter?.startYear;
        const maxYear = filter?.endYear;

        rows.forEach((row) => {
          if (!row.trim()) return;
          const cols = parseCSVLine(row);

          const releaseYear = parseInt(cols[7], 10);
          if (minYear && maxYear) {
            if (isNaN(releaseYear) || releaseYear < minYear || releaseYear > maxYear) return;
          }

          const type = cols[1] || "Unknown"; // Movie or TV Show
          counts[type] = (counts[type] || 0) + 1;
        });

        const arr = Object.entries(counts)
          .filter(([type]) => type !== "Unknown") // Filtrar Unknown
          .map(([name, value]) => ({ name, value }));
        setData(arr);
      });
  }, [filter]);

  if (!data.length) return null;

  return (
    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Tipo de contenido: Películas vs Series</h2>
      <div style={{ width: "400px", height: "300px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
