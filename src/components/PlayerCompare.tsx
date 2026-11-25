import { useMemo, useState } from 'react';
import { ArrowLeftRight, BarChart3, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { AL_HILAL_SQUAD, type PlayerProfile } from '../data/alHilalData';
import { RadarChart, type RadarAxis } from './RadarChart';

interface PlayerCompareProps {
  leftId: string;
  rightId: string;
  onChangeLeft: (id: string) => void;
  onChangeRight: (id: string) => void;
  onSelectPlayer: (player: PlayerProfile) => void;
}

interface PlayerColorPalette {
  id: string;
  nameAr: string;
  hueGroup: 'cool' | 'warm' | 'green' | 'purple';
  stroke: string;
  fill: string;
  text: string;
  badgeText: string;
  barStart: string;
  barEnd: string;
  cardTint: string;
  border: string;
  glow: string;
}

// High-contrast, distinct signature colors engineered for dark royal sapphire surfaces
const DISTINCT_PALETTES: PlayerColorPalette[] = [
  {
    id: 'cyan',
    nameAr: 'سماوي مشرق',
    hueGroup: 'cool',
    stroke: '#06B6D4',
    fill: 'rgba(6, 182, 212, 0.30)',
    text: '#67E8F9',
    badgeText: '#06283D',
    barStart: '#67E8F9',
    barEnd: '#0891B2',
    cardTint: 'rgba(6, 182, 212, 0.16)',
    border: 'rgba(34, 211, 238, 0.62)',
    glow: 'rgba(6, 182, 212, 0.55)',
  },
  {
    id: 'gold',
    nameAr: 'ذهبي ملكي',
    hueGroup: 'warm',
    stroke: '#F59E0B',
    fill: 'rgba(245, 158, 11, 0.28)',
    text: '#FDE68A',
    badgeText: '#1F1300',
    barStart: '#FDE68A',
    barEnd: '#D97706',
    cardTint: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(251, 191, 36, 0.62)',
    glow: 'rgba(245, 158, 11, 0.55)',
  },
  {
    id: 'emerald',
    nameAr: 'زمردي',
    hueGroup: 'green',
    stroke: '#10B981',
    fill: 'rgba(16, 185, 129, 0.28)',
    text: '#6EE7B7',
    badgeText: '#042F2E',
    barStart: '#6EE7B7',
    barEnd: '#059669',
    cardTint: 'rgba(16, 185, 129, 0.16)',
    border: 'rgba(52, 211, 153, 0.62)',
    glow: 'rgba(16, 185, 129, 0.55)',
  },
  {
    id: 'rose',
    nameAr: 'قرمزي حيوي',
    hueGroup: 'warm',
    stroke: '#F43F5E',
    fill: 'rgba(244, 63, 94, 0.28)',
    text: '#FDA4AF',
    badgeText: '#FFFFFF',
    barStart: '#FDA4AF',
    barEnd: '#E11D48',
    cardTint: 'rgba(244, 63, 94, 0.16)',
    border: 'rgba(251, 113, 133, 0.62)',
    glow: 'rgba(244, 63, 94, 0.55)',
  },
  {
    id: 'violet',
    nameAr: 'بنفسجي مضيء',
    hueGroup: 'purple',
    stroke: '#A855F7',
    fill: 'rgba(168, 85, 247, 0.30)',
    text: '#E9D5FF',
    badgeText: '#FFFFFF',
    barStart: '#D8B4FE',
    barEnd: '#7E22CE',
    cardTint: 'rgba(168, 85, 247, 0.17)',
    border: 'rgba(192, 132, 252, 0.62)',
    glow: 'rgba(168, 85, 247, 0.55)',
  },
  {
    id: 'orange',
    nameAr: 'برتقالي ناري',
    hueGroup: 'warm',
    stroke: '#F97316',
    fill: 'rgba(249, 115, 22, 0.28)',
    text: '#FDBA74',
    badgeText: '#1F0F00',
    barStart: '#FDBA74',
    barEnd: '#EA580C',
    cardTint: 'rgba(249, 115, 22, 0.16)',
    border: 'rgba(251, 146, 60, 0.62)',
    glow: 'rgba(249, 115, 22, 0.55)',
  },
  {
    id: 'lime',
    nameAr: 'ليموني ساطع',
    hueGroup: 'green',
    stroke: '#84CC16',
    fill: 'rgba(132, 204, 22, 0.26)',
    text: '#D9F99D',
    badgeText: '#142600',
    barStart: '#BEF264',
    barEnd: '#65A30D',
    cardTint: 'rgba(132, 204, 22, 0.15)',
    border: 'rgba(163, 230, 53, 0.62)',
    glow: 'rgba(132, 204, 22, 0.5)',
  },
  {
    id: 'magenta',
    nameAr: 'فوشيا ساطع',
    hueGroup: 'purple',
    stroke: '#EC4899',
    fill: 'rgba(236, 72, 153, 0.28)',
    text: '#FBCFE8',
    badgeText: '#FFFFFF',
    barStart: '#F9A8D4',
    barEnd: '#DB2777',
    cardTint: 'rgba(236, 72, 153, 0.16)',
    border: 'rgba(244, 114, 182, 0.62)',
    glow: 'rgba(236, 72, 153, 0.55)',
  },
];

// Deterministic per-player signature color index
function getPlayerPaletteIndex(playerId: string): number {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = (hash * 31 + playerId.charCodeAt(i)) % 997;
  }
  return hash % DISTINCT_PALETTES.length;
}

