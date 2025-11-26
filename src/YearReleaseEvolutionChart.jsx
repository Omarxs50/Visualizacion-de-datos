import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import parseCSVLine from "./utils/parseCsvLine";

export default function YearReleaseEvolutionChart({ filter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/netflix_titles_clean.csv")
      .then((res) => res.text())
      .then((csvData) => {
        const rows = csvData.split("\n").slice(1);
        const yearCounts = {};

        rows.forEach((row) => {
          if (!row.trim()) return;
          const cols = parseCSVLine(row);
          const releaseYear = cols[7]; // columna release_year

          if (!releaseYear || releaseYear === "NaN") return;

          const year = parseInt(releaseYear, 10);
          if (isNaN(year)) return;

          yearCounts[year] = (yearCounts[year] || 0) + 1;
        });

        const minYear = filter?.startYear ?? 2007;
        const maxYear = filter?.endYear ?? 2021;

        const sorted = Object.entries(yearCounts)
          .sort((a, b) => a[0] - b[0])
          .filter(([year]) => {
            const y = parseInt(year, 10);
            return y >= minYear && y <= maxYear;
          })
          .map(([year, count]) => ({
            year: parseInt(year, 10),
            count
          }));

        setData(sorted);
      });
  }, [filter]);

  return (
    <div style={{ width: "800px", height: "400px", marginTop: "40px" }}>
      <h2>Evolución de lanzamientos por año</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
