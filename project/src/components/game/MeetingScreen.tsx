import React, { useState, useEffect } from 'react';
import { Clock, SkipForward } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Player } from '../../types/game';
import ActionButton from './ActionButton';
import TaskProgress from './TaskProgress';

export default function MeetingScreen() {
  const { players, settings, totalTasksCompleted } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(settings.meetingDuration);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const totalTasks = players.filter(p => p.role === 'staff').length * settings.tasksPerPlayer;
  const alivePlayers = players.filter(p => p.status === 'alive');
  const deadPlayers = players.filter(p => p.status === 'dead');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (playerId: string | null) => {
    // Emit socket event for voting
    setSelectedPlayer(playerId);
    setHasVoted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/90 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-900">
            <Clock className="animate-pulse" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <TaskProgress totalTasks={totalTasks} completedTasks={totalTasksCompleted} />

        <div className="bg-white/90 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Vote</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-800">Alive</h3>
              {alivePlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => !hasVoted && handleVote(player.id)}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    selectedPlayer === player.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  } ${hasVoted && 'cursor-not-allowed'}`}
                  disabled={hasVoted}
                >
                  {player.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-800">Dead</h3>
              {deadPlayers.map(player => (
                <div
                  key={player.id}
                  className="w-full p-3 bg-gray-100 text-gray-500 rounded-lg line-through"
                >
                  {player.name}
                </div>
              ))}
            </div>

            {!hasVoted && (
              <ActionButton
                icon={SkipForward}
                label="Skip Vote"
                onClick={() => handleVote(null)}
                variant="warning"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}