import { useEffect, useState } from "react";
import parseCSVLine from "./utils/parseCsvLine";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TopCountriesChart({ filter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/netflix_titles_clean.csv")
      .then((res) => res.text())
      .then((csvData) => {
        const rows = csvData.split("\n").slice(1);
        const countryCounts = {};

        const minYear = filter?.startYear;
        const maxYear = filter?.endYear;

        rows.forEach((row) => {
          if (!row.trim()) return;
          const cols = parseCSVLine(row);

          const releaseYear = parseInt(cols[7], 10);
          if (minYear && maxYear) {
            if (isNaN(releaseYear) || releaseYear < minYear || releaseYear > maxYear) return;
          }

          const country = cols[5]; // columna country
          if (!country || country === "Unknown") return;

          const countries = country.split(",");
          countries.forEach((c) => {
            const trimmed = c.trim();
            if (trimmed) {
              countryCounts[trimmed] = (countryCounts[trimmed] || 0) + 1;
            }
          });
        });

        const sorted = Object.entries(countryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([country, count]) => ({
            country,
            count
          }));

        setData(sorted);
      });
  }, [filter]);

  return (
    <div style={{ width: "800px", height: "400px", marginTop: "40px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
