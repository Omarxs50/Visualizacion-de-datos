import CountryHeatmap from "./CountryHeatmap";
import GenresWordCloud from "./GenresWordCloud";
import ContentTypePie from "./ContentTypePie";

export default function Visualizations({ filter }) {
  return (
    <section id="visualizaciones-recomendadas" style={{ marginTop: "80px", paddingTop: 20 }}>
      <h1>Visualizaciones</h1>
      <CountryHeatmap filter={filter} />
      <GenresWordCloud filter={filter} />
      <ContentTypePie filter={filter} />
    </section>
  );
}
