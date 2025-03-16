export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  videoUrl?: string;
  paymentAmount?: number;
  order: number;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
}