// Guarantees both players get unique, high-contrast colors that never belong to the same hue family
function resolveContrastingPalettes(
  idA: string,
  idB: string
): [PlayerColorPalette, PlayerColorPalette] {
  const idxA = getPlayerPaletteIndex(idA);
  const palA = DISTINCT_PALETTES[idxA];

  let idxB = getPlayerPaletteIndex(idB);
  if (
    idxB === idxA ||
    DISTINCT_PALETTES[idxB].hueGroup === palA.hueGroup
  ) {
    // Pick the first palette with a completely different hue family starting 3 slots away
    for (let step = 1; step <= DISTINCT_PALETTES.length; step++) {
      const candidateIdx = (idxB + step + 2) % DISTINCT_PALETTES.length;
      if (
        candidateIdx !== idxA &&
        DISTINCT_PALETTES[candidateIdx].hueGroup !== palA.hueGroup
      ) {
        idxB = candidateIdx;
        break;
      }
    }
  }

  return [palA, DISTINCT_PALETTES[idxB]];
}

// Semantic radar profile builder so every position (GK/DF/MF/FW) produces a true, distinct shape
function buildNormalizedRadar(player: PlayerProfile): RadarAxis[] {
  const findAttr = (keywords: string[]): number | null => {
    const match = player.attributes.find((a) =>
      keywords.some((kw) => a.label.includes(kw))
    );
    return match ? match.value : null;
  };

  const pos = player.positionKey;
  const rating = player.marketRating;

  const attack =
    findAttr(['التسديد', 'الإنهاء']) ??
    (pos === 'forwards'
      ? rating - 2
      : pos === 'midfielders'
        ? Math.max(66, rating - 10)
        : pos === 'defenders'
          ? Math.max(48, rating - 32)
          : 40);

  const passing =
    findAttr(['التمرير', 'التوزيع', 'العرضيات', 'الرؤية', 'صناعة']) ??
    player.stats.passAccuracy;

  const dribbling =
    findAttr(['المراوغة', 'التحكم', 'الرشاقة', 'المرونة']) ??
    (pos === 'forwards'
      ? rating - 3
      : pos === 'midfielders'
        ? rating - 4
        : pos === 'defenders'
          ? Math.max(58, rating - 18)
          : 54);

  const pace =
    findAttr(['السرعة', 'التحرك', 'ردة الفعل']) ??
    (pos === 'forwards'
      ? rating - 2
      : pos === 'defenders'
        ? Math.max(70, rating - 6)
        : pos === 'midfielders'
          ? Math.max(72, rating - 8)
          : 62);

  const physical =
    findAttr(['البدنية', 'اللياقة', 'الرأسيات', 'الكرات العالية']) ??
    Math.max(68, rating - 6);

  const defense =
    findAttr(['الدفاع', 'الافتكاك', 'التمركز', 'الضغط']) ??
    (pos === 'goalkeepers'
      ? rating + 2
      : pos === 'defenders'
        ? rating + 1
        : pos === 'midfielders'
          ? Math.max(66, rating - 10)
          : Math.max(44, rating - 38));

  const clamp = (n: number) => Math.max(38, Math.min(98, Math.round(n)));

  return [
    { label: 'الهجوم', value: clamp(attack) },
    { label: 'التمرير', value: clamp(passing) },
    { label: 'المهارة', value: clamp(dribbling) },
    { label: 'السرعة', value: clamp(pace) },
    { label: 'البدنية', value: clamp(physical) },
    { label: 'الدفاع', value: clamp(defense) },
  ];
}

