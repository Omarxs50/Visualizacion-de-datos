import { useState } from "react";
import TopCountriesChart from "./TopcountriesChart";
import YearReleaseEvolutionChart from "./YearReleaseEvolutionChart";
import TopGenresDirectorsChart from "./TopGenresDirectorsChart";
import Visualizations from "./Visualizations";
import DateFilter from "./DateFilter";
import StatsCards from "./StatsCards";

function App() {
  const [showVisualizationsFull, setShowVisualizationsFull] = useState(false);
  const [filter, setFilter] = useState(null);

  return (
    <div>
      <main>
        <div style={{ padding: 16, display: "flex" }}>
          {/* Left column: DateFilter + Visualizations button */}
          <div style={{ width: 160, paddingRight: 24, borderRight: "1px solid #e0e0e0", minHeight: "100vh" }}>
            <div style={{ position: "sticky", top: 16 }}>
              <h3 style={{ marginTop: 0, fontSize: 14, fontWeight: 600 }}>Filtrar por año</h3>
              <DateFilter onChange={(sel) => setFilter(sel)} />

              {/* Visualizations button inside left column */}
              <button
                onClick={() => setShowVisualizationsFull((s) => !s)}
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  background: "#f0f4ff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#3b5bdb",
                  transition: "all 120ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f4ff")}
                title="Ver/Ocultar visualizaciones"
              >
                📊 Visualizaciones
              </button>
            </div>
          </div>

          {/* Right column: Main content */}
          <div style={{ flex: 1, paddingLeft: 24 }}>
            <h1 style={{ margin: "0 0 32px 0" }}>La economía del entretenimiento: Netflix y tendencias Globales</h1>

            <StatsCards filter={filter} />

            {!showVisualizationsFull && (
              <>
                <TopCountriesChart filter={filter} />
                <YearReleaseEvolutionChart filter={filter} />
                <TopGenresDirectorsChart filter={filter} />
              </>
            )}

            {/* Full-width Visualizations section */}
            {showVisualizationsFull && (
              <div style={{ marginTop: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ margin: 0 }}>Visualizaciones</h2>
                  <button
                    onClick={() => setShowVisualizationsFull(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#212121",
                      cursor: "pointer",
                      fontSize: 24,
                      fontWeight: 600,
                    }}
                    aria-label="Cerrar visualizaciones"
                  >
                    ✕
                  </button>
                </div>
                <Visualizations filter={filter} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
