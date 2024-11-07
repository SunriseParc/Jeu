import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskListProps {
  tasks: string[];
  completedTasks: number;
  onCompleteTask?: (index: number) => void;
  isImpostor?: boolean;
}

export default function TaskList({ tasks, completedTasks, onCompleteTask, isImpostor }: TaskListProps) {
  return (
    <div className="bg-white/90 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-4">
        {isImpostor ? 'Fake Tasks' : 'Tasks'} ({completedTasks}/{tasks.length})
      </h2>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index < completedTasks ? 'bg-green-50' : 'bg-amber-50'
            }`}
          >
            <span className="text-amber-900">{task}</span>
            {onCompleteTask && index === completedTasks && !isImpostor && (
              <button
                onClick={() => onCompleteTask(index)}
                className="p-1 text-amber-700 hover:text-amber-900 transition-colors"
              >
                <Circle size={20} />
              </button>
            )}
            {index < completedTasks && (
              <CheckCircle2 size={20} className="text-green-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}