export function PlayerCompare({
  leftId,
  rightId,
  onChangeLeft,
  onChangeRight,
  onSelectPlayer,
}: PlayerCompareProps) {
  const [hoveredAxisBar, setHoveredAxisBar] = useState<number | null>(null);

  const playerA =
    AL_HILAL_SQUAD.find((p) => p.id === leftId) ??
    AL_HILAL_SQUAD.find((p) => p.id === 'salem') ??
    AL_HILAL_SQUAD[0];
  const playerB =
    AL_HILAL_SQUAD.find((p) => p.id === rightId) ??
    AL_HILAL_SQUAD.find((p) => p.id === 'martinelli') ??
    AL_HILAL_SQUAD[1];

  // Dynamic unique & guaranteed high-contrast palette per selected player pair
  const [paletteA, paletteB] = useMemo(
    () => resolveContrastingPalettes(playerA.id, playerB.id),
    [playerA.id, playerB.id]
  );

  const radarPair = useMemo(
    () => ({
      a: buildNormalizedRadar(playerA),
      b: buildNormalizedRadar(playerB),
    }),
    [playerA, playerB]
  );

  const compareRows = useMemo(
    () => [
      {
        label: 'التقييم الفني (OVR)',
        a: playerA.marketRating,
        b: playerB.marketRating,
        suffix: '',
      },
      {
        label: 'تقييم الموسم',
        a: Number(playerA.stats.rating),
        b: Number(playerB.stats.rating),
        suffix: '',
      },
      {
        label: 'المشاركات',
        a: playerA.stats.appearances,
        b: playerB.stats.appearances,
        suffix: '',
      },
      {
        label: 'الأهداف المسجلة',
        a: playerA.stats.goals,
        b: playerB.stats.goals,
        suffix: '',
      },
      {
        label: 'التمريرات الحاسمة',
        a: playerA.stats.assists,
        b: playerB.stats.assists,
        suffix: '',
      },
      {
        label: 'إجمالي المساهمات',
        a: playerA.stats.goals + playerA.stats.assists,
        b: playerB.stats.goals + playerB.stats.assists,
        suffix: '',
      },
      {
        label: 'دقة التمرير',
        a: playerA.stats.passAccuracy,
        b: playerB.stats.passAccuracy,
        suffix: '%',
      },
    ],
    [playerA, playerB]
  );

  const summaryScore = useMemo(() => {
    let aScore = 0;
    let bScore = 0;
    for (const row of compareRows) {
      if (row.a > row.b) aScore++;
      else if (row.b > row.a) bScore++;
    }
    return { aScore, bScore };
  }, [compareRows]);

  const handleSwapPlayers = () => {
    onChangeLeft(playerB.id);
    onChangeRight(playerA.id);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header + Swap Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-blue-300 mb-0.5">
            التحليل المقارن · ألوان مميزة ومتباينة لكل لاعب
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            مقارنة اللاعبين وجهاً لوجه
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSwapPlayers}
          className="self-start sm:self-auto min-h-[40px] px-4 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: paletteB.text }} />
          <span>تبديل اللاعبين</span>
        </button>
      </div>

      {/* Dual Dynamic-Color Player Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlayerPickerCard
          label={`اللاعب الأول · ${paletteA.nameAr}`}
          palette={paletteA}
          player={playerA}
          winsCount={summaryScore.aScore}
          onChange={onChangeLeft}
          onInspect={() => onSelectPlayer(playerA)}
        />
        <PlayerPickerCard
          label={`اللاعب الثاني · ${paletteB.nameAr}`}
          palette={paletteB}
          player={playerB}
          winsCount={summaryScore.bScore}
          onChange={onChangeRight}
          onInspect={() => onSelectPlayer(playerB)}
        />
      </div>

      {/* Comparison Visual Grid: Unique-Color Dual Radar + Head-to-Head Season Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Dual Radar Card */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0B1550]/90 border border-white/12 p-5 sm:p-6 flex flex-col items-center justify-between">
          <div className="w-full space-y-3 mb-2">
            <h2 className="font-display font-extrabold text-base text-white text-center">
              مخطط القدرات الفنية المقارن
            </h2>

            {/* Per-Player Unique Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: paletteA.cardTint,
                  borderColor: paletteA.border,
                  color: paletteA.text,
                }}
              >
                <span
                  className="w-3 h-3 rounded-full ring-2 ring-white/85"
                  style={{ backgroundColor: paletteA.stroke }}
                />
                {playerA.fullName} (#{playerA.number})
              </span>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: paletteB.cardTint,
                  borderColor: paletteB.border,
                  color: paletteB.text,
                }}
              >
                <span
                  className="w-3 h-3 rounded-full ring-2 ring-white/85"
                  style={{ backgroundColor: paletteB.stroke }}
                />
                {playerB.fullName} (#{playerB.number})
              </span>
            </div>
          </div>

          <RadarChart
            primary={radarPair.a}
            secondary={radarPair.b}
            primaryLabel={playerA.lastName}
            secondaryLabel={playerB.lastName}
            primaryColor={paletteA.stroke}
            primaryFill={paletteA.fill}
            primaryTextColor={paletteA.text}
            secondaryColor={paletteB.stroke}
            secondaryFill={paletteB.fill}
            secondaryTextColor={paletteB.text}
            size={270}
          />

          <p className="text-[11px] text-white/55 text-center mt-2">
            مرر أو اضغط على أي محور لعرض القيم الدقيقة لكل لاعب
          </p>
        </div>

        {/* Head-to-Head Season Stat Bars Card */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0B1550]/90 border border-white/12 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
              مقارنة أرقام موسم 2026/27
            </h3>

            {/* Overall Advantage Readout */}
            <div className="flex items-center gap-2 text-xs font-bold tabular-nums px-3 py-1 rounded-full bg-white/[0.06] border border-white/10">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span style={{ color: paletteA.text }}>{summaryScore.aScore}</span>
              <span className="text-white/40">-</span>
              <span style={{ color: paletteB.text }}>{summaryScore.bScore}</span>
              <span className="text-white/65 font-medium">تفوق إحصائي</span>
            </div>
          </div>

          {/* Color-Coded Player Column Headers */}
          <div className="grid grid-cols-3 items-center text-xs font-bold pb-2 border-b border-white/10">
            <span
              className="text-right truncate flex items-center gap-1.5"
              style={{ color: paletteA.text }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: paletteA.stroke }}
              />
              <span className="truncate">{playerA.fullName}</span>
            </span>
            <span className="text-center text-white/50">المعيار</span>
            <span
              className="text-left truncate flex items-center justify-end gap-1.5"
              style={{ color: paletteB.text }}
            >
              <span className="truncate">{playerB.fullName}</span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: paletteB.stroke }}
              />
            </span>
          </div>

          <div className="space-y-4">
            {compareRows.map((row) => {
              const maxVal = Math.max(row.a, row.b, 1);
              const aPct = Math.round((row.a / maxVal) * 100);
              const bPct = Math.round((row.b / maxVal) * 100);
              const aWins = row.a > row.b;
              const bWins = row.b > row.a;

              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="grid grid-cols-3 items-center text-xs sm:text-sm">
                    <span
                      className="text-right font-display font-black tabular-nums transition-colors"
                      style={{
                        color: aWins ? paletteA.text : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {row.a}
                      {row.suffix}
                    </span>
                    <span className="text-center text-xs font-semibold text-white/80">
                      {row.label}
                    </span>
                    <span
                      className="text-left font-display font-black tabular-nums transition-colors"
                      style={{
                        color: bWins ? paletteB.text : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {row.b}
                      {row.suffix}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Player A Bar */}
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden flex justify-start">
                      <motion.div
                        key={`a-${playerA.id}-${row.label}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${aPct}%` }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to left, ${paletteA.barStart}, ${paletteA.barEnd})`,
                          opacity: aWins || row.a === row.b ? 1 : 0.48,
                          boxShadow: aWins ? `0 0 10px ${paletteA.glow}` : undefined,
                        }}
                      />
                    </div>

                    {/* Player B Bar */}
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden flex justify-end">
                      <motion.div
                        key={`b-${playerB.id}-${row.label}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bPct}%` }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${paletteB.barStart}, ${paletteB.barEnd})`,
                          opacity: bWins || row.a === row.b ? 1 : 0.48,
                          boxShadow: bWins ? `0 0 10px ${paletteB.glow}` : undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grouped Vertical Bar Chart: Side-by-Side Technical Attributes with Unique Player Colors */}
      <section className="rounded-3xl bg-[#0B1550]/90 border border-white/12 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: paletteA.text }} />
              <span>مخطط الأعمدة المقارن للقدرات الفنية</span>
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              {hoveredAxisBar !== null
                ? `${radarPair.a[hoveredAxisBar].label}: ${playerA.lastName} (${radarPair.a[hoveredAxisBar].value}) مقابل ${playerB.lastName} (${radarPair.b[hoveredAxisBar].value})`
                : 'مقارنة بصرية مباشرة لكل مهارة بلون خاص بكل لاعب'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5" style={{ color: paletteA.text }}>
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: paletteA.stroke }}
              />
              {playerA.lastName}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: paletteB.text }}>
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: paletteB.stroke }}
              />
              {playerB.lastName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 items-end pt-4">
          {radarPair.a.map((axisA, idx) => {
            const axisB = radarPair.b[idx];
            const isHovered = hoveredAxisBar === idx;
            const aHigher = axisA.value > axisB.value;
            const bHigher = axisB.value > axisA.value;

            return (
              <div
                key={axisA.label}
                onMouseEnter={() => setHoveredAxisBar(idx)}
                onMouseLeave={() => setHoveredAxisBar(null)}
                onClick={() =>
                  setHoveredAxisBar((prev) => (prev === idx ? null : idx))
                }
                className={`rounded-2xl p-3 border transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-white/[0.08] border-white/25'
                    : 'bg-white/[0.03] border-white/[0.06]'
                }`}
              >
                <div className="h-36 flex items-end justify-center gap-2.5 pb-1">
                  {/* Player A Vertical Column */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-7">
                    <span
                      className="text-[11px] font-black tabular-nums"
                      style={{ color: paletteA.text }}
                    >
                      {axisA.value}
                    </span>
                    <motion.div
                      key={`col-a-${playerA.id}-${axisA.label}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(16, axisA.value)}%` }}
                      transition={{
                        duration: 0.55,
                        delay: idx * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full rounded-t-lg"
                      style={{
                        background: `linear-gradient(to top, ${paletteA.barEnd}, ${paletteA.barStart})`,
                        boxShadow: aHigher ? `0 0 12px ${paletteA.glow}` : undefined,
                      }}
                    />
                  </div>

                  {/* Player B Vertical Column */}
                  <div className="flex flex-col items-center gap-1 h-full justify-end w-7">
                    <span
                      className="text-[11px] font-black tabular-nums"
                      style={{ color: paletteB.text }}
                    >
                      {axisB.value}
                    </span>
                    <motion.div
                      key={`col-b-${playerB.id}-${axisB.label}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(16, axisB.value)}%` }}
                      transition={{
                        duration: 0.55,
                        delay: idx * 0.04 + 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full rounded-t-lg"
                      style={{
                        background: `linear-gradient(to top, ${paletteB.barEnd}, ${paletteB.barStart})`,
                        boxShadow: bHigher ? `0 0 12px ${paletteB.glow}` : undefined,
                      }}
                    />
                  </div>
                </div>

                <p className="text-center text-xs font-bold text-white/85 mt-2 border-t border-white/10 pt-2">
                  {axisA.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface PlayerPickerCardProps {
  label: string;
  palette: PlayerColorPalette;
  player: PlayerProfile;
  winsCount: number;
  onChange: (id: string) => void;
  onInspect: () => void;
}

function PlayerPickerCard({
  label,
  palette,
  player,
  winsCount,
  onChange,
  onInspect,
}: PlayerPickerCardProps) {
  return (
    <div
      className="rounded-2xl border p-4 flex items-center gap-4 transition-all"
      style={{
        borderColor: palette.border,
        background: `linear-gradient(to left, ${palette.cardTint}, rgba(11, 21, 80, 0.88))`,
      }}
    >
      <button
        type="button"
        onClick={onInspect}
        className="relative w-16 h-20 shrink-0 cursor-pointer group"
        aria-label={`ملف ${player.fullName}`}
      >
        <div
          className="hilal-crest-mask w-full h-full overflow-hidden flex items-end justify-center"
          style={{
            background: `linear-gradient(to bottom, ${palette.fill}, #08103D)`,
          }}
        >
          <img
            src={player.image}
            alt={player.fullName}
            referrerPolicy="no-referrer"
            className={
              player.isCutout
                ? 'h-[95%] w-auto object-contain object-bottom group-hover:scale-105 transition-transform'
                : 'w-full h-full object-cover object-top'
            }
          />
        </div>
        <span
          className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full font-display font-black text-xs tabular-nums flex items-center justify-center shadow-md border border-[#0B1550]"
          style={{
            backgroundColor: palette.stroke,
            color: palette.badgeText,
          }}
        >
          {player.number}
        </span>
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-extrabold flex items-center gap-1.5"
            style={{ color: palette.text }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: palette.stroke }}
            />
            {label}
          </span>
          <span
            className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: palette.cardTint,
              color: palette.text,
            }}
          >
            تفوّق في {winsCount}
          </span>
        </div>

        <select
          value={player.id}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full h-10 px-3 rounded-xl bg-[#091246] border text-sm font-bold text-white focus:outline-none cursor-pointer"
          style={{ borderColor: palette.border }}
        >
          {AL_HILAL_SQUAD.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#091246] text-white">
              #{p.number} · {p.fullName} ({p.positionLabel})
            </option>
          ))}
        </select>

        <div className="text-xs text-white/75 truncate">
          {player.nationality} · {player.age} عاماً · {player.height} · القدم {player.preferredFoot}
        </div>
      </div>
    </div>
  );
}
