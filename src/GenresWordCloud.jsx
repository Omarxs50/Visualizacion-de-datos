import { useEffect, useState } from "react";
import parseCSVLine from "./utils/parseCsvLine";

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#ffa502", "#26de81",
  "#a78bfa", "#fb923c", "#f472b6", "#3b82f6", "#10b981",
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GenresWordCloud({ maxWords = 80, filter }) {
  const [positioned, setPositioned] = useState([]);

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

          const listed = cols[10]; // listed_in
          if (!listed || listed === "Unknown") return;

          const parts = listed.split(",");
          parts.forEach((p) => {
            const g = p.trim();
            if (!g) return;
            counts[g] = (counts[g] || 0) + 1;
          });
        });

        const words = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxWords)
          .map(([word, count]) => ({ word, count }));

        if (!words.length) return;

        const max = Math.max(...words.map((w) => w.count));
        const min = Math.min(...words.map((w) => w.count));

        const computeSize = (count) => {
          const base = 14;
          const maxAdd = 60;
          return base + Math.round(((count - min) / (max - min || 1)) * maxAdd);
        };

        // Shuffle and assign positions with gentle wrapping layout
        const shuffled = shuffleArray([...words]);
        const result = [];
        let posX = 0;
        let posY = 0;
        const containerWidth = 1000;
        const lineHeight = 80;

        shuffled.forEach((w, i) => {
          const size = computeSize(w.count);
          const wordWidth = size * 0.6 * w.word.length; // rough estimate
          const rotate = Math.random() < 0.3 ? (Math.random() - 0.5) * 15 : 0; // 30% slight rotation

          // Simple line wrapping
          if (posX + wordWidth > containerWidth) {
            posX = 0;
            posY += lineHeight;
          }

          result.push({
            word: w.word,
            count: w.count,
            size,
            x: posX,
            y: posY,
            rotate,
            color: colorPalette[i % colorPalette.length],
          });

          posX += wordWidth + 30; // gap between words
        });

        setPositioned(result);
      });
  }, [maxWords, filter]);

  if (!positioned.length) return null;

  const containerStyle = {
    width: "100%",
    minHeight: 400,
    padding: "24px",
    borderRadius: 8,
    background: "#fff",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: "12px 20px",
    overflow: "visible",
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Nube de palabras: géneros</h2>
      <div style={containerStyle}>
        {positioned.map((w) => (
          <span
            key={w.word}
            title={`${w.word}: ${w.count}`}
            style={{
              fontSize: `${w.size}px`,
              color: w.color,
              fontWeight: 700,
              whiteSpace: "nowrap",
              cursor: "default",
              userSelect: "none",
              transform: `rotate(${w.rotate}deg)`,
              transition: "all 0.2s ease",
            }}
          >
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
}
