import React from 'react';

const MapLegend = () => {
  return (
    <div className="sgh-legend">
      <div className="sgh-legend-bar"></div>
      <div className="sgh-legend-labels">
        <span className="sgh-legend-low">Low gap</span>
        <span className="sgh-legend-high">Critical gap</span>
      </div>
    </div>
  );
};

export default MapLegend;
