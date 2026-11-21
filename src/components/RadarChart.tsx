interface RadarAxis {
  label: string;
  value: number;
}

interface RadarChartProps {
  primary: RadarAxis[];
  secondary?: RadarAxis[];
  size?: number;
}

export function RadarChart({ primary, secondary, size = 240 }: RadarChartProps) {
  const count = primary.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;
  const rings = [0.33, 0.66, 1];

  const getPoint = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: cx + radius * ratio * Math.cos(angle),
      y: cy + radius * ratio * Math.sin(angle),
    };
  };

  const toPolygon = (axes: RadarAxis[]) =>
    axes
      .map((axis, i) => {
        const pt = getPoint(i, Math.max(0.15, Math.min(1, axis.value / 100)));
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[260px] mx-auto overflow-visible"
      role="img"
      aria-label="مخطط القدرات الفنية"
    >
      {/* Concentric web rings */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: count }, (_, i) => {
            const p = getPoint(i, ring);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
      ))}

      {/* Axis spokes */}
      {primary.map((axis, i) => {
        const edge = getPoint(i, 1);
        return (
          <line
            key={axis.label}
            x1={cx}
            y1={cy}
            x2={edge.x}
            y2={edge.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Secondary player polygon (for Comparator) */}
      {secondary && (
        <polygon
          points={toPolygon(secondary)}
          fill="rgba(56, 189, 248, 0.22)"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}

      {/* Primary player polygon */}
      <polygon
        points={toPolygon(primary)}
        fill="rgba(42, 102, 255, 0.34)"
        stroke="#4D8BFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Primary vertices */}
      {primary.map((axis, i) => {
        const pt = getPoint(i, Math.max(0.15, Math.min(1, axis.value / 100)));
        return (
          <circle
            key={axis.label}
            cx={pt.x}
            cy={pt.y}
            r="3.2"
            fill="#FFFFFF"
            stroke="#1B4BFF"
            strokeWidth="1.5"
          />
        );
      })}

      {/* Labels */}
      {primary.map((axis, i) => {
        const labelPt = getPoint(i, 1.24);
        return (
          <text
            key={axis.label}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.85)"
            fontSize="10.5"
            fontWeight="600"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
