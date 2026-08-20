import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  type UserRole,
} from "@/constants/Routes";
import {
  markUserAuthenticated,
  setActiveRole,
} from "@/constants/authState";

import LoginScreen from "./screens/auth/LoginScreen";
import RegisterGeneralScreen from "./screens/auth/RegisterGeneralScreen";
import RegisterDocumentsScreen from "./screens/auth/RegisterDocumentsScreen";
import RegisterPasswordScreen from "./screens/auth/RegisterPasswordScreen";
import CompletePayrollScreen from "./screens/auth/CompletePayrollScreen";
import ReviewScreen from "./screens/auth/ReviewScreen";
import RegisterEmployerScreen from "./screens/auth/RegisterEmployerScreen";
import RegisterSsoScreen from "./screens/auth/RegisterSsoScreen";
import VerifyOtpScreen from "./screens/auth/VerifyOtpScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";

type AuthStep =
  | "login"
  | "register_sso"
  | "register_general"
  | "register_employer"
  | "verify_otp"
  | "forgot_password"
  | "reset_password"
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
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationName, setRegistrationName] = useState("");
  const [registrationProvider, setRegistrationProvider] = useState<
    "google" | "apple" | "manual"
  >("manual");
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [otpFlow, setOtpFlow] = useState<"registration" | "password_reset">(
    "registration",
  );

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
    setActiveRole(role);
    markUserAuthenticated();
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

  const handleBack = () => {
    if (step === "register_sso" || step === "register_employer") {
      setStep("login");
    } else if (step === "register_general") {
      setStep(role === "worker" ? "register_sso" : "login");
    } else if (step === "register_documents") {
      setStep("register_general");
    } else if (step === "verify_otp") {
      setStep(otpFlow === "password_reset" ? "forgot_password" : "register_sso");
    } else if (step === "forgot_password") {
      setStep("login");
    } else if (step === "reset_password") {
      setStep("verify_otp");
    } else if (step === "register_password") {
      setStep("register_documents");
    } else if (step === "complete_payroll" || step === "review") {
      setStep("login");
    } else {
      router.back();
    }
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
          onBackPress={handleBack}
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
              setRegistrationEmail(data.email ?? "");
              setRegistrationName(data.name ?? "");
              setRegistrationProvider(
                (data.provider ?? "manual") as "google" | "apple" | "manual",
              );
              setStep("verify_otp");
            }}
            onBackPress={handleBack}
            onLoginPress={() => setStep("login")}
          />
        );
      case "verify_otp":
      return (
        <VerifyOtpScreen
          flow={otpFlow}
          role={role}
          email={otpFlow === "password_reset" ? passwordResetEmail : registrationEmail}
          name={registrationName}
          provider={registrationProvider}
          onBackPress={() =>
            setStep(otpFlow === "password_reset" ? "forgot_password" : "register_sso")
          }
          onComplete={() =>
            setStep(otpFlow === "password_reset" ? "reset_password" : "register_general")
          }
        />
      );
      case "forgot_password":
        return (
          <ForgotPasswordScreen
            role={role}
            onSubmitEmail={(email) => {
              setPasswordResetEmail(email);
              setOtpFlow("password_reset");
              setStep("verify_otp");
            }}
            onBackToLogin={() => setStep("login")}
          />
        );
      case "reset_password":
        return (
          <ResetPasswordScreen
            role={role}
            email={passwordResetEmail}
            onBackPress={() => setStep("verify_otp")}
            onComplete={() => setStep("login")}
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
            onBackPress={handleBack}
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
            onBackPress={handleBack}
          />
        );
      case "register_password":
        return (
          <RegisterPasswordScreen
            role={role}
            onBackPress={handleBack}
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
            onBackPress={handleBack}
            onComplete={goToPostRegistrationRoute}
          />
        );
      case "review":
        return <ReviewScreen onBackToLogin={() => setStep("login")} />;
      default:
        return (
          <LoginScreen
            role={role}
            onRegisterPress={goToRegisterForCurrentRole}
            onForgotPasswordPress={() => setStep("forgot_password")}
            onLoginPress={goToRoleDashboard}
          />
        );
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <View className="mx-auto w-full max-w-[1120px] px-4 py-6 md:px-6 md:py-8">
        {renderActiveScreen()}
      </View>
    </ScrollView>
  );
}
