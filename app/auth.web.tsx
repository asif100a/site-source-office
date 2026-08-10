import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  type UserRole,
} from "@/constants/Routes";

import LoginScreen from "./screens/auth/LoginScreen";
import RegisterGeneralScreen from "./screens/auth/RegisterGeneralScreen";
import RegisterDocumentsScreen from "./screens/auth/RegisterDocumentsScreen";
import RegisterPasswordScreen from "./screens/auth/RegisterPasswordScreen";
import CompletePayrollScreen from "./screens/auth/CompletePayrollScreen";
import ReviewScreen from "./screens/auth/ReviewScreen";
import RegisterEmployerScreen from "./screens/auth/RegisterEmployerScreen";
import RegisterSsoScreen from "./screens/auth/RegisterSsoScreen";

const WEB_ROLE_STORAGE_KEY = "site-source.active-role";

type AuthStep =
  | "login"
  | "register_sso"
  | "register_general"
  | "register_employer"
  | "register_documents"
  | "register_password"
  | "complete_payroll"
  | "review";

export default function AuthFlowWeb() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialStep = (params.step as AuthStep) || "login";

  const [step, setStep] = useState<AuthStep>(initialStep);
  const [role, setRole] = useState<UserRole>(normalizeUserRole(params.role));

  const currentStep = params?.currentStep as AuthStep;

  useEffect(() => {
    if (currentStep) {
      setStep(currentStep);
    }
  }, [currentStep]);

  useEffect(() => {
    setRole(normalizeUserRole(params.role));
  }, [params.role]);

  useEffect(() => {
    if (params.step) {
      setStep(params.step as AuthStep);
    }
  }, [params.step]);

  const goToRoleDashboard = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(WEB_ROLE_STORAGE_KEY, role);
    }
    router.replace(getDashboardRouteForRole(role));
  };

  const goToPostRegistrationRoute = () => {
    const returnTo = Array.isArray(params.returnTo)
      ? params.returnTo[0]
      : params.returnTo;

    if (returnTo) {
      router.replace(returnTo as any);
      return;
    }

    goToRoleDashboard();
  };

  const goToRegisterForCurrentRole = () => {
    const currentRole = params.role ? normalizeUserRole(params.role) : role;
    setRole(currentRole);
    setStep(currentRole === "employer" ? "register_employer" : "register_sso");
  };

  const renderActiveScreen = () => {
    if (
      role === "employer" &&
      (step === "register_general" || step === "register_employer")
    ) {
      return (
        <RegisterEmployerScreen
          onContinue={(data) => {
            console.log("Employer register data:", data);
            setStep("complete_payroll");
          }}
          onLoginPress={() => setStep("login")}
        />
      );
    }

    switch (step) {
      case "login":
        return (
          <LoginScreen
            role={role}
            onRegisterPress={goToRegisterForCurrentRole}
            onLoginPress={goToRoleDashboard}
          />
        );
      case "register_sso":
        return (
          <RegisterSsoScreen
            onContinue={(data) => {
              console.log("Worker registration data:", data);
              setStep("register_general");
            }}
            onLoginPress={() => setStep("login")}
          />
        );
      case "register_general":
        return (
          <RegisterGeneralScreen
            role={role}
            onContinue={(data) => {
              console.log("General register data:", data);
              setStep("register_documents");
            }}
            onLoginPress={() => setStep("login")}
          />
        );
      case "register_documents":
        return (
          <RegisterDocumentsScreen
            role={role}
            onContinue={(docs) => {
              console.log("Uploaded documents:", docs);
              setStep("register_password");
            }}
          />
        );
      case "register_password":
        return (
          <RegisterPasswordScreen
            role={role}
            onComplete={() => {
              if (role === "employer") {
                setStep("review");
              } else {
                setStep("complete_payroll");
              }
            }}
          />
        );
      case "complete_payroll":
        return (
          <CompletePayrollScreen
            onComplete={() => {
              if (role === "employer") {
                setStep("review");
              } else {
                goToPostRegistrationRoute();
              }
            }}
          />
        );
      case "review":
        return <ReviewScreen onBackToLogin={() => setStep("login")} />;
      default:
        return (
          <LoginScreen
            role={role}
            onRegisterPress={goToRegisterForCurrentRole}
            onLoginPress={goToRoleDashboard}
          />
        );
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50 justify-center items-center">
      <View className="max-w-full w-full md:min-w-xl xl:min-w-3xl">
        {renderActiveScreen()}
      </View>
    </ScrollView>
  );
}
