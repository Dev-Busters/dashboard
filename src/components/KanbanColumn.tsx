import React from 'react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  projectId: string;
  color: string;
  onTaskDelete: (taskId: string) => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskDragStart: (e: React.DragEvent, taskId: string, fromStatus: TaskStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, toStatus: TaskStatus) => void;
  onAddTask?: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  projectId,
  color,
  onTaskDelete,
  onTaskStatusChange,
  onTaskDragStart,
  onDragOver,
  onDrop,
  onAddTask,
}) => {
  const completionPercentage = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full min-h-screen md:min-h-auto md:h-auto">
      {/* Column Header */}
      <div className={`${color} rounded-t-lg p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg">{title}</h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">{tasks.length}</span>
        </div>
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium">{completionPercentage}%</span>
          </div>
        )}
      </div>

      {/* Column Content */}
      <div
        onDragOver={onDragOver}
        onDrop={e => onDrop(e, status)}
        className="flex-1 bg-slate-800/30 p-4 space-y-3 border border-slate-700/50 border-t-0 rounded-b-lg backdrop-blur-sm overflow-y-auto"
      >
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onTaskDelete(task.id)}
            onStatusChange={newStatus => onTaskStatusChange(task.id, newStatus)}
            onDragStart={e => onTaskDragStart(e, task.id, status)}
          />
        ))}

        {/* Add Task Button */}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="w-full py-3 px-4 border-2 border-dashed border-slate-600/50 rounded-lg hover:border-slate-500 hover:bg-slate-700/30 transition-all duration-200 text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add Task
          </button>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !onAddTask && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm">All clear here!</p>
          </div>
        )}
      </div>
    </div>
  );
};
