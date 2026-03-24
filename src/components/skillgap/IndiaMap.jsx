import React, { useState, useEffect, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { stateSkillGaps } from '../../data/stateSkillGaps';
import { getAverageSeverity, getSeverityColor, resolveStateName, getWorstGap } from '../../utils/heatmapUtils';

// Served from /public folder — no external URL dependency
const INDIA_TOPO_JSON = '/india-states.topo.json';

const getStateName = (geo) => {
  return geo.properties?.name || geo.properties?.ST_NM || geo.properties?.NAME_1 || geo.id || '';
};

const IndiaMap = ({ category, onStateClick, selectedState }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, name: '', gap: '' });

  const handleMouseEnter = (geo, evt) => {
    const rawName = getStateName(geo);
    const dataKey = resolveStateName(rawName);
    const worstGap = dataKey ? getWorstGap(dataKey, category) : null;

    setTooltip({
      show: true,
      x: evt.clientX,
      y: evt.clientY,
      name: dataKey || rawName,
      gap: worstGap ? `${worstGap.skill}: ${worstGap.severity}%` : 'No data',
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const handleClick = (geo) => {
    const rawName = getStateName(geo);
    const dataKey = resolveStateName(rawName);
    if (dataKey && stateSkillGaps[dataKey]) {
      onStateClick(dataKey);
    }
  };

  return (
    <div className="sgh-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [82, 22],
        }}
        width={500}
        height={480}
        style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
      >
        <ZoomableGroup center={[82, 22]} zoom={1}>
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) {
                return null;
              }
              return geographies.map((geo) => {
                const rawName = getStateName(geo);
                const dataKey = resolveStateName(rawName);
                const avgSeverity = dataKey ? getAverageSeverity(dataKey, category) : null;
                const fillColor = avgSeverity !== null ? getSeverityColor(avgSeverity) : '#cccccc';
                const isSelected = selectedState && dataKey === selectedState;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? '#F5D88A' : fillColor,
                        stroke: isSelected ? '#1A1A1A' : '#1A1A1A',
                        strokeWidth: isSelected ? 1.5 : 0.5,
                        outline: 'none',
                        cursor: dataKey ? 'pointer' : 'default',
                        transition: 'fill 0.3s ease',
                      },
                      hover: {
                        fill: dataKey ? '#F5D88A' : '#dddddd',
                        stroke: '#1A1A1A',
                        strokeWidth: 1.2,
                        outline: 'none',
                        cursor: dataKey ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: '#e6c570',
                        stroke: '#1A1A1A',
                        strokeWidth: 1.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip.show && (
        <div
          className="sgh-tooltip"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40,
          }}
        >
          <div className="sgh-tooltip-name">{tooltip.name}</div>
          <div className="sgh-tooltip-gap">{tooltip.gap}</div>
        </div>
      )}
    </div>
  );
};

export default memo(IndiaMap);
