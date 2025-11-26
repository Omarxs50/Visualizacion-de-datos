import { useEffect, useState } from "react";
import parseCSVLine from "./utils/parseCsvLine";

export default function CountryHeatmap({ maxItems = 48, columns = 8, filter }) {
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

          const countries = country.split(";");
          countries.forEach((c) => {
            const key = c.trim();
            if (!key) return;
            countryCounts[key] = (countryCounts[key] || 0) + 1;
          });
        });

        const sorted = Object.entries(countryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxItems)
          .map(([country, count]) => ({ country, count }));

        setData(sorted);
      });
  }, [maxItems, filter]);

  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.count));

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "8px",
    width: "800px",
    marginTop: "20px",
    margin: "20px auto 0",
  };

  const getColor = (count, index) => {
    // Marcar los 3 primeros en rojo
    if (index === 0 || index === 1 || index === 2) return "#d73027"; // rojo
    // Nuevos rangos solicitados:
    // - naranja para >= 200
    // - amarillo para 100..199
    // - verde para 50..99
    // - blanco para 30..49
    // - azul para 10..29
    if (count >= 200) return "#fc8d59"; // naranja
    if (count >= 100 && count <= 199) return "#fee08b"; // amarillo
    if (count >= 50 && count <= 99) return "#1a9850"; // verde
    if (count >= 30 && count <= 49) return "#ffffff"; // blanco
    if (count >= 10 && count <= 29) return "#4575b4"; // azul
    return "#333";
  };

  const cellStyle = (count, index) => ({
    background: getColor(count, index),
    color: getColor(count, index) === "#ffffff" ? "#000" : "#fff",
    padding: "12px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "56px",
    fontSize: "12px",
    textAlign: "center",
  });

  return (
    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Mapa de calor: títulos por país (top {data.length})</h2>
      <div style={gridStyle}>
        {data.map((d, index) => (
          <div key={d.country} title={`${d.country}: ${d.count}`} style={cellStyle(d.count, index)}>
            <div style={{ fontWeight: 700 }}>{d.country}</div>
            <div style={{ opacity: 0.9 }}>{d.count}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Leyenda</h4>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#d73027", display: "inline-block" }} />
            <span>Top 3</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#fc8d59", display: "inline-block" }} />
            <span>&ge; 200</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#fee08b", display: "inline-block" }} />
            <span>100 - 199</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#1a9850", display: "inline-block" }} />
            <span>50 - 99</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#ffffff", border: "1px solid #ccc", display: "inline-block" }} />
            <span>30 - 49</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 24, height: 16, background: "#4575b4", display: "inline-block" }} />
            <span>10 - 29</span>
          </div>
        </div>
      </div>
    </div>
  );
}
