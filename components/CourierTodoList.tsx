'use client';
import { getLocaleTheme } from '@/lib/languages';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export default function CourierTodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Accept new delivery', done: false },
    { id: 2, text: 'Update delivery status', done: false },
    { id: 3, text: 'View earnings summary', done: false },
  ]);
  const [input, setInput] = useState('');
  const locale = useLocale();
  const theme = getLocaleTheme(locale);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input.trim(), done: false }]);
      setInput('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  return (
    <div
      className="rounded-lg shadow-md p-4 mb-8"
      style={{ background: theme.gradient, color: theme.accent }}
      aria-label="Courier To-Do List"
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>To-Do List</h2>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center">
            <button
              aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 mr-2 rounded-full border-2 flex items-center justify-center focus:outline-none ${task.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
            >
              {task.done && <span className="block w-3 h-3 bg-white rounded-full" />}
            </button>
            <span className={`flex-1 text-base ${task.done ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 rounded-l px-3 py-2 border border-gray-300 focus:ring focus:ring-blue-200"
          placeholder="Add a new task..."
          aria-label="Add a new task"
        />
        <button
          onClick={addTask}
          className="rounded-r px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none"
          aria-label="Add task"
        >
          Add
        </button>
      </div>
    </div>
  );
}
