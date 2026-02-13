import { useState, useCallback, useEffect } from 'react';
import { Dashboard, Task, TaskStatus, Project } from '../types';

const STORAGE_KEY = 'dashboard_state';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDashboard(parsed);
          setLoading(false);
          return;
        }
        
        // Load from tracker.json if available
        try {
          const response = await fetch('/tracker.json');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const data = await response.json();
          const transformed: Dashboard = {
            projects: data.projects || {},
            costTracking: data.costTracking || { totalBudget: 0, spent: 0, remaining: 0 },
            lastUpdated: data.lastUpdated || new Date().toISOString(),
          };
          setDashboard(transformed);
        } catch (fetchErr) {
          console.warn('tracker.json not found, using empty state:', fetchErr);
          // Create default empty state
          const defaultDashboard: Dashboard = {
            projects: {},
            costTracking: { totalBudget: 100, spent: 0, remaining: 100 },
            lastUpdated: new Date().toISOString(),
          };
          setDashboard(defaultDashboard);
        }
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
