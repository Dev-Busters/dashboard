import React, { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { KanbanColumn } from './components/KanbanColumn';
import { Task, TaskStatus, TaskPriority } from './types';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

type DragData = {
  taskId: string;
  fromProjectId: string;
  fromStatus: TaskStatus;
};

export default function App() {
  const { dashboard, loading, error, updateTaskStatus, deleteTask } = useDashboard();
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <p className="text-slate-400">Loading command center...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center text-red-400">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    );
  }

  const projects = Object.values(dashboard.projects);
  const selectedProject = activeProject 
    ? dashboard.projects[activeProject]
    : projects[0];

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center text-slate-400">
          <p>No projects found</p>
        </div>
      </div>
    );
  }

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done', 'planned'];
  const columnColors = {
    todo: 'bg-gradient-to-r from-slate-600 to-slate-700',
    'in-progress': 'bg-gradient-to-r from-blue-600 to-blue-700',
    done: 'bg-gradient-to-r from-green-600 to-green-700',
    planned: 'bg-gradient-to-r from-purple-600 to-purple-700',
  };

  const columnTitles = {
    todo: '📋 To Do',
    'in-progress': '⚙️ In Progress',
    done: '✅ Done',
    planned: '📅 Planned',
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, fromStatus: TaskStatus) => {
    const data: DragData = {
      taskId,
      fromProjectId: selectedProject.id,
      fromStatus,
    };
    setDragData(data);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toStatus: TaskStatus) => {
    e.preventDefault();
    if (!dragData) return;

    if (dragData.fromStatus !== toStatus) {
      updateTaskStatus(dragData.fromProjectId, dragData.taskId, toStatus);
    }
    setDragData(null);
  };

  const totalCost = selectedProject.tasks.reduce((sum, task) => sum + task.cost, 0);
  const completedTasks = selectedProject.tasks.filter(t => t.status === 'done').length;
  const completionRate = selectedProject.tasks.length > 0
    ? Math.round((completedTasks / selectedProject.tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Buster's Command Center</h1>
                <p className="text-slate-400 text-sm mt-1">Stay organized, ship faster, dominate projects</p>
              </div>
            </div>

            {/* Budget Card */}
            <div className="flex-shrink-0 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-slate-400 mb-1">Budget Status</div>
              <div className="text-2xl font-bold text-green-400">${dashboard.costTracking.remaining.toFixed(2)}</div>
              <div className="text-xs text-slate-500 mt-1">
                Spent: ${dashboard.costTracking.spent.toFixed(2)} / ${dashboard.costTracking.totalBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Project Selector */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedProject.id === project.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                }`}
              >
                <span className="mr-2">{project.emoji}</span>
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Info & Stats */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-slate-300 mb-4">{selectedProject.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Completion */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-400" />
                <span className="text-sm text-slate-400">Completion</span>
              </div>
              <div className="text-2xl font-bold text-white">{completionRate}%</div>
              <div className="text-xs text-slate-500 mt-1">{completedTasks} of {selectedProject.tasks.length} done</div>
            </div>

            {/* Project Cost */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💰</span>
                <span className="text-sm text-slate-400">Project Cost</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">${totalCost.toFixed(2)}</div>
              <div className="text-xs text-slate-500 mt-1">{selectedProject.tasks.length} tasks</div>
            </div>

            {/* Phase */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-purple-400" />
                <span className="text-sm text-slate-400">Phase</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{selectedProject.phase}</div>
              <div className="text-xs text-slate-500 mt-1">Current milestone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
          {statuses.map(status => {
            const columnTasks = selectedProject.tasks.filter(t => t.status === status);
            return (
              <KanbanColumn
                key={status}
                title={columnTitles[status]}
                status={status}
                tasks={columnTasks}
                projectId={selectedProject.id}
                color={columnColors[status]}
                onTaskDelete={taskId => deleteTask(selectedProject.id, taskId)}
                onTaskStatusChange={(taskId, newStatus) =>
                  updateTaskStatus(selectedProject.id, taskId, newStatus)
                }
                onTaskDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500 text-sm">
          <p>Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}</p>
        </div>
      </footer>
    </div>
  );
}
