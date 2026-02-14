import { useState, useCallback, useEffect } from 'react';
import { Dashboard, Task, TaskStatus, Project } from '../types';

const STORAGE_KEY = 'dashboard_state';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from tracker.json on mount (always fetch latest)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Always fetch tracker.json first for latest data
        try {
          const response = await fetch('/tracker.json?v=' + Date.now()); // Cache buster
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const data = await response.json();
          const transformed: Dashboard = {
            projects: data.projects || {},
            costTracking: data.costTracking || { totalBudget: 0, spent: 0, remaining: 0 },
            lastUpdated: data.lastUpdated || new Date().toISOString(),
          };
          setDashboard(transformed);
          // Also save to localStorage for offline access
          localStorage.setItem(STORAGE_KEY, JSON.stringify(transformed));
          setLoading(false);
          return;
        } catch (fetchErr) {
          console.warn('tracker.json fetch failed, trying localStorage:', fetchErr);
        }
        
        // Fallback to localStorage if tracker.json fetch fails
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDashboard(parsed);
          setLoading(false);
          return;
        }
        
        // Create default empty state with sample project
        const defaultDashboard: Dashboard = {
          projects: {
            'sample-project': {
              id: 'sample-project',
              name: 'Sample Project',
              emoji: '🎯',
              description: 'Welcome to your command center! Start by adding tasks to track your work.',
              phase: 'Getting Started',
              color: 'bg-blue-600',
              tasks: [],
            },
          },
          costTracking: { totalBudget: 100, spent: 0, remaining: 100 },
          lastUpdated: new Date().toISOString(),
        };
        setDashboard(defaultDashboard);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, []);

  // Save to localStorage whenever dashboard changes
  useEffect(() => {
    if (dashboard) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboard));
    }
  }, [dashboard]);

  const updateTaskStatus = useCallback((
    projectId: string,
    taskId: string,
    newStatus: TaskStatus
  ) => {
    setDashboard(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...prev.projects[projectId],
            tasks: prev.projects[projectId].tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
            ),
          },
        },
      };
    });
  }, []);

  const addTask = useCallback((projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setDashboard(prev => {
      if (!prev) return prev;
      
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...prev.projects[projectId],
            tasks: [...prev.projects[projectId].tasks, newTask],
          },
        },
      };
    });
  }, []);

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    setDashboard(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...prev.projects[projectId],
            tasks: prev.projects[projectId].tasks.filter(task => task.id !== taskId),
          },
        },
      };
    });
  }, []);

  const updateTask = useCallback((projectId: string, taskId: string, updates: Partial<Task>) => {
    setDashboard(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...prev.projects[projectId],
            tasks: prev.projects[projectId].tasks.map(task =>
              task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
            ),
          },
        },
      };
    });
  }, []);

  return {
    dashboard,
    loading,
    error,
    updateTaskStatus,
    addTask,
    deleteTask,
    updateTask,
  };
};
