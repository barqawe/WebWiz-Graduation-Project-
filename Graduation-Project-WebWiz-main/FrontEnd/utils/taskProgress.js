// Task progress management utility
export const STORAGE_KEY = 'webwiz_task_progress';

export const getTaskProgress = (pathId) => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  
  try {
    const progress = JSON.parse(stored);
    return progress[pathId] || {};
  } catch {
    return {};
  }
};

export const updateTaskProgress = (pathId, taskId, completed = true) => {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  let progress = {};
  
  try {
    progress = stored ? JSON.parse(stored) : {};
  } catch {
    progress = {};
  }
  
  if (!progress[pathId]) progress[pathId] = {};
  
  progress[pathId][taskId] = {
    completed,
    completedAt: completed ? new Date().toISOString() : null,
    unlocked: true
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  
  // Unlock next task if current is completed
  if (completed) {
    const nextTaskId = taskId + 1;
    if (!progress[pathId][nextTaskId]) {
      progress[pathId][nextTaskId] = { unlocked: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }
  
  return progress[pathId];
};

export const isTaskUnlocked = (pathId, taskId) => {
  const progress = getTaskProgress(pathId);
  
  // First task is always unlocked
  if (taskId === 1) return true;
  
  // Check if previous task is completed
  const prevTaskProgress = progress[taskId - 1];
  return prevTaskProgress?.completed || false;
};

export const getCompletedTasksCount = (pathId) => {
  const progress = getTaskProgress(pathId);
  return Object.values(progress).filter(task => task.completed).length;
};

export const getTotalPoints = (pathId, taskList) => {
  const progress = getTaskProgress(pathId);
  return taskList
    .filter(task => progress[task.id]?.completed)
    .reduce((sum, task) => sum + (task.points || 0), 0);
};

export const resetProgress = (pathId) => {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  let progress = {};
  
  try {
    progress = stored ? JSON.parse(stored) : {};
  } catch {
    progress = {};
  }
  
  // Reset the specific path, but keep first task unlocked
  progress[pathId] = { 1: { unlocked: true } };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  
  return progress[pathId];
};

export const getAllProgress = () => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};
