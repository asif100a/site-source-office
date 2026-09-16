import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import WalletImg from '@/assets/images/auth/money-bag.png';
import ProgressImg from '@/assets/images/auth/progress.png';
import CheckmarkImg from '@/assets/images/auth/checkmark.png';

interface CompletePayrollScreenProps {
  onComplete: () => void;
  onBackPress?: () => void;
  paymentUserId?: string;
}

type SubStep = 'initial' | 'review' | 'completed' | 'failed';

type PaymentStatus = 'SUBMITTED' | 'PROCESSING' | 'PAID' | 'FAILED';

type PaymentResponse = {
  status: PaymentStatus;
  failureReason?: string;
};

const paymentApiUrl = process.env.EXPO_PUBLIC_PAYMENT_API_URL;
const paymentApiKey = process.env.EXPO_PUBLIC_PAYMENT_API_KEY;

export default function CompletePayrollScreen({
  onComplete,
  paymentUserId,
}: CompletePayrollScreenProps) {
  const [subStep, setSubStep] = useState<SubStep>('initial');
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const paymentIds = useMemo(() => {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      jobId: `PAYROLL-${requestId}`,
      invoiceId: `PAYROLL-CONNECTION-${requestId}`,
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [subStep]);

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const getPaymentStatus = async () => {
    const response = await fetch(
      `${paymentApiUrl}/payments/${encodeURIComponent(paymentIds.jobId)}/${encodeURIComponent(paymentIds.invoiceId)}`,
      { headers: { 'x-api-key': paymentApiKey ?? '' } },
    );
    const body = (await response.json()) as PaymentResponse & { detail?: string };
    if (!response.ok) throw new Error(body.detail ?? 'Unable to check payment status.');
    return body;
  };

  const checkPaymentStatus = async () => {
    try {
      const payment = await getPaymentStatus();
      if (payment.status === 'SUBMITTED') {
        setStatusText('Payroll request submitted. Connecting to the payment provider…');
      } else if (payment.status === 'PROCESSING') {
        setStatusText('Your payroll connection is being processed…');
      } else if (payment.status === 'PAID') {
        stopPolling();
        setSubStep('completed');
      } else {
        stopPolling();
        setErrorMessage(payment.failureReason ?? 'The payment provider could not complete this request.');
        setSubStep('failed');
      }
    } catch (error) {
      stopPolling();
      setErrorMessage(error instanceof Error ? error.message : 'Unable to check payment status.');
      setSubStep('failed');
    }
  };

  const startPayment = async () => {
    if (!paymentApiUrl || !paymentApiKey) {
      setErrorMessage('Payment is not configured. Add the payment API URL and key to the app environment.');
      setSubStep('failed');
      return;
    }

    setSubStep('review');
    setStatusText('Starting your payroll connection…');
    const today = new Date().toISOString().slice(0, 10);

    try {
      const response = await fetch(`${paymentApiUrl}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': paymentApiKey },
        body: JSON.stringify({
          userId: paymentUserId || 'PAYROLL-USER',
          jobId: paymentIds.jobId,
          invoiceId: paymentIds.invoiceId,
          siteId: 'PAYROLL-PROFILE',
          invoiceAmount: '0.00',
          expenses: '0.00',
          expensesDescription: 'Employment partner profile connection',
          dateFrom: today,
          dateTo: today,
        }),
      });
      const body = (await response.json()) as PaymentResponse & { detail?: string };
      if (!response.ok) throw new Error(body.detail ?? 'Unable to start payment.');

      setStatusText('Payroll request submitted. Connecting to the payment provider…');
      pollTimer.current = setInterval(() => void checkPaymentStatus(), 5_000);
      void checkPaymentStatus();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start payment.');
      setSubStep('failed');
    }
  };

  if (subStep === 'review') {
    return (
      <View className="flex-1 bg-white justify-between px-6 pt-16 pb-10">
        {/* Centered Illustration & Text for Review state */}
        <View className="flex-1 justify-center items-center mt-10">
          <Image
            source={ProgressImg}
            style={{ width: 160, height: 160, resizeMode: 'contain' }}
          />
          <Text className="text-[#1B2530] text-[26px] font-bold text-center mt-6 tracking-tight leading-6 px-4">
            Connecting Payroll
          </Text>
          <Text className="text-neutral-500 text-sm text-center mt-3 font-medium leading-6 px-8">
            {statusText}
          </Text>
        </View>

        {/* Empty placeholder at bottom to match layout spacing */}
        <View className="h-10" />
      </View>
    );
  }

  if (subStep === 'failed') {
    return (
      <View className="flex-1 bg-white justify-between px-6 pt-16 pb-10">
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-[#1B2530] text-[26px] font-bold text-center">Unable to Connect Payroll</Text>
          <Text className="text-neutral-500 text-sm text-center mt-3 font-medium leading-6 px-8">{errorMessage}</Text>
        </View>
        <TouchableOpacity onPress={() => setSubStep('initial')} activeOpacity={0.9} className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center">
          <Text className="text-white text-base font-semibold">Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Both 'initial' and 'completed' substeps share the base "Complete Employment Partner Profile" layout
  const isCompleted = subStep === 'completed';

  return (
    <View className="flex-1 bg-white justify-between px-6 pt-16 pb-10">
      {/* Centered Illustration & Text */}
      <View className="flex-1 justify-center items-center mt-10">
        <Image
          source={WalletImg}
          style={{ width: 160, height: 160, resizeMode: 'contain' }}
        />
        <Text className="text-[#1B2530] text-[26px] font-bold text-center mt-4 tracking-tight leading-6 px-4">
          Complete Employment Partner Profile
        </Text>
        <Text className="text-neutral-500 text-sm text-center mt-3 font-medium leading-5 px-6">
          Connect your payroll partner to continue
        </Text>
      </View>

      {/* Action Button at the Bottom */}
      <View className="w-full mt-6">
        <TouchableOpacity
          onPress={() => void startPayment()}
          activeOpacity={0.9}
          className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
        >
          <Text className="text-white text-base font-semibold">
            {isCompleted ? 'Connect Payroll' : 'Complete Employment Partner Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal Overlay */}
      <Modal
        visible={isCompleted}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View className="flex-1 bg-neutral-500/60 justify-center items-center px-6">
          <View className="w-full bg-white rounded-[32px] p-8 items-center">
            {/* Glossy Green Checkmark Badge */}
            <Image
              source={CheckmarkImg}
              style={{ width: 90, height: 90, resizeMode: 'contain' }}
            />
            
            <Text className="text-[#1B2530] text-2xl font-bold text-center mt-6 tracking-tight">
              Profile Completed
            </Text>
            
            <Text className="text-neutral-500 text-sm text-center mt-3 font-medium leading-relaxed px-4">
              Congratulations, your profile is complete. You can now start searching for jobs!
            </Text>

            {/* Dashboard Redirect Action */}
            <TouchableOpacity
              onPress={onComplete}
              activeOpacity={0.9}
              className="w-full bg-[#1B2530] py-4 rounded-xl mt-8 items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-semibold">
                Login now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
