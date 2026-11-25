import { BarChart3, GitCompareArrows, LayoutGrid, User, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { HilalCrest } from './HilalCrest';
import type { TeamViewMode } from './TeamShowcase';

interface NavbarProps {
  activeView: TeamViewMode;
  onSelectView: (view: TeamViewMode) => void;
  onOpenAuth: () => void;
  memberName: string | null;
}

const NAV_ITEMS: { key: TeamViewMode; label: string; mobileLabel: string; icon: typeof Users }[] = [
  { key: 'carousel', label: 'الفريق', mobileLabel: 'الفريق', icon: Users },
  { key: 'stats', label: 'إحصائيات الموسم', mobileLabel: 'الإحصائيات', icon: BarChart3 },
  { key: 'pitch', label: 'الملعب التكتيكي', mobileLabel: 'الملعب', icon: LayoutGrid },
  { key: 'compare', label: 'مقارنة اللاعبين', mobileLabel: 'مقارنة', icon: GitCompareArrows },
];

export function Navbar({
  activeView,
  onSelectView,
  onOpenAuth,
  memberName,
}: NavbarProps) {
  return (
    <>
      {/* Top Bar: Clean 3-zone layout matching the prototype */}
      <header className="sticky top-0 z-40 h-14 md:h-20 bg-[#0D1756]/85 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/[0.06] md:border-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand mark (single-line) */}
          <button
            type="button"
            onClick={() => onSelectView('carousel')}
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg cursor-pointer"
            aria-label="نادي الهلال السعودي"
          >
            <HilalCrest className="w-7 h-8 md:w-8 md:h-9 text-white" />
            <span className="font-display font-extrabold text-base md:text-lg tracking-tight">
              الهلال
            </span>
          </button>

          {/* Zone 2: Desktop single-line text nav links with shared-element spring underline */}
          <nav
            className="hidden md:flex items-center gap-8 lg:gap-10 text-[13px] font-medium"
            aria-label="التنقل الرئيسي"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectView(item.key)}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="hilal-desktop-nav-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary auth action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenAuth}
              className="min-h-[40px] px-4 py-2 rounded-full bg-white/10 hover:bg-white/18 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <User className="w-3.5 h-3.5 text-white/85" />
              <span>{memberName ? memberName : 'تسجيل الدخول'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Thumb-Zone Ergonomics with shared-element spring pill) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B144A]/95 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
        aria-label="التنقل السفلي"
      >
        <div className="grid grid-cols-4 h-16 items-center px-1.5">
          {NAV_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectView(tab.key)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span className="relative w-11 h-7 rounded-full flex items-center justify-center">
                  {isActive && (
                    <motion.span
                      layoutId="hilal-mobile-nav-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[#1B4BFF] shadow-[0_4px_14px_rgba(27,75,255,0.55)]"
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="relative z-10 w-4 h-4" />
                </span>
                <span className="text-[11px] font-semibold whitespace-nowrap">
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
