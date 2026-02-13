import { UUID } from 'crypto';

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'planned';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  estimatedTokens: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  phase: string;
  tasks: Task[];
  color: string;
}

export interface CostTracking {
  totalBudget: number;
  spent: number;
  remaining: number;
}

export interface Dashboard {
  projects: Record<string, Project>;
  costTracking: CostTracking;
  lastUpdated: string;
}

export interface DragContext {
  draggedTask: Task | null;
  sourceStatus: TaskStatus | null;
}
