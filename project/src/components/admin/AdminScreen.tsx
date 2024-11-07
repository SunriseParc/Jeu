import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import PlayerList from './PlayerList';
import GameSettings from './GameSettings';
import TaskManager from './TaskManager';

interface AdminScreenProps {
  onBack: () => void;
  onStartGame: () => void;
}

export default function AdminScreen({ onBack, onStartGame }: AdminScreenProps) {
  const { players, settings, updateSettings } = useGameStore();

  const handleKickPlayer = (playerId: string) => {
    // Emit socket event to kick player
  };

  const handleUpdateTasks = (tasks: string[]) => {
    updateSettings({ availableTasks: tasks });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={onStartGame}
            disabled={players.length < 4}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} />
            Start Game
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <PlayerList players={players} onKickPlayer={handleKickPlayer} />
            <GameSettings settings={settings} onUpdateSettings={updateSettings} />
          </div>
          <TaskManager tasks={settings.availableTasks} onUpdateTasks={handleUpdateTasks} />
        </div>
      </div>
    </div>
  );
}