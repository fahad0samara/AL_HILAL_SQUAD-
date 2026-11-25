import { useMemo, useState } from 'react';
import {
  Flame,
  Home,
  Plane,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  AL_HILAL_SQUAD,
  SEASON_STATS_DATA,
  type PlayerProfile,
  type SeasonCompetitionKey,
} from '../data/alHilalData';

interface SeasonStatsProps {
  onSelectPlayer: (player: PlayerProfile) => void;
}

const COMPETITIONS: { key: SeasonCompetitionKey; label: string }[] = [
  { key: 'all', label: 'جميع البطولات' },
  { key: 'spl', label: 'دوري روشن' },
  { key: 'acl', label: 'أبطال آسيا للنخبة' },
  { key: 'kingscup', label: 'كأس الملك' },
];

type OutcomeSegmentKey = 'wins' | 'draws' | 'losses';
type LeaderboardMode = 'goals' | 'contributions';

export function SeasonStats({ onSelectPlayer }: SeasonStatsProps) {
  const [competition, setCompetition] = useState<SeasonCompetitionKey>('all');
  const [hoveredOutcome, setHoveredOutcome] = useState<OutcomeSegmentKey | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>('goals');

  const data = SEASON_STATS_DATA[competition];

  const winRate = data.played > 0 ? Math.round((data.wins / data.played) * 100) : 0;
  const drawRate = data.played > 0 ? Math.round((data.draws / data.played) * 100) : 0;
  const lossRate = data.played > 0 ? Math.round((data.losses / data.played) * 100) : 0;
  const goalsPerGame = data.played > 0 ? (data.goalsFor / data.played).toFixed(2) : '0.00';
  const concededPerGame =
    data.played > 0 ? (data.goalsAgainst / data.played).toFixed(2) : '0.00';
  const cleanSheetRate =
    data.played > 0 ? Math.round((data.cleanSheets / data.played) * 100) : 0;
  const goalDiff = data.goalsFor - data.goalsAgainst;

  // Competition-specific scorers / goal contributors dynamically linked to AL_HILAL_SQUAD
  const leaderboard = useMemo(() => {
    const resolved = data.scorers
      .map((entry) => {
        const player = AL_HILAL_SQUAD.find((p) => p.id === entry.playerId);
        if (!player) return null;
        return {
          player,
          goals: entry.goals,
          assists: entry.assists,
          contributions: entry.goals + entry.assists,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return resolved
      .filter((item) =>
        leaderboardMode === 'goals' ? item.goals > 0 : item.contributions > 0
      )
      .sort((a, b) =>
        leaderboardMode === 'goals'
          ? b.goals - a.goals || b.assists - a.assists
          : b.contributions - a.contributions || b.goals - a.goals
      )
      .slice(0, 5);
  }, [data.scorers, leaderboardMode]);

  const maxLeaderValue = Math.max(
    1,
    leaderboard[0]
      ? leaderboardMode === 'goals'
        ? leaderboard[0].goals
        : leaderboard[0].contributions
      : 1
  );

  // SVG Donut geometry
  const donutSize = 216;
  const donutCenter = donutSize / 2;
  const donutRadius = 78;
  const donutStroke = 22;
  const circumference = 2 * Math.PI * donutRadius;

  const segments: {
    key: OutcomeSegmentKey;
    label: string;
    count: number;
    pct: number;
    color: string;
    glow: string;
    fraction: number;
  }[] = [
    {
      key: 'wins',
      label: 'فوز',
      count: data.wins,
      pct: winRate,
      color: '#2B66FF',
      glow: 'rgba(43, 102, 255, 0.55)',
      fraction: data.played > 0 ? data.wins / data.played : 0,
    },
    {
      key: 'draws',
      label: 'تعادل',
      count: data.draws,
      pct: drawRate,
      color: '#7DD3FC',
      glow: 'rgba(125, 211, 252, 0.45)',
      fraction: data.played > 0 ? data.draws / data.played : 0,
    },
    {
      key: 'losses',
      label: 'خسارة',
      count: data.losses,
      pct: lossRate,
      color: '#FB7185',
      glow: 'rgba(251, 113, 133, 0.45)',
      fraction: data.played > 0 ? data.losses / data.played : 0,
    },
  ];

  let accumulatedOffset = 0;
  const nonZeroCount = segments.filter((s) => s.count > 0).length;
  const donutSegments = segments.map((seg) => {
    const length = seg.fraction * circumference;
    const gap = seg.count > 0 && nonZeroCount > 1 ? 6 : 0;
    const dashLength = Math.max(0, length - gap);
    const dashOffset = -accumulatedOffset;
    accumulatedOffset += length;
    return { ...seg, dashLength, dashOffset };
  });

  const activeOutcomeInfo = hoveredOutcome
    ? segments.find((s) => s.key === hoveredOutcome)
    : null;

  // Bar + Trend Chart Geometry
  const timeline = data.goalTimeline;
  const maxBarValue = Math.max(
    4,
    ...timeline.map((pt) => Math.max(pt.scored, pt.conceded))
  );
  const chartHeight = 205;
  const chartWidth = 540;
  const padTop = 24;
  const padBottom = 36;
  const padX = 28;
  const plotHeight = chartHeight - padTop - padBottom;
  const plotWidth = chartWidth - padX * 2;
  const slotWidth = plotWidth / Math.max(1, timeline.length);

  const trendPoints = timeline.map((pt, idx) => {
    const cx = padX + slotWidth * idx + slotWidth / 2;
    const cy = padTop + plotHeight - (pt.scored / maxBarValue) * plotHeight;
    return { cx, cy, pt };
  });

  const trendPath = trendPoints
    .map((p, idx) => {
      if (idx === 0) return `M ${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`;
      const prev = trendPoints[idx - 1];
      const midX = ((prev.cx + p.cx) / 2).toFixed(1);
      return `C ${midX} ${prev.cy.toFixed(1)}, ${midX} ${p.cy.toFixed(1)}, ${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`;
    })
    .join(' ');

  const highlightedBar =
    activeBarIndex !== null && timeline[activeBarIndex]
      ? timeline[activeBarIndex]
      : null;

  const firstHalfPct =
    data.goalsFor > 0 ? Math.round((data.firstHalfGoals / data.goalsFor) * 100) : 50;
  const secondHalfPct = 100 - firstHalfPct;
  const openPlayPct =
    data.goalsFor > 0 ? Math.round((data.openPlayGoals / data.goalsFor) * 100) : 75;
  const setPiecePct = 100 - openPlayPct;

  const homeWinPct =
    data.homeRecord.played > 0
      ? Math.round((data.homeRecord.wins / data.homeRecord.played) * 100)
      : 0;
  const awayWinPct =
    data.awayRecord.played > 0
      ? Math.round((data.awayRecord.wins / data.awayRecord.played) * 100)
      : 0;

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header & Competition Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <span className="text-xs font-bold tracking-wide text-blue-300">
              تحليلات وأرقام الزعيم · موسم 2026/2027
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1B4BFF]/30 border border-blue-400/35 text-blue-100 tabular-nums">
              {data.standingBadge}
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            إحصائيات الموسم الحالي
          </h1>
          <p className="text-xs sm:text-sm text-white/65 mt-1">{data.subtitle}</p>
        </div>

        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0"
          role="tablist"
          aria-label="تصفية حسب البطولة"
        >
          {COMPETITIONS.map((comp) => {
            const isActive = competition === comp.key;
            return (
              <button
                key={comp.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setCompetition(comp.key);
                  setActiveBarIndex(null);
                  setHoveredOutcome(null);
                }}
                className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0E1A5C] shadow-[0_6px_22px_rgba(255,255,255,0.22)]'
                    : 'bg-white/10 text-white/75 hover:bg-white/16 hover:text-white'
                }`}
              >
                {comp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 4 Primary KPI Metrics (Goals, Wins, Draws, Losses) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          key={`goals-${competition}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4BFF]/35 via-[#11247A]/80 to-[#0A144A]/90 border border-blue-400/30 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-200">عدد الأهداف</span>
            <span className="w-8 h-8 rounded-xl bg-[#1B4BFF]/30 text-blue-200 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
              {data.goalsFor}
            </span>
            <span className="text-xs font-semibold text-blue-300 tabular-nums">هدفاً</span>
          </div>
          <p className="text-[11px] text-white/65 mt-2 tabular-nums">
            بمعدل <span className="text-white font-bold">{goalsPerGame}</span> هدف/مباراة · فارق{' '}
            <span className="text-emerald-300 font-bold">+{goalDiff}</span>
          </p>
        </motion.div>

        <motion.div
          key={`wins-${competition}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.04 }}
          className="rounded-2xl bg-[#0B1652]/80 border border-white/12 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/75">الفوز</span>
            <span className="w-8 h-8 rounded-xl bg-[#2B66FF]/25 text-blue-300 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
              {data.wins}
            </span>
            <span className="text-xs font-bold text-[#6EA0FF] tabular-nums">
              ({winRate}%)
            </span>
          </div>
          <p className="text-[11px] text-white/60 mt-2 tabular-nums">
            من أصل {data.played} مباراة في {data.label}
          </p>
        </motion.div>

        <motion.div
          key={`draws-${competition}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          className="rounded-2xl bg-[#0B1652]/80 border border-white/12 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/75">التعادل</span>
            <span className="w-8 h-8 rounded-xl bg-sky-400/18 text-sky-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
              {data.draws}
            </span>
            <span className="text-xs font-bold text-sky-300 tabular-nums">
              ({drawRate}%)
            </span>
          </div>
          <p className="text-[11px] text-white/60 mt-2 tabular-nums">
            الشباك النظيفة{' '}
            <span className="text-white font-bold">
              {data.cleanSheets} ({cleanSheetRate}%)
            </span>
          </p>
        </motion.div>

        <motion.div
          key={`losses-${competition}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.12 }}
          className="rounded-2xl bg-[#0B1652]/80 border border-white/12 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/75">الخسارة</span>
            <span className="w-8 h-8 rounded-xl bg-rose-500/18 text-rose-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
              {data.losses}
            </span>
            <span className="text-xs font-bold text-rose-300 tabular-nums">
              ({lossRate}%)
            </span>
          </div>
          <p className="text-[11px] text-white/60 mt-2 tabular-nums">
            استقبل <span className="text-white font-bold">{data.goalsAgainst}</span> · معدل{' '}
            <span className="text-white font-bold">{concededPerGame}</span>/مباراة
          </p>
        </motion.div>
      </div>

      {/* Primary Charts Row: Outcome Donut + Goals Scored vs Conceded Bar/Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Chart 1: Interactive Outcome Donut Chart (Wins / Draws / Losses) */}
        <section className="lg:col-span-5 rounded-3xl bg-[#0B1550]/85 border border-white/12 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">
                توزيع نتائج المباريات
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                الفوز والتعادل والخسارة · {data.played} مباراة
              </p>
            </div>
            {/* Recent Form Indicators */}
            <div className="flex items-center gap-1" aria-label="آخر النتائج">
              {data.recentForm.map((res, idx) => (
                <span
                  key={idx}
                  title={res === 'W' ? 'فوز' : res === 'D' ? 'تعادل' : 'خسارة'}
                  className={`w-6 h-6 rounded-md text-[10px] font-extrabold flex items-center justify-center ${
                    res === 'W'
                      ? 'bg-[#1B4BFF] text-white'
                      : res === 'D'
                        ? 'bg-sky-400/25 text-sky-200 border border-sky-300/30'
                        : 'bg-rose-500/25 text-rose-200 border border-rose-400/30'
                  }`}
                >
                  {res === 'W' ? 'ف' : res === 'D' ? 'ت' : 'خ'}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg
                width={donutSize}
                height={donutSize}
                viewBox={`0 0 ${donutSize} ${donutSize}`}
                className="overflow-visible"
                role="img"
                aria-label={`مخطط دائري للنتائج: ${data.wins} فوز، ${data.draws} تعادل، ${data.losses} خسارة`}
              >
                <circle
                  cx={donutCenter}
                  cy={donutCenter}
                  r={donutRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={donutStroke}
                />

                <g transform={`rotate(-90 ${donutCenter} ${donutCenter})`}>
                  {donutSegments.map((seg) => {
                    if (seg.count === 0) return null;
                    const isHighlighted = hoveredOutcome === seg.key;
                    const isDimmed = hoveredOutcome !== null && !isHighlighted;
                    return (
                      <motion.circle
                        key={`${competition}-${seg.key}`}
                        cx={donutCenter}
                        cy={donutCenter}
                        r={donutRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHighlighted ? donutStroke + 4 : donutStroke}
                        strokeLinecap="round"
                        strokeDasharray={`${seg.dashLength} ${circumference}`}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                          strokeDashoffset: seg.dashOffset,
                          opacity: isDimmed ? 0.35 : 1,
                        }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          filter: isHighlighted
                            ? `drop-shadow(0 0 12px ${seg.glow})`
                            : undefined,
                        }}
                        className="cursor-pointer transition-[stroke-width]"
                        onMouseEnter={() => setHoveredOutcome(seg.key)}
                        onMouseLeave={() => setHoveredOutcome(null)}
                        onClick={() =>
                          setHoveredOutcome((prev) => (prev === seg.key ? null : seg.key))
                        }
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Center Live Metric */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-white tabular-nums leading-none">
                  {activeOutcomeInfo ? `${activeOutcomeInfo.pct}%` : `${winRate}%`}
                </span>
                <span className="text-xs font-bold text-blue-200 mt-1.5">
                  {activeOutcomeInfo ? activeOutcomeInfo.label : 'نسبة الفوز'}
                </span>
                <span className="text-[11px] text-white/55 tabular-nums mt-0.5">
                  {activeOutcomeInfo
                    ? `${activeOutcomeInfo.count} من ${data.played}`
                    : `${data.wins} انتصار`}
                </span>
              </div>
            </div>

            {/* Interactive Legend */}
            <div className="w-full sm:w-auto flex-1 space-y-2.5">
              {segments.map((seg) => {
                const isSelected = hoveredOutcome === seg.key;
                return (
                  <button
                    key={seg.key}
                    type="button"
                    onMouseEnter={() => setHoveredOutcome(seg.key)}
                    onMouseLeave={() => setHoveredOutcome(null)}
                    onClick={() =>
                      setHoveredOutcome((prev) => (prev === seg.key ? null : seg.key))
                    }
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/12 border-white/30'
                        : 'bg-white/[0.04] border-white/8 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-xs font-bold text-white">{seg.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="font-display font-black text-base text-white">
                        {seg.count}
                      </span>
                      <span className="text-[11px] text-white/60 w-9 text-left">
                        {seg.pct}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Chart 2: Goals Scored vs Conceded Grouped Bar + Smooth Trend SVG Chart */}
        <section className="lg:col-span-7 rounded-3xl bg-[#0B1550]/85 border border-white/12 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4C82FF]" />
                <span>الأهداف المسجلة مقابل المستقبلة</span>
              </h2>
              <p className="text-xs text-white/65 mt-0.5">
                {highlightedBar
                  ? `${highlightedBar.label}: سجل ${highlightedBar.scored} · استقبل ${highlightedBar.conceded} — ${highlightedBar.opponent}`
                  : 'مرر أو اضغط على أي عمود لعرض نتائج المرحلة بالتفصيل'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-blue-200">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2B66FF]" />
                مسجلة ({data.goalsFor})
              </span>
              <span className="flex items-center gap-1.5 text-white/70">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400/80" />
                مستقبلة ({data.goalsAgainst})
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full min-w-[340px] h-auto overflow-visible"
              role="img"
              aria-label="مخطط أعمدة للأهداف المسجلة والمستقبلة عبر مراحل الموسم"
            >
              <defs>
                <linearGradient id="hilalGoalBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4C82FF" />
                  <stop offset="100%" stopColor="#1B4BFF" />
                </linearGradient>
                <linearGradient id="hilalConcededBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB7185" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#E11D48" stopOpacity="0.55" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padTop + plotHeight * (1 - ratio);
                const val = Math.round(maxBarValue * ratio);
                return (
                  <g key={idx}>
                    <line
                      x1={padX}
                      x2={chartWidth - padX}
                      y1={y}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray={ratio === 0 ? undefined : '3 4'}
                    />
                    <text
                      x={padX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-white/40 text-[10px] font-semibold tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {timeline.map((pt, idx) => {
                const cx = padX + slotWidth * idx + slotWidth / 2;
                const scoredH = (pt.scored / maxBarValue) * plotHeight;
                const concededH = (pt.conceded / maxBarValue) * plotHeight;
                const barW = Math.min(30, slotWidth * 0.26);
                const isSelected = activeBarIndex === idx;

                return (
                  <g
                    key={`${competition}-${pt.label}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveBarIndex(idx)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                    onClick={() =>
                      setActiveBarIndex((prev) => (prev === idx ? null : idx))
                    }
                  >
                    <rect
                      x={cx - slotWidth * 0.42}
                      y={padTop - 6}
                      width={slotWidth * 0.84}
                      height={plotHeight + 12}
                      rx={10}
                      fill={isSelected ? 'rgba(255,255,255,0.07)' : 'transparent'}
                    />

                    <motion.rect
                      x={cx - barW - 3}
                      width={barW}
                      rx={6}
                      fill="url(#hilalGoalBarGrad)"
                      initial={{ y: padTop + plotHeight, height: 0 }}
                      animate={{
                        y: padTop + plotHeight - scoredH,
                        height: Math.max(4, scoredH),
                      }}
                      transition={{
                        duration: 0.55,
                        delay: idx * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                    <text
                      x={cx - barW / 2 - 3}
                      y={padTop + plotHeight - scoredH - 6}
                      textAnchor="middle"
                      className="fill-white text-[11px] font-extrabold tabular-nums"
                    >
                      {pt.scored}
                    </text>

                    <motion.rect
                      x={cx + 3}
                      width={barW}
                      rx={6}
                      fill="url(#hilalConcededBarGrad)"
                      initial={{ y: padTop + plotHeight, height: 0 }}
                      animate={{
                        y: padTop + plotHeight - concededH,
                        height: pt.conceded > 0 ? Math.max(4, concededH) : 2,
                      }}
                      transition={{
                        duration: 0.55,
                        delay: idx * 0.06 + 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                    {pt.conceded > 0 && (
                      <text
                        x={cx + barW / 2 + 3}
                        y={padTop + plotHeight - concededH - 6}
                        textAnchor="middle"
                        className="fill-rose-200 text-[10px] font-bold tabular-nums"
                      >
                        {pt.conceded}
                      </text>
                    )}

                    <text
                      x={cx}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      className={`text-[11px] font-semibold ${
                        isSelected ? 'fill-white' : 'fill-white/65'
                      }`}
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}

              {trendPoints.length > 1 && (
                <motion.path
                  key={`trend-${competition}`}
                  d={trendPath}
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.75 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="pointer-events-none"
                />
              )}
            </svg>
          </div>
        </section>
      </div>

      {/* Home vs Away Split Analytics Strip */}
      <section className="rounded-3xl bg-[#0B1550]/85 border border-white/12 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display font-extrabold text-lg text-white">
              الأداء على الأرض مقابل خارج الأرض
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              مقارنة سجل المملكة أرينا مقابل المباريات الخارجية في {data.label}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Record Card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#1B4BFF]/25 text-blue-200 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-display font-bold text-sm text-white">
                    على الأرض (المملكة أرينا)
                  </p>
                  <p className="text-[11px] text-white/55 tabular-nums">
                    {data.homeRecord.played} مباريات · {data.homeRecord.wins} فوز ·{' '}
                    {data.homeRecord.draws} تعادل · {data.homeRecord.losses} خسارة
                  </p>
                </div>
              </div>
              <span className="font-display font-black text-lg text-blue-200 tabular-nums">
                {data.homeRecord.played > 0 ? `${homeWinPct}%` : '—'}
              </span>
            </div>

            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                key={`home-bar-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${homeWinPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-l from-[#4C82FF] to-[#1B4BFF]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/70 tabular-nums">
              <span>
                سجّل <strong className="text-white">{data.homeRecord.goalsFor}</strong> هدفاً
              </span>
              <span>
                استقبل <strong className="text-white">{data.homeRecord.goalsAgainst}</strong>
              </span>
            </div>
          </div>

          {/* Away Record Card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-sky-400/18 text-sky-200 flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-display font-bold text-sm text-white">خارج الأرض</p>
                  <p className="text-[11px] text-white/55 tabular-nums">
                    {data.awayRecord.played} مباريات · {data.awayRecord.wins} فوز ·{' '}
                    {data.awayRecord.draws} تعادل · {data.awayRecord.losses} خسارة
                  </p>
                </div>
              </div>
              <span className="font-display font-black text-lg text-sky-200 tabular-nums">
                {data.awayRecord.played > 0 ? `${awayWinPct}%` : '—'}
              </span>
            </div>

            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                key={`away-bar-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${awayWinPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-l from-[#7DD3FC] to-[#2B66FF]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/70 tabular-nums">
              <span>
                سجّل <strong className="text-white">{data.awayRecord.goalsFor}</strong> هدفاً
              </span>
              <span>
                استقبل <strong className="text-white">{data.awayRecord.goalsAgainst}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row: Offensive Distribution Breakdown + Competition-Aware Top Scorers/Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Offensive & Tactical Efficiency Breakdown */}
        <section className="lg:col-span-5 rounded-3xl bg-[#0B1550]/85 border border-white/12 p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="font-display font-extrabold text-lg text-white">
              توزيع الأهداف والأداء الميداني
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              تحليل توقيت وأسلوب التسجيل ومؤشرات السيطرة في {data.label}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-blue-200 tabular-nums">
                الشوط الأول · {data.firstHalfGoals} ({firstHalfPct}%)
              </span>
              <span className="text-white tabular-nums">
                الشوط الثاني · {data.secondHalfGoals} ({secondHalfPct}%)
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
              <motion.div
                key={`h1-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${firstHalfPct}%` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[#4C82FF]"
              />
              <motion.div
                key={`h2-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${secondHalfPct}%` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[#1B4BFF] border-r border-[#0B1550]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-sky-200 tabular-nums">
                اللعب المفتوح · {data.openPlayGoals} ({openPlayPct}%)
              </span>
              <span className="text-white/80 tabular-nums">
                الكرات الثابتة · {data.setPieceGoals} ({setPiecePct}%)
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
              <motion.div
                key={`op-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${openPlayPct}%` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-l from-[#38BDF8] to-[#1B4BFF]"
              />
              <motion.div
                key={`sp-${competition}`}
                initial={{ width: 0 }}
                animate={{ width: `${setPiecePct}%` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-white/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
            <div className="rounded-2xl bg-white/[0.04] p-3 text-center">
              <p className="font-display font-black text-xl text-white tabular-nums">
                {data.avgPossession}%
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">متوسط الاستحواذ</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3 text-center">
              <p className="font-display font-black text-xl text-white tabular-nums">
                {data.passAccuracy}%
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">دقة التمرير</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3 text-center">
              <p className="font-display font-black text-xl text-white tabular-nums">
                {data.shotsPerGame}
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">تسديدة / مباراة</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3 text-center">
              <p className="font-display font-black text-xl text-white tabular-nums">
                {data.shotConversion}%
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">تحويل الفرص</p>
            </div>
          </div>
        </section>

        {/* Competition-Aware Top Scorers & Contributors Bar Chart */}
        <section className="lg:col-span-7 rounded-3xl bg-[#0B1550]/85 border border-white/12 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">
                {leaderboardMode === 'goals'
                  ? `هدافو الهلال في ${data.label}`
                  : `الأكثر مساهمة في ${data.label}`}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                تتحدث الأرقام تلقائياً حسب البطولة · اضغط على اللاعب لعرض ملفه
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-full bg-[#091246]/90 border border-white/10 self-start">
              <button
                type="button"
                onClick={() => setLeaderboardMode('goals')}
                className={`min-h-[32px] px-3 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                  leaderboardMode === 'goals'
                    ? 'bg-[#1B4BFF] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                الأهداف
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardMode('contributions')}
                className={`min-h-[32px] px-3 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                  leaderboardMode === 'contributions'
                    ? 'bg-[#1B4BFF] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                مساهمات (أ+ص)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const primaryVal =
                leaderboardMode === 'goals' ? entry.goals : entry.contributions;
              const barPct = Math.round((primaryVal / maxLeaderValue) * 100);
              return (
                <button
                  key={`${competition}-${leaderboardMode}-${entry.player.id}`}
                  type="button"
                  onClick={() => onSelectPlayer(entry.player)}
                  className="w-full group flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.035] hover:bg-white/[0.09] border border-white/[0.07] transition-all text-right cursor-pointer"
                >
                  <span
                    className={`w-6 text-center font-display font-black text-sm tabular-nums ${
                      index === 0 ? 'text-blue-300' : 'text-white/45'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1B4BFF]/40 to-[#0A144A] overflow-hidden shrink-0 flex items-end justify-center border border-white/10">
                    <img
                      src={entry.player.image}
                      alt={entry.player.fullName}
                      className="h-10 w-auto object-contain object-bottom"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-display font-bold text-sm text-white truncate group-hover:text-blue-200 transition-colors">
                          {entry.player.fullName}
                        </span>
                        <span className="text-[11px] font-bold text-white/45 tabular-nums shrink-0">
                          #{entry.player.number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs tabular-nums">
                        {leaderboardMode === 'goals' ? (
                          <>
                            <span className="font-display font-black text-white">
                              {entry.goals} {entry.goals === 1 ? 'هدف' : 'أهداف'}
                            </span>
                            <span className="text-white/50 text-[11px]">
                              · {entry.assists} صناعة
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-display font-black text-white">
                              {entry.contributions} مساهمة
                            </span>
                            <span className="text-white/50 text-[11px]">
                              ({entry.goals}أ + {entry.assists}ص)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full bg-gradient-to-l from-[#4C82FF] to-[#1B4BFF]"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
