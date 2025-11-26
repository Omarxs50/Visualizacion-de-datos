import Papa from "papaparse";
import { useState } from "react";

function ReadCSV() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
      },
    });
  };

  return (
    <div>
      <h2>Leer archivo CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((value, j) => (
                <td key={j}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadCSV;
