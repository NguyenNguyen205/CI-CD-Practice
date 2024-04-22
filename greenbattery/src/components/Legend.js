import React from "react";

const Legend = ({ data, selectedItems, onChange }) => (
  <div className="legendContainer">
    {data.map((d, index) => (
      <div className="checkbox" style={{ color: d.color }} key={d.name}>
        <label>
          {index !== 0 && (
            <input
              type="checkbox"
              value={d.name}
              checked={selectedItems.includes(d.name)}
              onChange={() => onChange(d.name)}
            />
          )}
          {d.name}
        </label>
      </div>
    ))}
  </div>
);

export default Legend;
