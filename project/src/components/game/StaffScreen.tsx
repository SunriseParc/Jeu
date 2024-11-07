import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import TaskList from './TaskList';
import TaskProgress from './TaskProgress';
import ActionButton from './ActionButton';

export default function StaffScreen() {
  const { players, settings, totalTasksCompleted, sabotageActive } = useGameStore();
  const currentPlayer = players.find(p => p.role === 'staff');
  const totalTasks = players.filter(p => p.role === 'staff').length * settings.tasksPerPlayer;

  const handleCompleteTask = (taskIndex: number) => {
    // Emit socket event for task completion
  };

  const handleEmergencyMeeting = () => {
    // Emit socket event for emergency meeting
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {sabotageActive && (
          <div className="bg-red-600 text-white p-4 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle />
              <span className="font-medium">
                Sabotage Active: {sabotageActive.type}
              </span>
            </div>
            <p className="mt-2">
              Time remaining: {Math.ceil(sabotageActive.timeLeft / 1000)}s
            </p>
          </div>
        )}

        <ActionButton
          icon={Users}
          label="Emergency Meeting"
          onClick={handleEmergencyMeeting}
          variant="warning"
        />

        <TaskProgress totalTasks={totalTasks} completedTasks={totalTasksCompleted} />
        
        <TaskList
          tasks={currentPlayer?.tasks || []}
          completedTasks={currentPlayer?.completedTasks || 0}
          onCompleteTask={handleCompleteTask}
        />
      </div>
    </div>
  );
}