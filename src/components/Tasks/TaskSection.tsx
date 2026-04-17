import React from 'react';
import { CheckCircle2, Trash2, ChevronUp } from 'lucide-react';
import { Task } from '../../types';

interface TaskSectionProps {
  taskInput: string;
  setTaskInput: (val: string) => void;
  addTask: (e: React.FormEvent) => void;
  sortedTasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  onGoHome: () => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  taskInput,
  setTaskInput,
  addTask,
  sortedTasks,
  toggleTask,
  deleteTask,
  onGoHome
}) => {
  return (
    <section className="h-screen w-full relative flex flex-col items-center justify-center px-6 bg-black/5">
      <div className="w-full max-w-lg">
        <h2 className="text-gray-100 text-sm font-light tracking-[0.5em] uppercase mb-12 text-center">Tasks</h2>
        
        <form onSubmit={addTask} className="mb-10">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-transparent border-b border-gray-800/30 py-3 text-center text-xl font-extralight text-gray-200 focus:outline-none focus:border-gray-700/40 transition-all placeholder-gray-800"
          />
        </form>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar" onWheel={(e) => e.stopPropagation()}>
          {sortedTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between group py-2">
              <div className="flex items-center space-x-4 flex-1">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`transition-colors ${task.completed ? 'text-emerald-500/40' : 'text-gray-700 hover:text-gray-400'}`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <span className={`text-base font-light transition-all ${task.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                  {task.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-700 hover:text-red-900/60 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity animate-pulse cursor-pointer">
          <button onClick={onGoHome} className="group flex flex-col items-center">
            <ChevronUp className="w-5 h-5 text-gray-100 group-hover:text-white transition-colors mb-1" />
            <span className="text-[8px] uppercase tracking-[0.4em] text-gray-100 font-light group-hover:text-white transition-colors">Home</span>
          </button>
        </div>
      </div>
    </section>
  );
};
