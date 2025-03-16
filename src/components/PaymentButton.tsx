'use client';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/use-currency';

interface PaymentButtonProps {
  taskId: string;
  amount: number;
  onSuccess: () => void;
}

export default function PaymentButton({
  taskId,
  amount,
  onSuccess,
}: PaymentButtonProps) {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'user@example.com',
      phone_number: '123456789',
      name: 'John Doe',
    },
    customizations: {
      title: 'Task Payment',
      description: `Payment for task ${taskId}`,
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            if (response.status === 'completed') {
              onSuccess();
            }
            closePaymentModal();
          },
          onClose: () => {},
        });
      }}
      disabled={amount <= 0}
    >
      Pay {formatNumber(amount)}
    </Button>
  );
}
