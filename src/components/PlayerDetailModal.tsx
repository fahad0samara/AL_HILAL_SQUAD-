import { Award, GitCompareArrows, Heart, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { PlayerProfile } from '../data/alHilalData';
import { RadarChart } from './RadarChart';

interface PlayerDetailModalProps {
  player: PlayerProfile | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCompare: (id: string) => void;
  onClose: () => void;
}

export function PlayerDetailModal({
  player,
  isFavorite,
  onToggleFavorite,
  onCompare,
  onClose,
}: PlayerDetailModalProps) {
  return (
    <AnimatePresence>
      {player && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-detail-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050A2B]/82 backdrop-blur-sm"
          />

          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:max-w-2xl max-h-[90svh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-[#0F1C63] border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,0.68)] text-white"
          >
            {/* Mobile Drag Handle */}
            <div className="md:hidden pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-white/25" />
            </div>

            {/* Hero Header */}
            <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row items-center sm:items-end gap-5 border-b border-white/10 bg-gradient-to-bl from-[#1E3EC4]/50 via-[#112070] to-[#0C1756]">
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-32 h-40 sm:w-36 sm:h-44 shrink-0">
                <div className="hilal-crest-mask w-full h-full overflow-hidden bg-gradient-to-b from-[#1A38B8]/60 via-[#0E1D6B] to-[#08103D] flex items-end justify-center">
                  <img
                    src={player.image}
                    alt={player.fullName}
                    referrerPolicy="no-referrer"
                    className={
                      player.isCutout
                        ? 'h-[95%] w-auto object-contain object-bottom'
                        : 'w-full h-full object-cover object-top'
                    }
                  />
                </div>
                <span className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-[#1B4BFF] border-2 border-[#0F1C63] text-white font-display font-black text-xl tabular-nums flex items-center justify-center shadow-lg">
                  {player.number}
                </span>
              </div>

              <div className="text-center sm:text-right flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold text-blue-200">
                    {player.positionLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[11px] font-extrabold text-amber-200 tabular-nums">
                    التقييم {player.marketRating} · {player.shortRole}
                  </span>
                </div>
                <h2
                  id="player-detail-title"
                  className="font-display font-black text-3xl sm:text-4xl text-white mt-1.5 leading-tight"
                >
                  {player.fullName}
                </h2>
                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-xs text-white/80">
                  <span>{player.nationality}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{player.age} عاماً</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{player.height}</span>
                  <span aria-hidden="true">·</span>
                  <span>القدم {player.preferredFoot}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">انضم {player.joinedYear}</span>
                </div>

                {player.category === 'players' && (
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(player.id)}
                      className={`min-h-[40px] px-4 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isFavorite
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/10 hover:bg-white/18 text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
                      <span>{isFavorite ? 'في المفضلة' : 'أضف للمفضلة'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCompare(player.id);
                        onClose();
                      }}
                      className="min-h-[40px] px-4 rounded-full bg-white text-[#0E1A5C] hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <GitCompareArrows className="w-3.5 h-3.5" />
                      <span>قارن مع لاعب آخر</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body Content */}
            <div className="p-5 sm:p-7 space-y-6">
              <p className="text-sm sm:text-[15px] leading-7 text-white/85">{player.bio}</p>

              {/* Position-Aware Season KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox
                  label={player.category === 'management' ? 'المباريات' : 'المشاركات'}
                  value={String(player.stats.appearances)}
                  accent="text-white"
                />
                {player.stats.cleanSheets !== undefined ? (
                  <>
                    <StatBox
                      label="شباك نظيفة"
                      value={String(player.stats.cleanSheets)}
                      accent="text-amber-300"
                    />
                    <StatBox
                      label="دقة التوزيع"
                      value={`${player.stats.passAccuracy}%`}
                      accent="text-sky-300"
                    />
                  </>
                ) : player.positionKey === 'defenders' ? (
                  <>
                    <StatBox
                      label="دقة التمرير"
                      value={`${player.stats.passAccuracy}%`}
                      accent="text-sky-300"
                    />
                    <StatBox
                      label="أهداف / صناعة"
                      value={`${player.stats.goals} / ${player.stats.assists}`}
                      accent="text-amber-300"
                    />
                  </>
                ) : (
                  <>
                    <StatBox
                      label={player.category === 'management' ? 'الأهداف المسجلة' : 'الأهداف'}
                      value={String(player.stats.goals)}
                      accent="text-amber-300"
                    />
                    <StatBox
                      label={player.category === 'management' ? 'الانتصارات' : 'التمريرات الحاسمة'}
                      value={String(player.stats.assists)}
                      accent="text-sky-300"
                    />
                  </>
                )}
                <StatBox
                  label="تقييم الموسم"
                  value={player.stats.rating}
                  accent="text-blue-200"
                />
              </div>

              {/* Calibrated SVG Hexagonal Radar + Tiered Numeric Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 sm:p-5">
                <RadarChart primary={player.attributes} size={235} />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white">
                      التحليل الفني التفصيلي
                    </h3>
                    <span className="text-[11px] font-semibold text-white/55 tabular-nums">
                      دقة التمرير {player.stats.passAccuracy}%
                    </span>
                  </div>
                  {player.attributes.map((attr) => {
                    const isElite = attr.value >= 90;
                    const isStrong = attr.value >= 82 && attr.value < 90;
                    return (
                      <div key={attr.label}>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-white/90">{attr.label}</span>
                          <span
                            className={`tabular-nums font-extrabold ${
                              isElite
                                ? 'text-amber-300'
                                : isStrong
                                  ? 'text-blue-300'
                                  : 'text-sky-200/80'
                            }`}
                          >
                            {attr.value}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            key={`${player.id}-${attr.label}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${attr.value}%` }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full ${
                              isElite
                                ? 'bg-gradient-to-l from-amber-300 to-amber-500'
                                : isStrong
                                  ? 'bg-gradient-to-l from-[#60A5FA] to-[#1B4BFF]'
                                  : 'bg-gradient-to-l from-sky-300/80 to-blue-500/75'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Honors */}
              <div>
                <h3 className="font-display font-bold text-sm text-white/75 mb-2.5 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>أبرز البطولات والإنجازات</span>
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-[13px] text-white/85">
                  {player.honors.map((honor, index) => (
                    <span key={honor} className="inline-flex items-center gap-3">
                      <span>{honor}</span>
                      {index < player.honors.length - 1 && (
                        <span className="text-white/35" aria-hidden="true">
                          /
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatBox({
  label,
  value,
  accent = 'text-white',
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-3.5 text-center">
      <div className={`font-display font-black text-2xl sm:text-3xl tabular-nums ${accent}`}>
        {value}
      </div>
      <div className="text-[11px] font-medium text-white/65 mt-1">{label}</div>
    </div>
  );
}
