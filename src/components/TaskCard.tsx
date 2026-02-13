import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Trash2, GripHorizontal, Flag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent) => void;
}

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${colors[priority]}`}>
      <Flag size={12} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const statusConfig = {
    todo: { label: 'To Do', color: 'bg-slate-600' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-600' },
    done: { label: 'Done', color: 'bg-green-600' },
    planned: { label: 'Planned', color: 'bg-purple-600' },
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}>
      {config.label}
    </span>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onStatusChange,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 cursor-move hover:bg-slate-700/80 hover:border-slate-500/80 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      {/* Header with drag handle and delete button */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <GripHorizontal size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        <button
          onClick={onDelete}
          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-red-500/10 rounded"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm text-white mb-2 line-clamp-2">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, idx) => (
            <span key={`${task.id}-tag-${idx}`} className="inline-block px-2 py-0.5 bg-slate-600/50 text-slate-300 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Priority and Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>

      {/* Cost and Tokens */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-600/30 pt-3">
        <span>${task.cost.toFixed(2)}</span>
        <span>{task.estimatedTokens.toLocaleString()} tokens</span>
      </div>
    </div>
  );
};
