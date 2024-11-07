import React from 'react';
import { UserX } from 'lucide-react';
import { Player } from '../../types/game';

interface PlayerListProps {
  players: Player[];
  onKickPlayer: (playerId: string) => void;
}

export default function PlayerList({ players, onKickPlayer }: PlayerListProps) {
  return (
    <div className="bg-white/90 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-4">Players ({players.length})</h2>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
          >
            <span className="text-amber-900">{player.name}</span>
            <button
              onClick={() => onKickPlayer(player.id)}
              className="p-1 text-amber-700 hover:text-amber-900 transition-colors"
              title="Kick player"
            >
              <UserX size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}