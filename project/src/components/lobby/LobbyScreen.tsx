import React from 'react';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface LobbyScreenProps {
  onBack: () => void;
}

export default function LobbyScreen({ onBack }: LobbyScreenProps) {
  const { players, settings } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white/90 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">Players ({players.length})</h2>
          </div>
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="p-2 bg-amber-50 rounded-lg">
                <span className="text-amber-900">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">Game Settings</h2>
          </div>
          <div className="space-y-2 text-amber-800">
            <p>Impostors: {settings.impostorCount}</p>
            <p>Tasks per player: {settings.tasksPerPlayer}</p>
            <p>Kill cooldown: {settings.killCooldown}s</p>
            <p>Sabotage cooldown: {settings.sabotageCooldown}s</p>
            <p>Meeting duration: {settings.meetingDuration}s</p>
          </div>
        </div>
      </div>
    </div>
  );
}