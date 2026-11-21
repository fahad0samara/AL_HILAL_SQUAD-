import { useEffect, useState } from 'react';
import { AuthModal, CartModal, type CartEntry } from './components/AuthAndCartModals';
import {
  HomeOverview,
  MatchesView,
  ShopView,
  StandingsView,
  TicketsView,
  type BookedTicket,
} from './components/ClubViews';
import { Navbar, type NavSection } from './components/Navbar';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { TeamShowcase, type TeamViewMode } from './components/TeamShowcase';
import { AL_HILAL_SQUAD, type PlayerProfile, type StoreItem } from './data/alHilalData';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('team');
  const [teamViewMode, setTeamViewMode] = useState<TeamViewMode>('carousel');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>([]);
  const [comparePair, setComparePair] = useState<[string, string]>(['salem', 'watkins']);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem('hilal-favorites');
      return saved ? (JSON.parse(saved) as string[]) : ['salem'];
    } catch {
      return ['salem'];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('hilal-favorites', JSON.stringify(favorites));
    } catch {
      // Ignore storage quota restrictions
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLaunchCompare = (playerId: string) => {
    const other =
      AL_HILAL_SQUAD.find((p) => p.id !== playerId)?.id ?? 'watkins';
    setComparePair([playerId, other]);
    setActiveSection('team');
    setTeamViewMode('compare');
  };

  const handleAddToCart = (item: StoreItem, size: string) => {
    const key = `${item.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) =>
          entry.key === key ? { ...entry, qty: entry.qty + 1 } : entry
        );
      }
      return [...prev, { key, item, size, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (key: string) => {
    setCart((prev) => prev.filter((entry) => entry.key !== key));
  };

  const cartCount = cart.reduce((sum, entry) => sum + entry.qty, 0);

  return (
    <div
      dir="rtl"
      className="relative min-h-[100svh] w-full hilal-stage-bg text-white overflow-x-hidden flex flex-col"
    >
      {/* Global Smooth Heraldic Crest SVG ClipPath (cubic Bézier curves matching the reference shield) */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="hilal-shield-smooth" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.66,0 0.77,0.035 0.85,0.075 C 0.94,0.115 1,0.165 1,0.23 L 1,0.82 C 1,0.89 0.87,0.935 0.5,1 C 0.13,0.935 0,0.89 0,0.82 L 0,0.23 C 0,0.165 0.06,0.115 0.15,0.075 C 0.23,0.035 0.34,0 0.5,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Subtle architectural halftone texture matching the prototype surface */}
      <div
        className="pointer-events-none fixed inset-0 hilal-dot-grid opacity-80"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar
          activeSection={activeSection}
          onSelectSection={(section) => {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAuth={() => setAuthOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartCount={cartCount}
          memberName={memberName}
        />

        <main className="flex-1">
          {activeSection === 'team' && (
            <TeamShowcase
              viewMode={teamViewMode}
              onChangeViewMode={setTeamViewMode}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              comparePair={comparePair}
              onChangeComparePair={setComparePair}
              onSelectPlayer={setSelectedPlayer}
            />
          )}
          {activeSection === 'home' && (
            <HomeOverview
              onNavigate={setActiveSection}
              onSelectPlayer={setSelectedPlayer}
            />
          )}
          {activeSection === 'matches' && (
            <MatchesView onBookTickets={() => setActiveSection('tickets')} />
          )}
          {activeSection === 'standings' && <StandingsView />}
          {activeSection === 'tickets' && (
            <TicketsView
              bookedTickets={bookedTickets}
              onBookTicket={(t) => setBookedTickets((prev) => [t, ...prev])}
            />
          )}
          {activeSection === 'shop' && <ShopView onAddToCart={handleAddToCart} />}
        </main>
      </div>

      {/* Player Dossier Bottom Sheet / Modal */}
      <PlayerDetailModal
        player={selectedPlayer}
        isFavorite={selectedPlayer ? favorites.includes(selectedPlayer.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCompare={handleLaunchCompare}
        onClose={() => setSelectedPlayer(null)}
      />

      {/* Auth & Cart Modals */}
      <AuthModal
        open={authOpen}
        memberName={memberName}
        onClose={() => setAuthOpen(false)}
        onSignIn={setMemberName}
        onSignOut={() => setMemberName(null)}
      />

      <CartModal
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onClear={() => setCart([])}
      />
    </div>
  );
}
