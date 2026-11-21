import { useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Shirt,
  ShoppingBag,
  Ticket,
  Trophy,
} from 'lucide-react';
import {
  AL_HILAL_SQUAD,
  CLUB_LEADERSHIP_INFO,
  LEAGUE_STANDINGS,
  STORE_ITEMS,
  TICKET_MATCHES,
  UPCOMING_MATCHES,
  type PlayerProfile,
  type StoreItem,
} from '../data/alHilalData';
import type { NavSection } from './Navbar';

export interface BookedTicket {
  code: string;
  opponent: string;
  date: string;
  time: string;
  tierName: string;
  section: string;
  qty: number;
  totalPrice: number;
}

function useCountdown(targetIso?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!targetIso) return { days: 6, hours: 8, minutes: 24, seconds: 12 };
  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

interface HomeViewProps {
  onNavigate: (section: NavSection) => void;
  onSelectPlayer: (player: PlayerProfile) => void;
}

export function HomeOverview({ onNavigate, onSelectPlayer }: HomeViewProps) {
  const nextMatch = UPCOMING_MATCHES[0];
  const countdown = useCountdown(nextMatch.isoKickoff);
  const featuredStars = [
    AL_HILAL_SQUAD.find((p) => p.id === 'salem')!,
    AL_HILAL_SQUAD.find((p) => p.id === 'watkins')!,
    AL_HILAL_SQUAD.find((p) => p.id === 'bounou')!,
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:py-8 space-y-10">
      {/* Club Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-bl from-[#1C38B5]/60 via-[#122274]/85 to-[#0B154E] border border-white/10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs sm:text-sm font-semibold text-blue-200/85">
            نادي الهلال السعودي · تأسس {CLUB_LEADERSHIP_INFO.founded} · برئاسة{' '}
            {CLUB_LEADERSHIP_INFO.president}
          </p>
          <h1
            className="font-display font-black text-3xl sm:text-5xl text-white leading-tight"
            style={{ textWrap: 'balance' }}
          >
            زعيم آسيا في قلب المملكة أرينا
          </h1>
          <p className="text-sm sm:text-base text-white/75 leading-7">
            استعرض تشكيلة موسم 2026/27 بقيادة المدرب الإيطالي سيموني إنزاغي، قارن بين النجوم بالأرقام، استكشف الخطة التكتيكية، واحجز مقعدك مباشرة في مدرج القوة الزرقاء.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('team')}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-white text-[#0E1A5C] font-bold text-sm hover:bg-blue-50 transition-colors cursor-pointer"
            >
              استعراض تشكيلة الفريق
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tickets')}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              خريطة تذاكر المملكة أرينا
            </button>
          </div>
        </div>

        {/* Next Match Countdown Spotlight */}
        <div className="w-full lg:w-[360px] shrink-0 rounded-2xl bg-[#091246]/85 border border-white/12 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-white/65">
            <span>العد التنازلي للمباراة القادمة</span>
            <span className="text-blue-200 font-semibold">{nextMatch.competition}</span>
          </div>
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="text-center flex-1">
              <div className="font-display font-black text-2xl text-white">
                {nextMatch.homeTeam}
              </div>
              <div className="text-[11px] text-blue-300 mt-0.5">المستضيف</div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#1B4BFF] font-display font-black text-sm tabular-nums">
              {nextMatch.time}
            </div>
            <div className="text-center flex-1">
              <div className="font-display font-black text-2xl text-white/90">
                {nextMatch.awayTeam}
              </div>
              <div className="text-[11px] text-white/55 mt-0.5">الضيف</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            {[
              { v: countdown.days, l: 'يوم' },
              { v: countdown.hours, l: 'ساعة' },
              { v: countdown.minutes, l: 'دقيقة' },
              { v: countdown.seconds, l: 'ثانية' },
            ].map((u) => (
              <div
                key={u.l}
                className="rounded-xl bg-white/[0.06] border border-white/[0.08] py-2"
              >
                <div className="font-display font-black text-lg tabular-nums text-white">
                  {String(u.v).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-white/60">{u.l}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              {nextMatch.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              المملكة أرينا
            </span>
          </div>
        </div>
      </div>

      {/* Club Honors KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: String(CLUB_LEADERSHIP_INFO.totalTrophies), label: 'بطولة رسمية موثقة' },
          { value: String(CLUB_LEADERSHIP_INFO.leagueTitles), label: 'لقب دوري سعودي (رقم قياسي)' },
          { value: String(CLUB_LEADERSHIP_INFO.asianTitles), label: 'ألقاب دوري أبطال آسيا' },
          { value: '#1', label: 'متصدر دوري روشن 2026/27' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5"
          >
            <div className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">
              {metric.value}
            </div>
            <div className="text-xs sm:text-sm text-white/70 mt-1.5">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Stars Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            أبرز نجوم موسم 2026/27
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('team')}
            className="text-xs sm:text-sm font-semibold text-blue-300 hover:text-white transition-colors cursor-pointer"
          >
            عرض جميع اللاعبين
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featuredStars.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onSelectPlayer(player)}
              className="group text-right rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] p-4 flex items-center gap-4 transition-colors cursor-pointer"
            >
              <div className="relative w-16 h-20 shrink-0">
                <div className="hilal-crest-mask w-full h-full overflow-hidden bg-[#0A1348]">
                  <img
                    src={player.image}
                    alt={player.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#1B4BFF] text-white font-display font-bold text-xs tabular-nums flex items-center justify-center">
                  {player.number}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold text-base text-white truncate">
                  {player.fullName}
                </div>
                <div className="text-xs text-white/65 mt-0.5">{player.positionLabel}</div>
                <div className="text-xs text-blue-300 mt-2 tabular-nums">
                  {player.stats.cleanSheets !== undefined
                    ? `${player.stats.cleanSheets} شباك نظيفة · تقييم ${player.stats.rating}`
                    : `${player.stats.goals} هدف · ${player.stats.assists} تمريرة حاسمة`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

interface MatchesViewProps {
  onBookTickets: () => void;
}

export function MatchesView({ onBookTickets }: MatchesViewProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>('m5');
  const nextMatch = UPCOMING_MATCHES[0];
  const countdown = useCountdown(nextMatch.isoKickoff);

  const matches = UPCOMING_MATCHES.filter((m) =>
    filter === 'all' ? true : m.status === filter
  );

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            مركز المباريات والنتائج
          </h1>
          <p className="text-xs sm:text-sm text-white/65 mt-1">
            مواجهات الهلال في دوري روشن السعودي ودوري أبطال آسيا للنخبة 2026/27
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          {[
            { key: 'all' as const, label: 'الكل' },
            { key: 'upcoming' as const, label: 'القادمة' },
            { key: 'completed' as const, label: 'النتائج والإحصائيات' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                filter === tab.key
                  ? 'bg-white text-[#0E1A5C]'
                  : 'bg-white/10 text-white/75 hover:bg-white/16'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Next Match Countdown Bar */}
      <div className="rounded-2xl bg-gradient-to-l from-[#1C3EC4]/55 to-[#0D1A5E]/90 border border-white/12 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-200">
            المباراة القادمة · {nextMatch.competition} · {nextMatch.venue}
          </div>
          <div className="font-display font-black text-xl text-white mt-0.5">
            {nextMatch.homeTeam} × {nextMatch.awayTeam}
          </div>
        </div>
        <div className="flex items-center gap-2 tabular-nums">
          {[
            { v: countdown.days, l: 'يوم' },
            { v: countdown.hours, l: 'ساعة' },
            { v: countdown.minutes, l: 'د' },
            { v: countdown.seconds, l: 'ث' },
          ].map((u) => (
            <div
              key={u.l}
              className="min-w-[54px] rounded-xl bg-[#091246]/80 border border-white/10 py-1.5 px-2 text-center"
            >
              <div className="font-display font-black text-base text-white">
                {String(u.v).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-white/60">{u.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {matches.map((match) => {
          const isExpanded = expandedMatchId === match.id && !!match.matchStats;
          return (
            <div
              key={match.id}
              className="rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden"
            >
              <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-white/65 md:w-56 shrink-0">
                  <div className="font-semibold text-blue-200">{match.competition}</div>
                  <div>
                    {match.round} · {match.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/55">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{match.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 sm:gap-7 flex-1">
                  <span
                    className={`font-display font-bold text-lg sm:text-xl flex-1 text-left ${
                      match.homeTeam === 'الهلال' ? 'text-white' : 'text-white/75'
                    }`}
                  >
                    {match.homeTeam}
                  </span>

                  {match.status === 'completed' && match.score ? (
                    <div className="px-4 py-1.5 rounded-xl bg-[#1B4BFF]/25 border border-[#1B4BFF]/50 font-display font-black text-xl tabular-nums text-white whitespace-nowrap">
                      {match.score.home} - {match.score.away}
                    </div>
                  ) : (
                    <div className="px-4 py-1.5 rounded-xl bg-white/10 font-display font-bold text-sm tabular-nums text-white whitespace-nowrap">
                      {match.time}
                    </div>
                  )}

                  <span
                    className={`font-display font-bold text-lg sm:text-xl flex-1 text-right ${
                      match.awayTeam === 'الهلال' ? 'text-white' : 'text-white/75'
                    }`}
                  >
                    {match.awayTeam}
                  </span>
                </div>

                <div className="md:w-40 flex justify-end shrink-0">
                  {match.status === 'upcoming' && match.ticketsAvailable ? (
                    <button
                      type="button"
                      onClick={onBookTickets}
                      className="w-full md:w-auto min-h-[42px] px-4 rounded-full bg-white text-[#0E1A5C] font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      احجز تذكرتك
                    </button>
                  ) : match.matchStats ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMatchId(isExpanded ? null : match.id)
                      }
                      className="w-full md:w-auto min-h-[40px] px-4 rounded-full bg-white/10 hover:bg-white/18 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>الإحصائيات</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-white/55">خارج الأرض</span>
                  )}
                </div>
              </div>

              {/* Expandable Match Center Stats */}
              {isExpanded && match.matchStats && (
                <div className="border-t border-white/10 bg-[#091246]/60 px-5 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-blue-200">أرقام المباراة</h3>
                      {[
                        { label: 'الاستحواذ %', pair: match.matchStats.possession },
                        { label: 'إجمالي التسديدات', pair: match.matchStats.shots },
                        { label: 'تسديدات على المرمى', pair: match.matchStats.shotsOnTarget },
                        { label: 'التمريرات المكتملة', pair: match.matchStats.passes },
                      ].map((row) => {
                        const sum = row.pair[0] + row.pair[1] || 1;
                        const homePct = Math.round((row.pair[0] / sum) * 100);
                        return (
                          <div key={row.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs tabular-nums">
                              <span className="font-bold text-white">{row.pair[0]}</span>
                              <span className="text-white/65">{row.label}</span>
                              <span className="font-bold text-white/80">{row.pair[1]}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden flex">
                              <div
                                className="h-full bg-[#2A64FF]"
                                style={{ width: `${homePct}%` }}
                              />
                              <div className="h-full flex-1 bg-white/25" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold text-blue-200">مسجلو أهداف الهلال</h3>
                      <div className="space-y-2">
                        {match.matchStats.scorers.map((ev, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3.5 py-2 text-xs"
                          >
                            <span className="font-display font-bold text-white">
                              {ev.player}
                            </span>
                            <span className="font-bold text-blue-300 tabular-nums">
                              {ev.minute}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StandingsView() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            جدول ترتيب دوري روشن السعودي
          </h1>
          <p className="text-xs sm:text-sm text-white/65 mt-1">
            موسم 2026/27 · الهلال في الصدارة دون خسارة
          </p>
        </div>
        <Trophy className="w-7 h-7 text-blue-300 shrink-0" />
      </div>

      <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/60">
                <th className="py-3.5 px-4 font-semibold">#</th>
                <th className="py-3.5 px-4 font-semibold">النادي</th>
                <th className="py-3.5 px-3 font-semibold text-center">لعب</th>
                <th className="py-3.5 px-3 font-semibold text-center">فوز</th>
                <th className="py-3.5 px-3 font-semibold text-center">تعادل</th>
                <th className="py-3.5 px-3 font-semibold text-center">خسارة</th>
                <th className="py-3.5 px-3 font-semibold text-center">الفارق</th>
                <th className="py-3.5 px-4 font-semibold text-center">النقاط</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell text-center">
                  آخر 5 مباريات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {LEAGUE_STANDINGS.map((row) => (
                <tr
                  key={row.team}
                  className={
                    row.isHilal
                      ? 'bg-[#1B4BFF]/25 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/[0.03]'
                  }
                >
                  <td className="py-4 px-4 tabular-nums font-bold">{row.rank}</td>
                  <td className="py-4 px-4 font-display font-bold whitespace-nowrap">
                    {row.team}
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums">{row.played}</td>
                  <td className="py-4 px-3 text-center tabular-nums">{row.won}</td>
                  <td className="py-4 px-3 text-center tabular-nums">{row.drawn}</td>
                  <td className="py-4 px-3 text-center tabular-nums">{row.lost}</td>
                  <td className="py-4 px-3 text-center tabular-nums" dir="ltr">
                    {row.gd}
                  </td>
                  <td className="py-4 px-4 text-center tabular-nums font-display font-black text-base text-white">
                    {row.points}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold">
                      {row.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            res === 'W'
                              ? 'bg-emerald-500/25 text-emerald-200'
                              : res === 'D'
                                ? 'bg-white/15 text-white/80'
                                : 'bg-rose-500/25 text-rose-200'
                          }`}
                        >
                          {res === 'W' ? 'ف' : res === 'D' ? 'ت' : 'خ'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

interface TicketsViewProps {
  bookedTickets: BookedTicket[];
  onBookTicket: (ticket: BookedTicket) => void;
}

export function TicketsView({ bookedTickets, onBookTicket }: TicketsViewProps) {
  const [selectedMatchId, setSelectedMatchId] = useState(TICKET_MATCHES[0].id);
  const [selectedZone, setSelectedZone] = useState<'north' | 'east' | 'silver' | 'vip'>('north');
  const [ticketQty, setTicketQty] = useState<number>(2);
  const [justBooked, setJustBooked] = useState(false);

  const selectedMatch =
    TICKET_MATCHES.find((m) => m.id === selectedMatchId) ?? TICKET_MATCHES[0];
  const selectedTier =
    selectedMatch.tiers.find((t) => t.zoneKey === selectedZone) ?? selectedMatch.tiers[0];

  const handleConfirm = () => {
    const code = `KA-${Math.floor(100000 + Math.random() * 900000)}`;
    onBookTicket({
      code,
      opponent: selectedMatch.opponent,
      date: selectedMatch.date,
      time: selectedMatch.time,
      tierName: selectedTier.name,
      section: selectedTier.section,
      qty: ticketQty,
      totalPrice: selectedTier.price * ticketQty,
    });
    setJustBooked(true);
    window.setTimeout(() => setJustBooked(false), 2000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:py-8 space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
          خريطة تذاكر المملكة أرينا
        </h1>
        <p className="text-xs sm:text-sm text-white/65 mt-1">
          انقر مباشرة على المدرج المفضل في خريطة الملعب لإصدار تذكرتك الرقمية فوراً
        </p>
      </div>

      {/* Match Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {TICKET_MATCHES.map((m) => {
          const active = m.id === selectedMatch.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMatchId(m.id)}
              className={`text-right rounded-2xl p-4 sm:p-5 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1B4BFF]/25 border-[#3A6BFF] text-white'
                  : 'bg-white/[0.05] border-white/[0.08] text-white/75 hover:bg-white/[0.08]'
              }`}
            >
              <div className="text-xs text-blue-200">{m.competition}</div>
              <div className="font-display font-black text-xl text-white mt-1">
                {m.opponent}
              </div>
              <div className="text-xs text-white/65 mt-1.5">
                {m.date} · {m.time} · {m.venue}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Kingdom Arena Stadium Map + Tier Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-3xl bg-[#091246]/80 border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="font-bold text-white">المخطط التفاعلي لملعب المملكة أرينا</span>
            <span>اختر المدرج بالنقر</span>
          </div>

          <svg
            viewBox="0 0 420 280"
            className="w-full h-auto"
            role="img"
            aria-label="خريطة مدرجات المملكة أرينا"
          >
            {/* Outer Stadium Roof Frame */}
            <rect
              x="14"
              y="12"
              width="392"
              height="256"
              rx="42"
              fill="#0D195E"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="2"
            />

            {/* Top Stand: VIP Gold Platform */}
            <g
              onClick={() => setSelectedZone('vip')}
              className="cursor-pointer transition-opacity hover:opacity-95"
            >
              <rect
                x="110"
                y="24"
                width="200"
                height="40"
                rx="12"
                fill={selectedZone === 'vip' ? '#F59E0B' : 'rgba(245,158,11,0.28)'}
                stroke={selectedZone === 'vip' ? '#FFFFFF' : 'rgba(245,158,11,0.65)'}
                strokeWidth="2"
              />
              <text
                x="210"
                y="49"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="700"
              >
                المنصة الذهبية VIP
              </text>
            </g>

            {/* Bottom Stand: East Front */}
            <g
              onClick={() => setSelectedZone('east')}
              className="cursor-pointer transition-opacity hover:opacity-95"
            >
              <rect
                x="110"
                y="216"
                width="200"
                height="40"
                rx="12"
                fill={selectedZone === 'east' ? '#2563EB' : 'rgba(37,99,235,0.28)'}
                stroke={selectedZone === 'east' ? '#FFFFFF' : 'rgba(59,130,246,0.6)'}
                strokeWidth="2"
              />
              <text
                x="210"
                y="241"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="700"
              >
                الواجهة الشرقية
              </text>
            </g>

            {/* Right Stand: North Stand (القوة الزرقاء) */}
            <g
              onClick={() => setSelectedZone('north')}
              className="cursor-pointer transition-opacity hover:opacity-95"
            >
              <rect
                x="332"
                y="68"
                width="62"
                height="144"
                rx="14"
                fill={selectedZone === 'north' ? '#1B4BFF' : 'rgba(27,75,255,0.32)'}
                stroke={selectedZone === 'north' ? '#FFFFFF' : 'rgba(59,130,246,0.65)'}
                strokeWidth="2"
              />
              <text
                x="363"
                y="135"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
              >
                القوة
              </text>
              <text
                x="363"
                y="153"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
              >
                الزرقاء
              </text>
            </g>

            {/* Left Stand: Silver Premium */}
            <g
              onClick={() => setSelectedZone('silver')}
              className="cursor-pointer transition-opacity hover:opacity-95"
            >
              <rect
                x="26"
                y="68"
                width="62"
                height="144"
                rx="14"
                fill={selectedZone === 'silver' ? '#38BDF8' : 'rgba(56,189,248,0.25)'}
                stroke={selectedZone === 'silver' ? '#FFFFFF' : 'rgba(56,189,248,0.6)'}
                strokeWidth="2"
              />
              <text
                x="57"
                y="135"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
              >
                الدرجة
              </text>
              <text
                x="57"
                y="153"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
              >
                الفضية
              </text>
            </g>

            {/* Center Pitch */}
            <rect
              x="104"
              y="76"
              width="212"
              height="128"
              rx="10"
              fill="#11297E"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.5"
            />
            <line
              x1="210"
              y1="76"
              x2="210"
              y2="204"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.2"
            />
            <circle
              cx="210"
              cy="140"
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.2"
            />
            <rect
              x="104"
              y="108"
              width="28"
              height="64"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <rect
              x="288"
              y="108"
              width="28"
              height="64"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Selected Zone Booking Summary */}
        <div className="lg:col-span-5 rounded-3xl bg-white/[0.05] border border-white/10 p-5 sm:p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold text-blue-200">الفئة المختارة</div>
            <h2 className="font-display font-black text-2xl text-white mt-1">
              {selectedTier.name}
            </h2>
            <p className="text-xs text-white/65 mt-1">{selectedTier.section}</p>
            <p className="text-xs text-blue-300 mt-2 tabular-nums">
              المتبقي: {selectedTier.remaining} مقعد متاح
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-sm font-semibold text-white">عدد التذاكر</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setTicketQty(qty)}
                  className={`w-10 h-10 rounded-full text-sm font-bold tabular-nums transition-colors cursor-pointer ${
                    ticketQty === qty
                      ? 'bg-white text-[#0E1A5C]'
                      : 'bg-white/10 text-white/75 hover:bg-white/20'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-white/70">الإجمالي</span>
            <span className="font-display font-black text-3xl text-white tabular-nums">
              {selectedTier.price * ticketQty} ر.س
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className={`min-h-[48px] w-full rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              justBooked
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-[#0E1A5C] hover:bg-blue-50'
            }`}
          >
            {justBooked ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم إصدار تذكرتك الرقمية!</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>إصدار التذكرة الرقمية الآن</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Issued Digital Tickets Wallet */}
      {bookedTickets.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="font-display font-bold text-lg text-white">
            تذاكري المحجوزة ({bookedTickets.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookedTickets.map((t) => (
              <div
                key={t.code}
                className="rounded-2xl bg-gradient-to-l from-[#1B4BFF]/30 to-[#0B144A] border border-white/15 p-5 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-blue-200 tabular-nums">
                    رمز التذكرة: {t.code}
                  </div>
                  <div className="font-display font-black text-lg text-white">
                    {t.opponent}
                  </div>
                  <div className="text-xs text-white/75">
                    {t.tierName} · {t.qty} تذاكر
                  </div>
                  <div className="text-[11px] text-white/55">
                    {t.date} · {t.time}
                  </div>
                </div>
                <div className="shrink-0 bg-white rounded-xl p-2 flex flex-col items-center">
                  <div className="flex items-end gap-[2px] h-10">
                    {[2, 4, 2, 3, 5, 2, 4, 2, 3, 2, 5, 2].map((w, i) => (
                      <div
                        key={i}
                        className="bg-[#0B144A] h-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-[#0B144A] mt-1 tabular-nums">
                    {t.totalPrice} SAR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface ShopViewProps {
  onAddToCart: (item: StoreItem, size: string) => void;
}

export function ShopView({ onAddToCart }: ShopViewProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'kit-home': 'L',
    'kit-gk': 'L',
    'kit-watkins': 'L',
    'kit-theo': 'L',
  });
  const [addedId, setAddedId] = useState<string | null>(null);

  // Live Jersey Customizer State
  const [kitColor, setKitColor] = useState<'home' | 'away'>('home');
  const [customName, setCustomName] = useState('AL-DAWSARI');
  const [customNumber, setCustomNumber] = useState('29');
  const [customSize, setCustomSize] = useState('L');
  const [customAdded, setCustomAdded] = useState(false);

  const handleAdd = (item: StoreItem) => {
    const size = selectedSizes[item.id] ?? item.sizes[0];
    onAddToCart(item, size);
    setAddedId(item.id);
    window.setTimeout(() => setAddedId(null), 1500);
  };

  const handleAddCustomJersey = () => {
    const cleanName = customName.trim().toUpperCase() || 'AL HILAL';
    const cleanNum = customNumber.trim() || '29';
    onAddToCart(
      {
        id: `custom-${kitColor}-${cleanName}-${cleanNum}`,
        name: `قميص الهلال المخصص (${cleanName} #${cleanNum})`,
        subtitle: kitColor === 'home' ? 'الطقم الأساسي الأزرق' : 'الطقم الاحتياطي الأبيض',
        price: 469,
        category: 'تخصيص خاص',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: STORE_ITEMS[0].image,
      },
      customSize
    );
    setCustomAdded(true);
    window.setTimeout(() => setCustomAdded(false), 1600);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-24 md:py-8 space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
          متجر الهلال الرسمي
        </h1>
        <p className="text-xs sm:text-sm text-white/65 mt-1">
          صمّم قميصك المخصص باسمك ورقمك أو اختر أطقم موسم 2026/27 الأصلية
        </p>
      </div>

      {/* Live Jersey Customizer Studio */}
      <div className="rounded-3xl bg-gradient-to-bl from-[#1C38B5]/45 via-[#101F6B]/85 to-[#091246] border border-white/12 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
        {/* Live Back-of-Jersey SVG Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 260 280"
            className="w-56 sm:w-64 h-auto drop-shadow-[0_22px_36px_rgba(0,0,0,0.55)]"
            role="img"
            aria-label="معاينة القميص المخصص"
          >
            <path
              d="M84 26 L176 26 L236 68 L216 122 L190 110 L190 256 L70 256 L70 110 L44 122 L24 68 Z"
              fill={kitColor === 'home' ? '#1646E0' : '#F8FAFC'}
              stroke={kitColor === 'home' ? '#3B7BFF' : '#CBD5E1'}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Collar */}
            <path
              d="M94 26 Q130 48 166 26"
              fill="none"
              stroke={kitColor === 'home' ? '#FFFFFF' : '#1646E0'}
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Sleeve Cuffs */}
            <line
              x1="28"
              y1="76"
              x2="48"
              y2="117"
              stroke={kitColor === 'home' ? '#FFFFFF' : '#1646E0'}
              strokeWidth="5"
            />
            <line
              x1="232"
              y1="76"
              x2="212"
              y2="117"
              stroke={kitColor === 'home' ? '#FFFFFF' : '#1646E0'}
              strokeWidth="5"
            />
            {/* Custom Name */}
            <text
              x="130"
              y="96"
              textAnchor="middle"
              fill={kitColor === 'home' ? '#FFFFFF' : '#102070'}
              fontSize="20"
              fontWeight="900"
              letterSpacing="1.5"
            >
              {(customName || 'AL HILAL').slice(0, 12).toUpperCase()}
            </text>
            {/* Custom Number */}
            <text
              x="130"
              y="188"
              textAnchor="middle"
              fill={kitColor === 'home' ? '#FFFFFF' : '#1646E0'}
              fontSize="84"
              fontWeight="900"
            >
              {customNumber || '29'}
            </text>
          </svg>
        </div>

        {/* Customizer Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
              <Shirt className="w-4 h-4" />
              <span>استوديو تخصيص القميص</span>
            </div>
            <h2 className="font-display font-black text-2xl text-white mt-1">
              خصّص قميص الزعيم باسمك ورقمك
            </h2>
          </div>

          {/* Quick Pick a Star */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/75">
              اختر طباعة نجم جاهزة أو اكتب اسمك:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {AL_HILAL_SQUAD.slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCustomName(p.shirtName);
                    setCustomNumber(p.number);
                  }}
                  className="min-h-[34px] px-3 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  #{p.number} {p.lastName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-white/75 mb-1.5">
                الاسم على الظهر
              </label>
              <input
                type="text"
                maxLength={12}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="AL-DAWSARI"
                dir="ltr"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.08] border border-white/15 text-sm font-bold text-white uppercase focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/75 mb-1.5">
                الرقم (1-99)
              </label>
              <input
                type="text"
                maxLength={2}
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ''))}
                dir="ltr"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.08] border border-white/15 text-sm font-bold text-white text-center tabular-nums focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setKitColor('home')}
                className={`min-h-[38px] px-4 rounded-full text-xs font-bold cursor-pointer ${
                  kitColor === 'home'
                    ? 'bg-[#1B4BFF] text-white ring-2 ring-white'
                    : 'bg-white/10 text-white/75'
                }`}
              >
                الأزرق الأساسي
              </button>
              <button
                type="button"
                onClick={() => setKitColor('away')}
                className={`min-h-[38px] px-4 rounded-full text-xs font-bold cursor-pointer ${
                  kitColor === 'away'
                    ? 'bg-white text-[#0E1A5C]'
                    : 'bg-white/10 text-white/75'
                }`}
              >
                الأبيض الاحتياطي
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCustomSize(s)}
                  className={`min-w-[36px] h-9 rounded-lg text-xs font-bold cursor-pointer ${
                    customSize === s
                      ? 'bg-white text-[#0E1A5C]'
                      : 'bg-white/10 text-white/75'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddCustomJersey}
            className={`min-h-[46px] px-7 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto ${
              customAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-[#0E1A5C] hover:bg-blue-50'
            }`}
          >
            {customAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>تمت إضافة القميص المخصص للسلة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة القميص المخصص · 469 ر.س</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STORE_ITEMS.map((item) => {
          const activeSize = selectedSizes[item.id] ?? item.sizes[0];
          const justAdded = addedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1A38B5]/65 via-[#102074] to-[#0B144A] overflow-hidden flex items-end justify-center pt-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-auto object-contain object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1858] via-transparent to-transparent" />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-[11px] text-blue-200/80">{item.category}</div>
                  <h3 className="font-display font-bold text-base text-white mt-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/65 mt-1">{item.subtitle}</p>
                  <div className="font-display font-black text-xl text-white tabular-nums mt-2.5">
                    {item.price} ر.س
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSizes((prev) => ({ ...prev, [item.id]: size }))
                        }
                        className={`min-w-[36px] h-9 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeSize === size
                            ? 'bg-[#1B4BFF] text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/18'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className={`min-h-[44px] w-full rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-[#0E1A5C] hover:bg-blue-50'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تمت الإضافة للسلة</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>إضافة إلى السلة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
