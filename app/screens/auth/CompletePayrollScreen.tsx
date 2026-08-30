import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import WalletImg from '@/assets/images/auth/money-bag.png';
import ProgressImg from '@/assets/images/auth/progress.png';
import CheckmarkImg from '@/assets/images/auth/checkmark.png';

interface CompletePayrollScreenProps {
  onComplete: () => void;
  onBackPress?: () => void;
}

type SubStep = 'initial' | 'review' | 'completed';

export default function CompletePayrollScreen({
  onComplete,
}: CompletePayrollScreenProps) {
  const [subStep, setSubStep] = useState<SubStep>('initial');

  useEffect(() => {
    if (subStep === 'review') {
      const timer = setTimeout(() => {
        setSubStep('completed');
      }, 2000); // 2 seconds simulated review time
      return () => clearTimeout(timer);
    }
  }, [subStep]);

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
            Application Under Review
          </Text>
          <Text className="text-neutral-500 text-sm text-center mt-3 font-medium leading-6 px-8">
            Your account is under review by our team. You'll be notified as soon as it's approved, and then you can log in.
          </Text>
        </View>

        {/* Empty placeholder at bottom to match layout spacing */}
        <View className="h-10" />
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
          onPress={() => setSubStep('review')}
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
