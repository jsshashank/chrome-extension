import { useState, useEffect } from 'react';
import { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [taskInput, setTaskInput] = useState('');
  const [goal, setGoal] = useState(() => localStorage.getItem('dailyGoal') || '');
  const [isCompleted, setIsCompleted] = useState(() => localStorage.getItem('goalCompleted') === 'true');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('goalCompleted', String(isCompleted));
    localStorage.setItem('dailyGoal', goal);
  }, [tasks, isCompleted, goal]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      setTasks([{ id: Date.now().toString(), text: taskInput.trim(), completed: false }, ...tasks]);
      setTaskInput('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

  return { 
    tasks, 
    taskInput, 
    setTaskInput, 
    goal, 
    setGoal, 
    isCompleted, 
    setIsCompleted, 
    addTask, 
    toggleTask, 
    deleteTask, 
    sortedTasks 
  };
}
