import { useState, useCallback, useEffect } from 'react';
import { Dashboard, Task, TaskStatus, Project } from '../types';

const STORAGE_KEY = 'dashboard_state';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDashboard(parsed);
      } else {
        // Load from tracker.json if available
        fetch('/tracker.json')
          .then(res => res.json())
          .then(data => {
            const transformed: Dashboard = {
              projects: data.projects || {},
              costTracking: data.costTracking || { totalBudget: 0, spent: 0, remaining: 0 },
              lastUpdated: new Date().toISOString(),
            };
            setDashboard(transformed);
          })
          .catch(err => {
            console.error('Failed to load tracker.json:', err);
            setError('Failed to load dashboard data');
          });
      }
    } catch (err) {
      console.error('Failed to parse stored dashboard:', err);
      setError('Failed to parse dashboard data');
    } finally {
      setLoading(false);
    }
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
