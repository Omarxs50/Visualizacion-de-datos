import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import parseCSVLine from "./utils/parseCsvLine";

const GENRE_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
const DIRECTOR_COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffa502", "#26de81"];

export default function TopGenresDirectorsChart({ filter }) {
  const [genresData, setGenresData] = useState([]);
  const [directorsData, setDirectorsData] = useState([]);

  useEffect(() => {
    fetch("/netflix_titles_clean.csv")
      .then((res) => res.text())
      .then((csvData) => {
        const rows = csvData.split("\n").slice(1);
        const genreCounts = {};
        const directorCounts = {};

        const minYear = filter?.startYear;
        const maxYear = filter?.endYear;

        rows.forEach((row) => {
          if (!row.trim()) return;
          const cols = parseCSVLine(row);

          const releaseYear = parseInt(cols[7], 10);
          if (minYear && maxYear) {
            if (isNaN(releaseYear) || releaseYear < minYear || releaseYear > maxYear) return;
          }

          const genres = cols[10]; // columna listed_in
          const directors = cols[3]; // columna director

          // Procesar géneros
          if (genres && genres !== "Unknown") {
            const genreList = genres.split(",");
            genreList.forEach((genre) => {
              genre = genre.trim();
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }

          // Procesar directores
          if (directors && directors !== "Unknown") {
            const directorList = directors.split(",");
            directorList.forEach((director) => {
              director = director.trim();
              directorCounts[director] = (directorCounts[director] || 0) + 1;
            });
          }
        });

        // Top 5 géneros
        const topGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([genre, count]) => ({
            name: genre,
            count
          }));

        // Top 5 directores
        const topDirectors = Object.entries(directorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([director, count]) => ({
            name: director,
            count
          }));

        setGenresData(topGenres);
        setDirectorsData(topDirectors);
      });
  }, [filter]);

  return (
    <div style={{ marginTop: "60px" }}>
      <h2>Top 5 Géneros Más Productivos</h2>
      <div style={{ width: "800px", height: "400px" }}>
        <ResponsiveContainer>
          <BarChart data={genresData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {genresData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GENRE_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 style={{ marginTop: "60px" }}>Top 5 Directores Más Productivos</h2>
      <div style={{ width: "800px", height: "400px" }}>
        <ResponsiveContainer>
          <BarChart data={directorsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {directorsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DIRECTOR_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
