import React from 'react';

interface TaskProgressProps {
  totalTasks: number;
  completedTasks: number;
}

export default function TaskProgress({ totalTasks, completedTasks }: TaskProgressProps) {
  const percentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="bg-white/90 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-2">Overall Progress</h2>
      <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-amber-800 mt-2 text-center">
        {completedTasks} of {totalTasks} tasks completed ({percentage}%)
      </p>
    </div>
  );
}