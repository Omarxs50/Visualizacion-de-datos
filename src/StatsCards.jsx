import { useEffect, useState } from "react";
import parseCSVLine from "./utils/parseCsvLine";

export default function StatsCards({ filter }) {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalGenres: 0,
    topCountry: "",
  });

  useEffect(() => {
    fetch("/netflix_titles_clean.csv")
      .then((res) => res.text())
      .then((csvData) => {
        const rows = csvData.split("\n").slice(1);
        const genres = new Set();
        const countryCounts = {};
        let movieCount = 0;

        const minYear = filter?.startYear;
        const maxYear = filter?.endYear;

        rows.forEach((row) => {
          if (!row.trim()) return;
          const cols = parseCSVLine(row);

          const releaseYear = parseInt(cols[7], 10);
          if (minYear && maxYear) {
            if (isNaN(releaseYear) || releaseYear < minYear || releaseYear > maxYear) return;
          }

          movieCount++;

          // Count genres
          const listed = cols[10]; // listed_in
          if (listed && listed !== "Unknown") {
            const genreList = listed.split(",");
            genreList.forEach((g) => {
              genres.add(g.trim());
            });
          }

          // Count countries
          const country = cols[5]; // country
          if (country && country !== "Unknown") {
            const countryList = country.split(",");
            countryList.forEach((c) => {
              const trimmed = c.trim();
              countryCounts[trimmed] = (countryCounts[trimmed] || 0) + 1;
            });
          }
        });

        // Find country with most productions
        let topCountry = "";
        let maxProductions = 0;
        Object.entries(countryCounts).forEach(([country, count]) => {
          if (count > maxProductions) {
            maxProductions = count;
            topCountry = country;
          }
        });

        setStats({
          totalMovies: movieCount,
          totalGenres: genres.size,
          topCountry: topCountry || "N/A",
        });
      });
  }, [filter]);

  const cardStyle = {
    background: "#f0f4ff",
    padding: 24,
    borderRadius: 8,
    textAlign: "center",
    border: "1px solid #e0e7ff",
    boxShadow: "0 2px 8px rgba(100, 150, 255, 0.1)",
  };

  const valueStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: "#3b5bdb",
    marginTop: 12,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}
    >
      <div style={cardStyle}>
        <div style={labelStyle}>Total de películas</div>
        <div style={valueStyle}>{stats.totalMovies.toLocaleString()}</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Total de géneros</div>
        <div style={valueStyle}>{stats.totalGenres}</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>País con más producciones</div>
        <div style={valueStyle} style={{ fontSize: 18, marginTop: 16 }}>
          {stats.topCountry}
        </div>
      </div>
    </div>
  );
}
