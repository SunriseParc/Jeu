import React from 'react';
import { Settings } from 'lucide-react';
import { GameSettings } from '../../types/game';

interface GameSettingsProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export default function GameSettings({ settings, onUpdateSettings }: GameSettingsProps) {
  return (
    <div className="bg-white/90 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-amber-700" />
        <h2 className="text-xl font-semibold text-amber-900">Game Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">
            Number of Impostors
          </label>
          <input
            type="number"
            min={1}
            max={3}
            value={settings.impostorCount}
            onChange={(e) => onUpdateSettings({ impostorCount: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">
            Tasks Per Player
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={settings.tasksPerPlayer}
            onChange={(e) => onUpdateSettings({ tasksPerPlayer: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">
            Kill Cooldown (seconds)
          </label>
          <input
            type="number"
            min={10}
            max={60}
            value={settings.killCooldown}
            onChange={(e) => onUpdateSettings({ killCooldown: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">
            Sabotage Cooldown (seconds)
          </label>
          <input
            type="number"
            min={20}
            max={120}
            value={settings.sabotageCooldown}
            onChange={(e) => onUpdateSettings({ sabotageCooldown: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">
            Meeting Duration (seconds)
          </label>
          <input
            type="number"
            min={30}
            max={300}
            value={settings.meetingDuration}
            onChange={(e) => onUpdateSettings({ meetingDuration: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}