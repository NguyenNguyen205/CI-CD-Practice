/** App.js */
import { useState } from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import "./styles.css";

function MultiChart({ data, id, chartType, title }) {
  const [selectedItems, setSelectedItems] = useState([]);
  // const margin = {
  //   left: 40,
  //   top: 30,
  // };
  // console.log(`Key ID: ${id}`);
  let legendData = [];
  let chartData = [];
  if (data !== undefined) {
    if (Object.keys(data).length !== 0) {
      legendData = data;
      chartData = [
        data[0],
        ...data.slice(1).filter((e) => selectedItems.includes(e.name)),
      ];
    }
  }
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };
  return (
    <>
      <div className="MultiChart">
        <Legend
          data={legendData}
          selectedItems={selectedItems}
          onChange={onChangeSelection}
        />
        {Object.keys(chartData).length !== 0 && (
          <MultilineChart data={chartData} id={id} chartType={chartType} />
        )}
      </div>
      <h4 className="chartTitle">{title}</h4>
    </>
  );
}
export default MultiChart;
