import { useState } from "react";

export default function DateFilter({ onChange }) {
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2021);
  const [enabled, setEnabled] = useState(false);

  const apply = () => {
    if (!enabled) return onChange(null);
    onChange({ startYear: parseInt(startYear, 10), endYear: parseInt(endYear, 10) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>Habilitar</span>
        <input type="checkbox" checked={enabled} onChange={(e) => { setEnabled(e.target.checked); if (!e.target.checked) onChange(null); }} style={{ width: 16, height: 16 }} />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>Desde:</span>
        <input
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", fontSize: 12 }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
        <span style={{ fontWeight: 600 }}>Hasta:</span>
        <input
          type="number"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", fontSize: 12 }}
        />
      </label>

      <button 
        onClick={apply} 
        style={{ 
          marginLeft: 0, 
          padding: 8, 
          borderRadius: 4, 
          border: "none", 
          background: "#667eea", 
          color: "#fff", 
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600
        }}
      >
        Aplicar
      </button>
    </div>
  );
}

