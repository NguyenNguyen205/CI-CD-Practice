import "./App.css";
import MultiChart from "./MultiChart";
import { useState, useEffect } from "react";
import { fetchPrice, fetchFrequency } from "./utils/commonUtils";
function App() {
  const [interval, setPriceInterval] = useState("5");
  const [priceData, setPriceData] = useState([]);
  const [freqData, setFreqData] = useState([]);

  useEffect(() => {
    fetchPrice(interval)
      .then((val) => setPriceData([...val]))
      .then(() => console.log(priceData));

    fetchFrequency(interval)
      .then((val) => setFreqData([...val]))
      .then(() => console.log(freqData));
  }, [interval]);

  const charts = [
    {
      id: "a",
      data: priceData,
      chartType: "freq",
      title: "Electricity Frequency",
    },
    // {
    //   id: "b",
    //   data: freqData,
    //   chartType: "freq",
    //   title: "Electricity Frequency",
    // },
  ];
  return (
    <div className="App">
      <div className="container">
        <select
          value={interval}
          onChange={(e) => {
            setPriceInterval(e.target.value);
          }}
          className="interval"
        >
          <option value="5">5M</option>
          <option value="10">10M</option>
          <option value="25">25M</option>
          <option value="1">1H</option>
          <option value="2">2H</option>
        </select>
        {charts.map((chart) => (
          <MultiChart
            key={chart.id}
            data={chart.data}
            id={chart.id}
            chartType={chart.chartType}
            title={chart.title}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
