import React, { useState } from 'react';
import { ClipboardList, Plus, X } from 'lucide-react';

interface TaskManagerProps {
  tasks: string[];
  onUpdateTasks: (tasks: string[]) => void;
}

export default function TaskManager({ tasks, onUpdateTasks }: TaskManagerProps) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onUpdateTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (index: number) => {
    onUpdateTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/90 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="text-amber-700" />
        <h2 className="text-xl font-semibold text-amber-900">Available Tasks</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 px-3 py-2 border border-amber-200 rounded-lg"
        />
        <button
          onClick={handleAddTask}
          className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
          >
            <span className="text-amber-900">{task}</span>
            <button
              onClick={() => handleRemoveTask(index)}
              className="p-1 text-amber-700 hover:text-amber-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}