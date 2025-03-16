'use client';

import { Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3 sm:space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      {tasks.length === 0 && (
        <div className="py-8 text-center sm:py-12">
          <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">
            No tasks yet. Add your first task to get started!
          </p>
        </div>
      )}
    </div>
  );
}
