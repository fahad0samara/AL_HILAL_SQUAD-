import { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthAndCartModals';
import { Navbar } from './components/Navbar';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { TeamShowcase, type TeamViewMode } from './components/TeamShowcase';
import { AL_HILAL_SQUAD, type PlayerProfile } from './data/alHilalData';

export default function App() {
  const [teamViewMode, setTeamViewMode] = useState<TeamViewMode>('carousel');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
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
    setTeamViewMode('compare');
  };

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
          activeView={teamViewMode}
          onSelectView={(view) => {
            setTeamViewMode(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAuth={() => setAuthOpen(true)}
          memberName={memberName}
        />

        <main className="flex-1">
          <TeamShowcase
            viewMode={teamViewMode}
            onChangeViewMode={setTeamViewMode}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            comparePair={comparePair}
            onChangeComparePair={setComparePair}
            onSelectPlayer={setSelectedPlayer}
          />
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

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        memberName={memberName}
        onClose={() => setAuthOpen(false)}
        onSignIn={setMemberName}
        onSignOut={() => setMemberName(null)}
      />
    </div>
  );
}
