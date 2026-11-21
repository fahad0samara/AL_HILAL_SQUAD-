import { useMemo } from 'react';
import { AL_HILAL_SQUAD, type PlayerProfile } from '../data/alHilalData';
import { RadarChart } from './RadarChart';

interface PlayerCompareProps {
  leftId: string;
  rightId: string;
  onChangeLeft: (id: string) => void;
  onChangeRight: (id: string) => void;
  onSelectPlayer: (player: PlayerProfile) => void;
}

export function PlayerCompare({
  leftId,
  rightId,
  onChangeLeft,
  onChangeRight,
  onSelectPlayer,
}: PlayerCompareProps) {
  const playerA =
    AL_HILAL_SQUAD.find((p) => p.id === leftId) ??
    AL_HILAL_SQUAD.find((p) => p.id === 'salem') ??
    AL_HILAL_SQUAD[0];
  const playerB =
    AL_HILAL_SQUAD.find((p) => p.id === rightId) ??
    AL_HILAL_SQUAD.find((p) => p.id === 'watkins') ??
    AL_HILAL_SQUAD[1];

  // Normalize 6 standard comparison axes for radar
  const radarPair = useMemo(() => {
    const labels = ['الأداء العام', 'الهجوم', 'التمرير', 'المراوغة', 'البدنية', 'الدفاع'];
    const build = (p: PlayerProfile) => {
      const vals = p.attributes.map((a) => a.value);
      return labels.map((label, i) => ({
        label,
        value: vals[i] ?? p.marketRating,
      }));
    };
    return { a: build(playerA), b: build(playerB) };
  }, [playerA, playerB]);

  const compareRows = [
    { label: 'التقييم الفني', a: playerA.marketRating, b: playerB.marketRating, suffix: '' },
    { label: 'تقييم الموسم', a: Number(playerA.stats.rating), b: Number(playerB.stats.rating), suffix: '' },
    { label: 'المشاركات', a: playerA.stats.appearances, b: playerB.stats.appearances, suffix: '' },
    { label: 'الأهداف', a: playerA.stats.goals, b: playerB.stats.goals, suffix: '' },
    { label: 'التمريرات الحاسمة', a: playerA.stats.assists, b: playerB.stats.assists, suffix: '' },
    { label: 'دقة التمرير', a: playerA.stats.passAccuracy, b: playerB.stats.passAccuracy, suffix: '%' },
  ];

  return (
    <div className="space-y-6">
      {/* Dual Player Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlayerPickerCard
          label="اللاعب الأول"
          accentClass="border-[#3B7BFF] bg-[#1B4BFF]/15"
          badgeClass="bg-[#1B4BFF]"
          player={playerA}
          onChange={onChangeLeft}
          onInspect={() => onSelectPlayer(playerA)}
        />
        <PlayerPickerCard
          label="اللاعب الثاني"
          accentClass="border-sky-400/70 bg-sky-400/10"
          badgeClass="bg-sky-500"
          player={playerB}
          onChange={onChangeRight}
          onInspect={() => onSelectPlayer(playerB)}
        />
      </div>

      {/* Comparison Visual Grid: Dual Radar + Head-to-Head Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] border border-white/10 p-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-6 text-xs font-bold mb-4">
            <span className="flex items-center gap-2 text-white">
              <span className="w-3 h-3 rounded-full bg-[#3B7BFF]" />
              {playerA.fullName}
            </span>
            <span className="flex items-center gap-2 text-white">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              {playerB.fullName}
            </span>
          </div>
          <RadarChart primary={radarPair.a} secondary={radarPair.b} size={255} />
        </div>

        <div className="lg:col-span-7 rounded-3xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-white">
            مقارنة أرقام موسم 2026/27
          </h3>
          <div className="space-y-4">
            {compareRows.map((row) => {
              const maxVal = Math.max(row.a, row.b, 1);
              const aPct = Math.round((row.a / maxVal) * 100);
              const bPct = Math.round((row.b / maxVal) * 100);
              const aWins = row.a > row.b;
              const bWins = row.b > row.a;

              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span
                      className={`font-display font-extrabold tabular-nums ${
                        aWins ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {row.a}
                      {row.suffix}
                    </span>
                    <span className="text-xs font-medium text-white/70">{row.label}</span>
                    <span
                      className={`font-display font-extrabold tabular-nums ${
                        bWins ? 'text-sky-300' : 'text-white/60'
                      }`}
                    >
                      {row.b}
                      {row.suffix}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden flex justify-start">
                      <div
                        className="h-full rounded-full bg-[#2A64FF]"
                        style={{ width: `${aPct}%` }}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden flex justify-end">
                      <div
                        className="h-full rounded-full bg-sky-400"
                        style={{ width: `${bPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerPickerCardProps {
  label: string;
  accentClass: string;
  badgeClass: string;
  player: PlayerProfile;
  onChange: (id: string) => void;
  onInspect: () => void;
}

function PlayerPickerCard({
  label,
  accentClass,
  badgeClass,
  player,
  onChange,
  onInspect,
}: PlayerPickerCardProps) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-4 ${accentClass}`}>
      <button
        type="button"
        onClick={onInspect}
        className="relative w-16 h-20 shrink-0 cursor-pointer"
        aria-label={`ملف ${player.fullName}`}
      >
        <div className="hilal-crest-mask w-full h-full overflow-hidden bg-[#0A1348]">
          <img
            src={player.image}
            alt={player.fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <span
          className={`absolute -bottom-1 -left-1 w-7 h-7 rounded-full ${badgeClass} text-white font-display font-black text-xs tabular-nums flex items-center justify-center shadow`}
        >
          {player.number}
        </span>
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-[11px] font-semibold text-white/65">{label}</div>
        <select
          value={player.id}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full h-10 px-3 rounded-xl bg-[#0B154E] border border-white/15 text-sm font-bold text-white focus:outline-none focus:border-white cursor-pointer"
        >
          {AL_HILAL_SQUAD.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#0B154E] text-white">
              #{p.number} · {p.fullName} ({p.positionLabel})
            </option>
          ))}
        </select>
        <div className="text-xs text-white/70 truncate">
          {player.nationality} · {player.age} عاماً · {player.height}
        </div>
      </div>
    </div>
  );
}
