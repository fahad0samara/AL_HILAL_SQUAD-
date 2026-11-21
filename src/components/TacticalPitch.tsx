import { useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { AL_HILAL_SQUAD, type PlayerProfile } from '../data/alHilalData';

type FormationKey = '3-5-2' | '4-2-3-1' | '4-3-3';

interface PitchSlot {
  slotId: string;
  role: string;
  x: number; // % from left
  y: number; // % from top
  defaultPlayerId: string;
}

const FORMATIONS: Record<FormationKey, { label: string; subtitle: string; slots: PitchSlot[] }> = {
  '3-5-2': {
    label: '3-5-2 · خطة إنزاغي',
    subtitle: 'التنظيم التكتيكي الأساسي للمدرب سيموني إنزاغي بثلاثي دفاع وجناحين خلفيين',
    slots: [
      { slotId: 'gk', role: 'GK', x: 50, y: 89, defaultPlayerId: 'bounou' },
      { slotId: 'rcb', role: 'RCB', x: 76, y: 73, defaultPlayerId: 'tambakti' },
      { slotId: 'cb', role: 'CB', x: 50, y: 75, defaultPlayerId: 'koulibaly' },
      { slotId: 'lcb', role: 'LCB', x: 24, y: 73, defaultPlayerId: 'akcicek' },
      { slotId: 'rwb', role: 'RWB', x: 84, y: 50, defaultPlayerId: 'martinelli' },
      { slotId: 'rcm', role: 'RCM', x: 66, y: 52, defaultPlayerId: 'savic' },
      { slotId: 'cdm', role: 'CDM', x: 50, y: 58, defaultPlayerId: 'neves' },
      { slotId: 'lcm', role: 'LCM', x: 34, y: 52, defaultPlayerId: 'kanno' },
      { slotId: 'lwb', role: 'LWB', x: 16, y: 50, defaultPlayerId: 'theo' },
      { slotId: 'rs', role: 'ST', x: 62, y: 21, defaultPlayerId: 'watkins' },
      { slotId: 'ls', role: 'SS', x: 38, y: 23, defaultPlayerId: 'salem' },
    ],
  },
  '4-2-3-1': {
    label: '4-2-3-1 · الهجومي',
    subtitle: 'ضغط عالٍ واستحواذ كامل بثنائي ارتكاز وصانع ألعاب حر خلف المهاجم',
    slots: [
      { slotId: 'gk', role: 'GK', x: 50, y: 89, defaultPlayerId: 'bounou' },
      { slotId: 'rb', role: 'RB', x: 82, y: 73, defaultPlayerId: 'tambakti' },
      { slotId: 'rcb', role: 'RCB', x: 61, y: 75, defaultPlayerId: 'koulibaly' },
      { slotId: 'lcb', role: 'LCB', x: 39, y: 75, defaultPlayerId: 'akcicek' },
      { slotId: 'lb', role: 'LB', x: 18, y: 73, defaultPlayerId: 'theo' },
      { slotId: 'rdm', role: 'CDM', x: 62, y: 56, defaultPlayerId: 'neves' },
      { slotId: 'ldm', role: 'CDM', x: 38, y: 56, defaultPlayerId: 'kanno' },
      { slotId: 'rw', role: 'RW', x: 80, y: 36, defaultPlayerId: 'martinelli' },
      { slotId: 'cam', role: 'CAM', x: 50, y: 38, defaultPlayerId: 'savic' },
      { slotId: 'lw', role: 'LW', x: 20, y: 36, defaultPlayerId: 'salem' },
      { slotId: 'st', role: 'ST', x: 50, y: 17, defaultPlayerId: 'watkins' },
    ],
  },
  '4-3-3': {
    label: '4-3-3 · المتوازن',
    subtitle: 'مثلث وسط قوي مع ثلاثي هجومي سريع على الأطراف والعمق',
    slots: [
      { slotId: 'gk', role: 'GK', x: 50, y: 89, defaultPlayerId: 'bounou' },
      { slotId: 'rb', role: 'RB', x: 82, y: 73, defaultPlayerId: 'tambakti' },
      { slotId: 'rcb', role: 'RCB', x: 61, y: 75, defaultPlayerId: 'koulibaly' },
      { slotId: 'lcb', role: 'LCB', x: 39, y: 75, defaultPlayerId: 'akcicek' },
      { slotId: 'lb', role: 'LB', x: 18, y: 73, defaultPlayerId: 'theo' },
      { slotId: 'rcm', role: 'CM', x: 68, y: 50, defaultPlayerId: 'savic' },
      { slotId: 'cdm', role: 'CDM', x: 50, y: 57, defaultPlayerId: 'neves' },
      { slotId: 'lcm', role: 'CM', x: 32, y: 50, defaultPlayerId: 'bouabre' },
      { slotId: 'rw', role: 'RW', x: 78, y: 24, defaultPlayerId: 'martinelli' },
      { slotId: 'st', role: 'ST', x: 50, y: 17, defaultPlayerId: 'watkins' },
      { slotId: 'lw', role: 'LW', x: 22, y: 24, defaultPlayerId: 'salem' },
    ],
  },
};

interface TacticalPitchProps {
  onSelectPlayer: (player: PlayerProfile) => void;
}

export function TacticalPitch({ onSelectPlayer }: TacticalPitchProps) {
  const [formation, setFormation] = useState<FormationKey>('3-5-2');
  const [customLineup, setCustomLineup] = useState<Record<string, string>>({});
  const [swapMode, setSwapMode] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const currentFormation = FORMATIONS[formation];

  const slotPlayers = useMemo(() => {
    const map: Record<string, PlayerProfile> = {};
    currentFormation.slots.forEach((slot) => {
      const pid = customLineup[`${formation}:${slot.slotId}`] ?? slot.defaultPlayerId;
      const found = AL_HILAL_SQUAD.find((p) => p.id === pid) ?? AL_HILAL_SQUAD[0];
      map[slot.slotId] = found;
    });
    return map;
  }, [currentFormation, customLineup, formation]);

  const startingIds = new Set(Object.values(slotPlayers).map((p) => p.id));
  const benchPlayers = AL_HILAL_SQUAD.filter((p) => !startingIds.has(p.id));

  const avgRating = (
    Object.values(slotPlayers).reduce((acc, p) => acc + p.marketRating, 0) /
    currentFormation.slots.length
  ).toFixed(1);

  const handleSlotTap = (slotId: string) => {
    if (!swapMode) {
      onSelectPlayer(slotPlayers[slotId]);
      return;
    }
    if (!selectedSlotId) {
      setSelectedSlotId(slotId);
      return;
    }
    if (selectedSlotId === slotId) {
      setSelectedSlotId(null);
      return;
    }
    const firstPlayer = slotPlayers[selectedSlotId];
    const secondPlayer = slotPlayers[slotId];
    setCustomLineup((prev) => ({
      ...prev,
      [`${formation}:${selectedSlotId}`]: secondPlayer.id,
      [`${formation}:${slotId}`]: firstPlayer.id,
    }));
    setSelectedSlotId(null);
  };

  const handleBenchSwap = (benchPlayer: PlayerProfile) => {
    if (!selectedSlotId) {
      onSelectPlayer(benchPlayer);
      return;
    }
    setCustomLineup((prev) => ({
      ...prev,
      [`${formation}:${selectedSlotId}`]: benchPlayer.id,
    }));
    setSelectedSlotId(null);
  };

  return (
    <div className="space-y-5">
      {/* Formation Switcher & Swap Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {(Object.keys(FORMATIONS) as FormationKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFormation(key);
                setSelectedSlotId(null);
              }}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                formation === key
                  ? 'bg-white text-[#0E1A5C]'
                  : 'bg-white/10 text-white/75 hover:bg-white/18'
              }`}
            >
              {FORMATIONS[key].label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setSwapMode((v) => !v);
            setSelectedSlotId(null);
          }}
          className={`min-h-[40px] px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto ${
            swapMode
              ? 'bg-[#1B4BFF] text-white shadow-[0_6px_20px_rgba(27,75,255,0.45)]'
              : 'bg-white/10 text-white/80 hover:bg-white/18'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{swapMode ? 'وضع التبديل مفعّل' : 'تبديل المراكز والاحتياط'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Royal Blue Kingdom Arena Pitch */}
        <div className="lg:col-span-8 relative rounded-3xl border border-white/12 bg-gradient-to-b from-[#132988] via-[#102272] to-[#0B1756] overflow-hidden shadow-[0_24px_60px_rgba(4,9,36,0.55)] aspect-[4/5] sm:aspect-[16/13]">
          {/* Subtle mowed grass stripes */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 38px, transparent 38px, transparent 76px)',
            }}
          />

          {/* SVG Pitch Markings */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="92" height="92" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.35)" />
            {/* Top Penalty Box */}
            <rect x="24" y="4" width="52" height="16" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            <rect x="37" y="4" width="26" height="6.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            {/* Bottom Penalty Box */}
            <rect x="24" y="80" width="52" height="16" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
            <rect x="37" y="89.5" width="26" height="6.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.4" />
          </svg>

          {/* Player Nodes */}
          {currentFormation.slots.map((slot) => {
            const player = slotPlayers[slot.slotId];
            const isSelected = selectedSlotId === slot.slotId;
            return (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => handleSlotTap(slot.slotId)}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus-visible:outline-2 focus-visible:outline-white rounded-xl"
              >
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-b from-[#2045C8] to-[#0A144A] border-2 transition-transform duration-200 group-hover:scale-110 ${
                    isSelected
                      ? 'border-amber-400 scale-110 ring-4 ring-amber-400/30'
                      : 'border-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <img
                    src={player.image}
                    alt={player.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top scale-110"
                  />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-[#091244]/90 border border-white/12 text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap shadow">
                  <span className="text-blue-300 tabular-nums ml-1">{player.number}</span>
                  {player.lastName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tactical Summary + Bench */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-200">متوسط قوة التشكيلة</span>
              <span className="font-display font-black text-2xl text-white tabular-nums">
                {avgRating}
              </span>
            </div>
            <p className="text-xs leading-6 text-white/75">{currentFormation.subtitle}</p>
            <p className="text-[11px] text-blue-200/80">
              {swapMode
                ? selectedSlotId
                  ? 'اختر لاعباً آخر في الملعب أو من دكة البدلاء للتبديل'
                  : 'انقر على أي لاعب في الملعب لتحديد مركزه للتبديل'
                : 'انقر على أي لاعب على أرضية الملعب لاستعراض ملفه الإحصائي الكامل'}
            </p>
          </div>

          <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 space-y-3">
            <h3 className="font-display font-bold text-sm text-white">
              دكة البدلاء ({benchPlayers.length})
            </h3>
            <div className="space-y-2">
              {benchPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleBenchSwap(player)}
                  className="w-full min-h-[54px] px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.11] border border-white/[0.07] flex items-center justify-between gap-3 transition-colors cursor-pointer text-right"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={player.image}
                      alt={player.fullName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover object-top border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm text-white truncate">
                        {player.fullName}
                      </div>
                      <div className="text-[11px] text-white/60">{player.positionLabel}</div>
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-[#1B4BFF] text-white font-display font-bold text-xs tabular-nums flex items-center justify-center shrink-0">
                    {player.number}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
