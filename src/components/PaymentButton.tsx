'use client';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from './ui/button';

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
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'user@example.com',
      phone_number: '123456789',
      name: 'John Doe',
    },
    customizations: {
      title: 'Task Payment',
      description: `Payment for task ${taskId}`,
      logo: 'https://example.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            if (response.status === 'successful') {
              onSuccess();
            }
            closePaymentModal();
          },
          onClose: () => {},
        });
      }}
      disabled={amount <= 0}
    >
      Pay ${amount.toFixed(2)}
    </Button>
  );
}
