import { useState } from 'react';
import { motion } from 'motion/react';

export interface RadarAxis {
  label: string;
  value: number;
}

interface RadarChartProps {
  primary: RadarAxis[];
  secondary?: RadarAxis[];
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  primaryFill?: string;
  primaryTextColor?: string;
  secondaryColor?: string;
  secondaryFill?: string;
  secondaryTextColor?: string;
  size?: number;
}

export function RadarChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  primaryColor = '#3B82F6',
  primaryFill = 'rgba(59, 130, 246, 0.34)',
  primaryTextColor = '#93C5FD',
  secondaryColor = '#F59E0B',
  secondaryFill = 'rgba(245, 158, 11, 0.28)',
  secondaryTextColor = '#FCD34D',
  size = 280,
}: RadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const count = primary.length;
  const pad = 42;
  const viewBoxSize = size + pad * 2;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const radius = size * 0.36;

  // Calibrated scale (35 -> 100) so real differences between 55, 78, and 95 stand out dramatically
  const MIN_VAL = 35;
  const MAX_VAL = 100;
  const normalize = (val: number) =>
    Math.max(0.12, Math.min(1, (val - MIN_VAL) / (MAX_VAL - MIN_VAL)));

  const ringLevels = [
    { value: 60, ratio: normalize(60) },
    { value: 80, ratio: normalize(80) },
    { value: 100, ratio: 1 },
  ];

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
        const pt = getPoint(i, normalize(axis.value));
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');

  const hoveredPrimary = hoveredAxis !== null ? primary[hoveredAxis] : null;
  const hoveredSecondary =
    hoveredAxis !== null && secondary ? secondary[hoveredAxis] : null;

  return (
    <div className="w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full max-w-[330px] mx-auto overflow-visible select-none"
        role="img"
        aria-label="مخطط القدرات الفنية"
      >
        <defs>
          <filter id="radar-glow-primary" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.65" />
          </filter>
          <filter id="radar-glow-secondary" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={secondaryColor} floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Concentric web rings with subtle filled alternation */}
        {[...ringLevels].reverse().map((ring, idx) => (
          <polygon
            key={ring.value}
            points={Array.from({ length: count }, (_, i) => {
              const p = getPoint(i, ring.ratio);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(' ')}
            fill={idx % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(9,18,70,0.28)'}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
        ))}

        {/* Ring numeric reference ticks */}
        {ringLevels.map((ring) => {
          const tickPt = getPoint(0, ring.ratio);
          return (
            <text
              key={`tick-${ring.value}`}
              x={tickPt.x + 11}
              y={tickPt.y + 3}
              textAnchor="start"
              fill="rgba(255,255,255,0.38)"
              fontSize="9"
              fontWeight="700"
            >
              {ring.value}
            </text>
          );
        })}

        {/* Axis spokes */}
        {primary.map((axis, i) => {
          const edge = getPoint(i, 1);
          const isHovered = hoveredAxis === i;
          return (
            <line
              key={axis.label}
              x1={cx}
              y1={cy}
              x2={edge.x}
              y2={edge.y}
              stroke={isHovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={isHovered ? '1.6' : '1'}
            />
          );
        })}

        {/* Secondary player polygon */}
        {secondary && (
          <motion.polygon
            points={toPolygon(secondary)}
            fill={secondaryFill}
            stroke={secondaryColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#radar-glow-secondary)"
            initial={false}
            animate={{ points: toPolygon(secondary) }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        {/* Primary player polygon */}
        <motion.polygon
          points={toPolygon(primary)}
          fill={primaryFill}
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#radar-glow-primary)"
          initial={false}
          animate={{ points: toPolygon(primary) }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Secondary vertices */}
        {secondary &&
          secondary.map((axis, i) => {
            const pt = getPoint(i, normalize(axis.value));
            const isHovered = hoveredAxis === i;
            return (
              <circle
                key={`sec-${axis.label}`}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.2 : 3.8}
                fill="#FFFFFF"
                stroke={secondaryColor}
                strokeWidth="2.2"
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredAxis(i)}
                onMouseLeave={() => setHoveredAxis(null)}
              />
            );
          })}

        {/* Primary vertices */}
        {primary.map((axis, i) => {
          const pt = getPoint(i, normalize(axis.value));
          const isHovered = hoveredAxis === i;
          return (
            <circle
              key={`pri-${axis.label}`}
              cx={pt.x}
              cy={pt.y}
              r={isHovered ? 5.2 : 3.8}
              fill="#FFFFFF"
              stroke={primaryColor}
              strokeWidth="2.2"
              className="transition-all cursor-pointer"
              onMouseEnter={() => setHoveredAxis(i)}
              onMouseLeave={() => setHoveredAxis(null)}
            />
          );
        })}

        {/* Crisp Interactive Axis Labels + Live Color-Coded Value Chips */}
        {primary.map((axis, i) => {
          const labelPt = getPoint(i, 1.28);
          const isHovered = hoveredAxis === i;
          const secVal = secondary?.[i]?.value;
          return (
            <g
              key={`lbl-${axis.label}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredAxis(i)}
              onMouseLeave={() => setHoveredAxis(null)}
              onClick={() => setHoveredAxis((prev) => (prev === i ? null : i))}
            >
              <text
                x={labelPt.x}
                y={labelPt.y - (secondary ? 5 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.92)'}
                fontSize="12"
                fontWeight="800"
              >
                {axis.label}
              </text>
              {secondary ? (
                <text
                  x={labelPt.x}
                  y={labelPt.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10.5"
                  fontWeight="800"
                >
                  <tspan fill={primaryTextColor}>{axis.value}</tspan>
                  <tspan fill="rgba(255,255,255,0.45)"> / </tspan>
                  <tspan fill={secondaryTextColor}>{secVal}</tspan>
                </text>
              ) : (
                <text
                  x={labelPt.x}
                  y={labelPt.y + 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={primaryTextColor}
                  fontSize="10.5"
                  fontWeight="800"
                >
                  {axis.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Axis Inspector Footer */}
      {secondary && hoveredPrimary && hoveredSecondary && (
        <div className="mt-2 px-3.5 py-2 rounded-xl bg-[#0A1348]/90 border border-white/12 flex items-center gap-4 text-xs tabular-nums">
          <span className="font-bold text-white/75">{hoveredPrimary.label}:</span>
          <span className="font-extrabold" style={{ color: primaryTextColor }}>
            {primaryLabel ? `${primaryLabel} ` : ''}
            {hoveredPrimary.value}
          </span>
          <span className="text-white/30">vs</span>
          <span className="font-extrabold" style={{ color: secondaryTextColor }}>
            {secondaryLabel ? `${secondaryLabel} ` : ''}
            {hoveredSecondary.value}
          </span>
        </div>
      )}
    </div>
  );
}
