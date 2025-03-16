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
import { toast } from 'sonner';

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

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast.success('Payment successful');
  };

  return (
    <div key={JSON.stringify(task)}>
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-3 sm:p-4 ${task.completed ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div
            {...attributes}
            {...listeners}
            className="hidden cursor-grab touch-none sm:block"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={toggleComplete}
                id={`task-${task.id}`}
              />
              <h3
                className={`truncate text-base font-semibold sm:text-lg ${
                  task.completed ? 'text-gray-500 line-through' : ''
                }`}
              >
                {task.title}
              </h3>
              <Badge
                variant="secondary"
                className={`${priorityColors[task.priority]} text-xs sm:text-sm`}
              >
                {task.priority}
              </Badge>
            </div>

            <p className="mb-2 line-clamp-2 text-sm text-gray-600 sm:line-clamp-none sm:text-base dark:text-gray-300">
              {task.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:gap-4 sm:text-sm">
              <span className="whitespace-nowrap">
                Due: {format(new Date(task.dueDate), 'PPP')}
              </span>

              {task.videoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-1 text-xs sm:text-sm"
                >
                  <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">
                    {showVideo ? 'Hide Video' : 'Show Video'}
                  </span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPayment(!showPayment)}
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Payment</span>
              </Button>
            </div>

            {showVideo && task.videoUrl && (
              <div className="mt-3 w-full sm:mt-4">
                <VideoPlayer url={task.videoUrl} />
              </div>
            )}

            {showPayment && (
              <div className="mt-3 sm:mt-4">
                <PaymentButton
                  taskId={task.id}
                  amount={task.paymentAmount || 0}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>

          <div className="flex gap-1 sm:gap-2">
            {!task.completed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsFormOpen(true);
                }}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
