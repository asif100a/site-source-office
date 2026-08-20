import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import LogoWhite from '@/assets/icons/LogoWhite';
import { useForm } from 'react-hook-form';
import StandardInputField from '@/components/standard_ui/form_fields/StandardInputField';
import { Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { getDashboardRouteForRole, normalizeUserRole, UserRole } from '@/constants/Routes';

interface RegisterPasswordScreenProps {
  role?: UserRole;
  onComplete?: (password: string) => void;
  onBackPress?: () => void;
}

export default function RegisterPasswordScreen({
  role,
  onComplete,
}: RegisterPasswordScreenProps) {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const activeRole = normalizeUserRole(role);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.'
      });
      return;
    }
    if (onComplete) {
      onComplete(data.password);
    } else {
      router.replace(getDashboardRouteForRole(activeRole));
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-white" 
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      {/* Orange Header Section - Styled "Register Your Account" */}
      <View className="bg-[#FF5500] pb-10 px-6">
        <View className="mb-4 justify-center items-center">
          <LogoWhite />
        </View>
        <Text className="text-white text-3xl font-bold tracking-tight">
          Create Your Password
        </Text>
      </View>

      {/* Password Setup Form */}
      <View className="flex-1 px-6 pt-8 pb-10 justify-between">
        <View className="gap-1">
          {/* Password */}
          <StandardInputField
            label="Password"
            id="password"
            type="password"
            control={control}
            required={true}
            placeholder="•••••••"
          />

          {/* Confirm Password */}
          <StandardInputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            control={control}
            required={true}
            placeholder="•••••••"
          />

          {/* Remember Me Checkbox */}
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
            className="flex-row items-center gap-3 mt-1.5 py-1"
          >
            <View className={`w-5 h-5 rounded-md items-center justify-center border ${
              rememberMe ? 'bg-[#FF5500] border-[#FF5500]' : 'bg-[#FCFCFC] border-neutral-300'
            }`}>
              {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text className="text-neutral-700 text-sm font-medium">
              Remember me
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complete Registration Action */}
        <View className="mt-10">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.9}
            className="w-full bg-[#1B2530] py-4 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-semibold">
              Complete Registration
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
