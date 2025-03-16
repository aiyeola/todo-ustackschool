'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { GripVertical, Trash2, Edit, Youtube, CreditCard } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import PaymentButton from '@/components/PaymentButton';
import TaskForm from '@/components/TaskForm';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setShowVideo(false);
    setShowPayment(false);
  }, [JSON.stringify(task)]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const updateTask = (task: Task) => {
    onUpdate(task);
    setIsFormOpen(false);
  };

  return (
    <div key={JSON.stringify(task)}>
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-4 ${task.completed ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={toggleComplete}
                id={`task-${task.id}`}
              />
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? 'text-gray-500 line-through' : ''
                }`}
              >
                {task.title}
              </h3>
              <Badge
                variant="secondary"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
            </div>

            <p className="mb-2 text-gray-600 dark:text-gray-300">
              {task.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>

              {task.videoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-1"
                >
                  <Youtube className="h-4 w-4" />
                  {showVideo ? 'Hide Video' : 'Show Video'}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPayment(!showPayment)}
                className="flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                Payment
              </Button>
            </div>

            {showVideo && task.videoUrl && (
              <div className="mt-4">
                <VideoPlayer url={task.videoUrl} />
              </div>
            )}

            {showPayment && (
              <div className="mt-4">
                <PaymentButton
                  taskId={task.id}
                  amount={task.paymentAmount || 0}
                  onSuccess={() => setShowPayment(false)}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!task.completed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsFormOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={updateTask}
        initialData={task}
      />
    </div>
  );
}
