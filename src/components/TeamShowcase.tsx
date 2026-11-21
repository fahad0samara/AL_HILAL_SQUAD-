import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GitCompareArrows,
  Heart,
  LayoutGrid,
  Search,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AL_HILAL_MANAGEMENT,
  AL_HILAL_SQUAD,
  POSITION_FILTERS,
  type PlayerProfile,
  type PositionKey,
  type SquadCategory,
} from '../data/alHilalData';
import { PlayerCompare } from './PlayerCompare';
import { TacticalPitch } from './TacticalPitch';

export type TeamViewMode = 'carousel' | 'pitch' | 'compare';

interface TeamShowcaseProps {
  viewMode: TeamViewMode;
  onChangeViewMode: (mode: TeamViewMode) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparePair: [string, string];
  onChangeComparePair: (pair: [string, string]) => void;
  onSelectPlayer: (player: PlayerProfile) => void;
}

const SALEM_DEFAULT_INDEX = Math.max(
  0,
  AL_HILAL_SQUAD.findIndex((p) => p.id === 'salem')
);

export function TeamShowcase({
  viewMode,
  onChangeViewMode,
  favorites,
  onToggleFavorite,
  comparePair,
  onChangeComparePair,
  onSelectPlayer,
}: TeamShowcaseProps) {
  const [category, setCategory] = useState<SquadCategory>('players');
  const [position, setPosition] = useState<PositionKey>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(SALEM_DEFAULT_INDEX);
  const touchStartX = useRef<number | null>(null);

  const filteredList = useMemo(() => {
    let base = category === 'management' ? AL_HILAL_MANAGEMENT : AL_HILAL_SQUAD;
    if (category === 'players' && position !== 'all') {
      base = base.filter((p) => p.positionKey === position);
    }
    if (onlyFavorites) {
      base = base.filter((p) => favorites.includes(p.id));
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.shirtName.toLowerCase().includes(q) ||
          p.number.includes(q) ||
          p.nationality.toLowerCase().includes(q)
      );
    }
    return base;
  }, [category, position, onlyFavorites, favorites, searchQuery]);

  const safeIndex = filteredList.length > 0 ? activeIndex % filteredList.length : 0;
  const activePlayer = filteredList[safeIndex] ?? filteredList[0];

  const handleCategoryChange = (nextCategory: SquadCategory) => {
    setCategory(nextCategory);
    setPosition('all');
    setOnlyFavorites(false);
    setActiveIndex(nextCategory === 'players' ? SALEM_DEFAULT_INDEX : 0);
  };

  const handlePositionChange = (nextPos: PositionKey) => {
    setPosition(nextPos);
    setOnlyFavorites(false);
    if (nextPos === 'all') {
      setActiveIndex(SALEM_DEFAULT_INDEX);
    } else {
      setActiveIndex(0);
    }
  };

  const stepNext = useCallback(() => {
    if (filteredList.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredList.length);
  }, [filteredList.length]);

  const stepPrev = useCallback(() => {
    if (filteredList.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  }, [filteredList.length]);

  useEffect(() => {
    if (viewMode !== 'carousel') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') stepNext();
      else if (e.key === 'ArrowRight') stepPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepNext, stepPrev, viewMode]);

  const visibleSlots = useMemo(() => {
    const len = filteredList.length;
    if (len === 0) return [];
    if (len === 1) return [{ player: filteredList[0], offset: 0, realIndex: 0 }];
    if (len === 2) {
      const otherIdx = (safeIndex + 1) % 2;
      return [
        { player: filteredList[safeIndex], offset: 0, realIndex: safeIndex },
        { player: filteredList[otherIdx], offset: 1, realIndex: otherIdx },
      ];
    }
    if (len <= 4) {
      return [-1, 0, 1].map((offset) => {
        const realIndex = (safeIndex + offset + len) % len;
        return { player: filteredList[realIndex], offset, realIndex };
      });
    }
    return [-2, -1, 0, 1, 2].map((offset) => {
      const realIndex = (safeIndex + offset + len) % len;
      return { player: filteredList[realIndex], offset, realIndex };
    });
  }, [filteredList, safeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) stepNext();
      else stepPrev();
    }
    touchStartX.current = null;
  };

  const getSlotByOffset = (offset: number) =>
    visibleSlots.find((slot) => slot.offset === offset);

  const slotMinus2 = getSlotByOffset(-2);
  const slotMinus1 = getSlotByOffset(-1);
  const slotCenter = getSlotByOffset(0);
  const slotPlus1 = getSlotByOffset(1);
  const slotPlus2 = getSlotByOffset(2);

  return (
    <section className="relative w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 pb-24 md:pt-3 md:pb-10 flex flex-col justify-between min-h-[calc(100svh-5rem)]">
      {/* Top Prototype Filter Bar */}
      <div className="space-y-3 z-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Start side (Right in RTL): اللاعبون / الجهاز الفني + Sub-view Switch */}
          <div className="flex flex-wrap items-center gap-2">
            {viewMode === 'carousel' && (
              <div className="flex items-center gap-2" role="tablist" aria-label="تصنيف الفريق">
                <button
                  type="button"
                  role="tab"
                  aria-selected={category === 'players'}
                  onClick={() => handleCategoryChange('players')}
                  className={`min-h-[38px] px-5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    category === 'players'
                      ? 'bg-white text-[#0E1A5C] shadow-[0_6px_22px_rgba(255,255,255,0.22)]'
                      : 'bg-white/10 text-white/75 hover:bg-white/16 hover:text-white'
                  }`}
                >
                  اللاعبون
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={category === 'management'}
                  onClick={() => handleCategoryChange('management')}
                  className={`min-h-[38px] px-5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    category === 'management'
                      ? 'bg-white text-[#0E1A5C] shadow-[0_6px_22px_rgba(255,255,255,0.22)]'
                      : 'bg-white/10 text-white/75 hover:bg-white/16 hover:text-white'
                  }`}
                >
                  الجهاز الفني
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 p-1 rounded-full bg-[#091246]/70 border border-white/10">
              <button
                type="button"
                onClick={() => onChangeViewMode('carousel')}
                className={`min-h-[32px] px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'carousel'
                    ? 'bg-[#1B4BFF] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>المعرض</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('pitch')}
                className={`min-h-[32px] px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'pitch'
                    ? 'bg-[#1B4BFF] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>الملعب</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('compare')}
                className={`min-h-[32px] px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'compare'
                    ? 'bg-[#1B4BFF] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <GitCompareArrows className="w-3.5 h-3.5" />
                <span>مقارنة</span>
              </button>
            </div>
          </div>

          {/* End side (Left in RTL): Position Filters + Favorites + Search */}
          {viewMode === 'carousel' && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {category === 'players' &&
                POSITION_FILTERS.map((filter) => {
                  const isSelected = !onlyFavorites && position === filter.key;
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => handlePositionChange(filter.key)}
                      className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#0E1A5C] shadow-[0_6px_22px_rgba(255,255,255,0.22)]'
                          : 'bg-white/10 text-white/75 hover:bg-white/16 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}

              {category === 'players' && favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setOnlyFavorites((v) => !v);
                    setActiveIndex(0);
                  }}
                  aria-label="المفضلة"
                  className={`min-h-[38px] px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyFavorites
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/10 text-white/75 hover:bg-white/16'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
                  <span className="tabular-nums">{favorites.length}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  if (searchOpen) setSearchQuery('');
                }}
                aria-label="بحث عن لاعب"
                className={`min-w-[38px] min-h-[38px] rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                  searchOpen
                    ? 'bg-white text-[#0E1A5C]'
                    : 'bg-white/10 text-white/75 hover:bg-white/16'
                }`}
              >
                {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Collapsible Instant Search Input */}
        <AnimatePresence>
          {viewMode === 'carousel' && searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="max-w-md mr-auto lg:mr-0 lg:ml-auto"
            >
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="ابحث بالاسم أو رقم القميص أو الجنسية..."
                className="w-full h-11 px-4 rounded-full bg-[#091246]/90 border border-white/18 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode 2: Interactive Tactical Pitch */}
      {viewMode === 'pitch' && (
        <div className="mt-5 flex-1">
          <TacticalPitch onSelectPlayer={onSelectPlayer} />
        </div>
      )}

      {/* Mode 3: Head-to-Head Player Comparator */}
      {viewMode === 'compare' && (
        <div className="mt-5 flex-1">
          <PlayerCompare
            leftId={comparePair[0]}
            rightId={comparePair[1]}
            onChangeLeft={(id) => onChangeComparePair([id, comparePair[1]])}
            onChangeRight={(id) => onChangeComparePair([comparePair[0], id])}
            onSelectPlayer={onSelectPlayer}
          />
        </div>
      )}

      {/* Mode 1: Signature 5-Card Perspective Shield Carousel with REAL Al Hilal Cutouts */}
      {viewMode === 'carousel' && (
        <div
          className="relative flex-1 flex flex-col items-center justify-center my-2 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {filteredList.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-display font-bold text-lg text-white">
                لا توجد نتائج مطابقة للبحث
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setOnlyFavorites(false);
                  setPosition('all');
                }}
                className="min-h-[42px] px-5 rounded-full bg-white text-[#0E1A5C] text-xs font-bold cursor-pointer"
              >
                إعادة عرض جميع اللاعبين
              </button>
            </div>
          ) : (
            <>
              {/* Center Radial Spotlight Aura */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[580px] lg:h-[520px] rounded-full bg-[#2458FF]/30 blur-[95px]"
                aria-hidden="true"
              />

              {/* 5-Slot Symmetrical Stage */}
              <div className="relative w-full flex items-center justify-center gap-2 sm:gap-5 lg:gap-6 min-h-[440px] sm:min-h-[500px] lg:min-h-[550px]">
                {/* Outer Right Slot (-2) */}
                <div className="hidden lg:flex items-center justify-center w-[155px] shrink-0">
                  {slotMinus2 && (
                    <SideShieldCard
                      player={slotMinus2.player}
                      size="sm"
                      onClick={() => setActiveIndex(slotMinus2.realIndex)}
                    />
                  )}
                </div>

                {/* Inner Right Slot (-1) */}
                <div className="hidden sm:flex items-center justify-center w-[190px] lg:w-[225px] shrink-0">
                  {slotMinus1 && (
                    <SideShieldCard
                      player={slotMinus1.player}
                      size="md"
                      onClick={() => setActiveIndex(slotMinus1.realIndex)}
                    />
                  )}
                </div>

                {/* Dominant Center Hero — Real Transparent Cutout Popping Above the Curved Shield */}
                {slotCenter && (
                  <div className="relative flex items-center justify-center shrink-0 z-20">
                    {filteredList.length > 1 && (
                      <button
                        type="button"
                        onClick={stepPrev}
                        aria-label="اللاعب السابق"
                        className="sm:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#0A144A]/85 border border-white/15 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slotCenter.player.id}
                        initial={{ opacity: 0, scale: 0.95, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectPlayer(slotCenter.player)}
                          className="group relative w-[290px] h-[425px] sm:w-[335px] sm:h-[485px] lg:w-[370px] lg:h-[530px] flex items-end justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-3xl"
                          aria-label={`عرض ملف ${slotCenter.player.fullName}`}
                        >
                          {/* Layer 1 (Back): Smooth Heraldic Crest Shield Backdrop */}
                          <div
                            className="hilal-crest-mask pointer-events-none absolute inset-x-7 bottom-3 top-20 z-0 bg-gradient-to-b from-[#0A1348]/85 via-[#18319C]/55 to-[#0B154E]/95 shadow-[0_28px_70px_rgba(4,9,36,0.72)] transition-transform duration-300 group-hover:scale-[1.015]"
                            aria-hidden="true"
                          />
                          {/* Soft Stadium Spotlight Mist inside the Shield */}
                          <div
                            className="hilal-crest-mask pointer-events-none absolute inset-x-8 bottom-4 top-21 z-0 bg-[radial-gradient(ellipse_at_50%_68%,rgba(92,146,255,0.34),transparent_70%)]"
                            aria-hidden="true"
                          />

                          {/* Layer 2 (Behind Shoulder): Vibrant Royal Blue Jersey Number Circle (Matches Reference #18!) */}
                          <div
                            className="pointer-events-none absolute top-[22%] left-4 sm:left-5 z-10 w-[86px] h-[86px] sm:w-[100px] sm:h-[100px] rounded-full bg-gradient-to-br from-[#2B66FF] to-[#133CE0] shadow-[0_14px_40px_rgba(24,74,255,0.65)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                            aria-label={`رقم القميص ${slotCenter.player.number}`}
                          >
                            <span className="font-display font-black text-3xl sm:text-[42px] text-white tabular-nums tracking-tight leading-none pl-1">
                              {slotCenter.player.number}
                            </span>
                          </div>

                          {/* Layer 3 (Foreground): Real Official Cutout Popping Out Above the Shield! */}
                          {slotCenter.player.isCutout ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-3 top-0 z-20 flex items-end justify-center overflow-visible">
                              <img
                                src={slotCenter.player.image}
                                alt={slotCenter.player.fullName}
                                referrerPolicy="no-referrer"
                                className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_18px_28px_rgba(4,10,44,0.65)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                style={{
                                  maskImage:
                                    'linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.45) 89%, transparent 100%)',
                                  WebkitMaskImage:
                                    'linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.45) 89%, transparent 100%)',
                                }}
                              />
                            </div>
                          ) : (
                            <div className="hilal-crest-mask pointer-events-none absolute inset-x-7 bottom-3 top-14 z-20 overflow-hidden">
                              <img
                                src={slotCenter.player.image}
                                alt={slotCenter.player.fullName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                              />
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    'linear-gradient(to top, #0D185B 0%, rgba(13,24,91,0.85) 22%, rgba(13,24,91,0.12) 48%, transparent 72%)',
                                }}
                              />
                            </div>
                          )}

                          {/* Layer 4 (Top): Monumental Centered Arabic First + Last Name */}
                          <div className="relative z-30 w-full text-center pb-5 px-3 pointer-events-none">
                            <p className="font-display font-bold text-lg sm:text-[22px] text-white/95 leading-tight drop-shadow-[0_2px_12px_rgba(5,10,44,0.95)]">
                              {slotCenter.player.firstName}
                            </p>
                            <h1 className="font-display font-black text-[42px] sm:text-[50px] lg:text-[56px] text-white leading-[1.02] tracking-tight drop-shadow-[0_6px_24px_rgba(4,10,44,0.98)] mt-0.5">
                              {slotCenter.player.lastName}
                            </h1>
                          </div>
                        </button>

                        {/* Clean Unboxed Metadata Line */}
                        <div className="mt-1 flex items-center gap-3 text-xs sm:text-[13px] text-white/75 font-medium">
                          <span>{slotCenter.player.positionLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{slotCenter.player.nationality}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums text-blue-200 font-semibold">
                            التقييم {slotCenter.player.stats.rating}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {filteredList.length > 1 && (
                      <button
                        type="button"
                        onClick={stepNext}
                        aria-label="اللاعب التالي"
                        className="sm:hidden absolute -left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#0A144A]/85 border border-white/15 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Vertical Position Group Indicator (Mirrors "DEFENDERS" in Reference) */}
                {activePlayer && (
                  <div
                    className="hidden md:flex items-center justify-center shrink-0 px-0.5"
                    aria-hidden="true"
                  >
                    <span
                      className="text-[11px] font-bold tracking-[0.2em] text-white/60 select-none"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {activePlayer.verticalGroupLabel}
                    </span>
                  </div>
                )}

                {/* Inner Left Slot (+1) */}
                <div className="hidden sm:flex items-center justify-center w-[190px] lg:w-[225px] shrink-0">
                  {slotPlus1 && (
                    <SideShieldCard
                      player={slotPlus1.player}
                      size="md"
                      onClick={() => setActiveIndex(slotPlus1.realIndex)}
                    />
                  )}
                </div>

                {/* Outer Left Slot (+2) */}
                <div className="hidden lg:flex items-center justify-center w-[155px] shrink-0">
                  {slotPlus2 && (
                    <SideShieldCard
                      player={slotPlus2.player}
                      size="sm"
                      onClick={() => setActiveIndex(slotPlus2.realIndex)}
                    />
                  )}
                </div>
              </div>

              {/* Bottom Control Dock: Quick Number Switcher + Favorite + Compare */}
              {activePlayer && (
                <div className="mt-4 w-full max-w-3xl flex flex-wrap items-center justify-center gap-2.5">
                  {filteredList.length > 1 && (
                    <button
                      type="button"
                      onClick={stepPrev}
                      aria-label="السابق"
                      className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-2 max-w-full">
                    {filteredList.map((player, idx) => {
                      const isCurrent = idx === safeIndex;
                      return (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          aria-label={player.fullName}
                          className={`min-h-[36px] px-3 rounded-full text-xs font-bold tabular-nums transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isCurrent
                              ? 'bg-[#1B4BFF] text-white shadow-[0_4px_14px_rgba(27,75,255,0.5)]'
                              : 'bg-white/[0.07] text-white/60 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          {player.number}
                        </button>
                      );
                    })}
                  </div>

                  {filteredList.length > 1 && (
                    <button
                      type="button"
                      onClick={stepNext}
                      aria-label="التالي"
                      className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {activePlayer.category === 'players' && (
                    <div className="flex items-center gap-2 mr-1">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(activePlayer.id)}
                        aria-label="إضافة إلى المفضلة"
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          favorites.includes(activePlayer.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white/80'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(activePlayer.id) ? 'fill-white' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const other =
                            AL_HILAL_SQUAD.find((p) => p.id !== activePlayer.id)?.id ??
                            'watkins';
                          onChangeComparePair([activePlayer.id, other]);
                          onChangeViewMode('compare');
                        }}
                        aria-label="مقارنة اللاعب"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <GitCompareArrows className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

interface SideShieldCardProps {
  player: PlayerProfile;
  size: 'sm' | 'md';
  onClick: () => void;
}

function SideShieldCard({ player, size, onClick }: SideShieldCardProps) {
  const isMedium = size === 'md';

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col items-center justify-end cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-2xl ${
        isMedium
          ? 'w-[184px] h-[275px] lg:w-[218px] lg:h-[324px] opacity-85 hover:opacity-100'
          : 'w-[142px] h-[212px] opacity-55 hover:opacity-90'
      }`}
      aria-label={`اختيار ${player.fullName}`}
    >
      {/* Back Shield Backdrop */}
      <div
        className="hilal-crest-mask absolute inset-x-2 bottom-0 top-6 bg-gradient-to-b from-[#0A1348]/85 via-[#183096]/50 to-[#0B154E]/95 shadow-[0_18px_42px_rgba(5,10,38,0.58)]"
        aria-hidden="true"
      />
      <div
        className="hilal-crest-mask absolute inset-x-3 bottom-1 top-7 bg-[radial-gradient(ellipse_at_50%_70%,rgba(80,130,255,0.28),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Player Image: Real Cutout rises cleanly over the shield top! */}
      {player.isCutout ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-10 flex items-end justify-center overflow-hidden rounded-b-3xl">
          <img
            src={player.image}
            alt={player.fullName}
            referrerPolicy="no-referrer"
            className="h-[96%] w-auto max-w-none object-contain object-bottom brightness-[0.88] group-hover:brightness-100 transition-all duration-300"
            style={{
              maskImage:
                'linear-gradient(to bottom, #000 0%, #000 64%, rgba(0,0,0,0.4) 86%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 0%, #000 64%, rgba(0,0,0,0.4) 86%, transparent 100%)',
            }}
          />
        </div>
      ) : (
        <div className="hilal-crest-mask pointer-events-none absolute inset-x-2 bottom-0 top-6 z-10 overflow-hidden">
          <img
            src={player.image}
            alt={player.fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top brightness-[0.85] group-hover:brightness-100 transition-all duration-300"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(12,22,82,0.96) 0%, rgba(18,34,116,0.4) 45%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* Centered Royal Blue Number Circle + Name */}
      <div className="relative z-20 w-full flex flex-col items-center pb-3.5 lg:pb-4 px-2">
        <span
          className={`rounded-full bg-[#1B4BFF] text-white font-display font-extrabold tabular-nums flex items-center justify-center shadow-[0_6px_16px_rgba(27,75,255,0.62)] mb-1.5 ${
            isMedium ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs'
          }`}
        >
          {player.number}
        </span>
        <span
          className={`font-display font-bold text-white text-center leading-snug truncate max-w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] ${
            isMedium ? 'text-xs lg:text-[13px]' : 'text-[11px]'
          }`}
        >
          {player.fullName}
        </span>
      </div>
    </motion.button>
  );
}
