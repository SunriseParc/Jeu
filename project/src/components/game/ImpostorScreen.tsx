import React from 'react';
import { Bomb, Skull } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import TaskList from './TaskList';
import TaskProgress from './TaskProgress';
import ActionButton from './ActionButton';

export default function ImpostorScreen() {
  const { players, settings, totalTasksCompleted } = useGameStore();
  const currentPlayer = players.find(p => p.role === 'impostor');
  const totalTasks = players.filter(p => p.role === 'staff').length * settings.tasksPerPlayer;

  const handleKill = () => {
    // Emit socket event for kill attempt
  };

  const handleSabotage = () => {
    // Emit socket event for sabotage
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-amber-950 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ActionButton
            icon={Skull}
            label="Kill"
            onClick={handleKill}
            disabled={currentPlayer?.killCooldown !== 0}
            cooldown={currentPlayer?.killCooldown}
            variant="danger"
          />
          <ActionButton
            icon={Bomb}
            label="Sabotage"
            onClick={handleSabotage}
            disabled={currentPlayer?.sabotageCooldown !== 0}
            cooldown={currentPlayer?.sabotageCooldown}
            variant="danger"
          />
        </div>

        <TaskProgress totalTasks={totalTasks} completedTasks={totalTasksCompleted} />
        
        <TaskList
          tasks={currentPlayer?.tasks || []}
          completedTasks={currentPlayer?.completedTasks || 0}
          isImpostor
        />
      </div>
    </div>
  );
}