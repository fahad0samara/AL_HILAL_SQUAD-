import { Calendar, ShoppingBag, Ticket, Trophy, User, Users } from 'lucide-react';
import { HilalCrest } from './HilalCrest';

export type NavSection = 'home' | 'matches' | 'standings' | 'team' | 'tickets' | 'shop';

interface NavbarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  cartCount: number;
  memberName: string | null;
}

const DESKTOP_LINKS: { key: NavSection; label: string }[] = [
  { key: 'home', label: 'الرئيسية' },
  { key: 'matches', label: 'المباريات' },
  { key: 'standings', label: 'الترتيب' },
  { key: 'team', label: 'الفريق' },
  { key: 'tickets', label: 'التذاكر' },
  { key: 'shop', label: 'المتجر' },
];

const MOBILE_TABS: { key: NavSection; label: string; icon: typeof Users }[] = [
  { key: 'team', label: 'الفريق', icon: Users },
  { key: 'matches', label: 'المباريات', icon: Calendar },
  { key: 'standings', label: 'الترتيب', icon: Trophy },
  { key: 'tickets', label: 'التذاكر', icon: Ticket },
  { key: 'shop', label: 'المتجر', icon: ShoppingBag },
];

export function Navbar({
  activeSection,
  onSelectSection,
  onOpenAuth,
  onOpenCart,
  cartCount,
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
            onClick={() => onSelectSection('team')}
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg"
            aria-label="نادي الهلال السعودي"
          >
            <HilalCrest className="w-7 h-8 md:w-8 md:h-9 text-white" />
            <span className="font-display font-extrabold text-base md:text-lg tracking-tight">
              الهلال
            </span>
          </button>

          {/* Zone 2: Desktop single-line text nav links */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] font-medium"
            aria-label="التنقل الرئيسي"
          >
            {DESKTOP_LINKS.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectSection(item.key)}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-white rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary auth action (+ compact cart icon only when items > 0) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {cartCount > 0 && (
              <button
                type="button"
                onClick={onOpenCart}
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute top-1.5 left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1B4BFF] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              </button>
            )}

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

      {/* Mobile Bottom Tab Bar (Thumb-Zone Ergonomics, <= 15% combined sticky cap) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B144A]/95 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
        aria-label="التنقل السفلي"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectSection(tab.key)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#1B4BFF] text-white' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
