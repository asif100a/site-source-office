import { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Import Screens
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/standard_ui/buttons/BackButton";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  UserRole,
} from "@/constants/Routes";
import { markUserAuthenticated, setActiveRole } from "@/constants/authState";

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

export default function AuthFlow() {
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
  const hideBackButton = params?.hideBackButton === "true";

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
    const returnTo = Array.isArray(params.returnTo)
      ? params.returnTo[0]
      : params.returnTo;

    setActiveRole(role);
    markUserAuthenticated();

    if (returnTo) {
      router.replace(returnTo as any);
      return;
    }

    router.replace(getDashboardRouteForRole(role));
  };

  const goToLoginAfterRegistration = () => {
    setStep("login");
    router.replace({
      pathname: "/auth",
      params: { step: "login", role },
    });
  };

  const goToRegisterForCurrentRole = () => {
    const currentRole = params.role ? normalizeUserRole(params.role) : role;
    setRole(currentRole);
    setStep(currentRole === "employer" ? "register_employer" : "register_sso");
  };

  const goToRegistrationOtp = () => {
    setOtpFlow("registration");
    setStep("verify_otp");
  };

  const goToForgotPassword = () => {
    setOtpFlow("password_reset");
    setStep("forgot_password");
  };

  const goToPasswordResetOtp = (email: string) => {
    setPasswordResetEmail(email);
    setOtpFlow("password_reset");
    setStep("verify_otp");
  };

  const goToStep = (nextStep: AuthStep) => {
    setStep(nextStep);
    router.setParams({
      step: nextStep,
      currentStep: nextStep,
      role,
    });
  };

  // Go back to the previous screen in the flow
  const handleBack = () => {
    if (step === "register_sso" || step === "register_employer") {
      setStep("login");
    } else if (step === "register_general") {
      setStep(role === "worker" ? "register_sso" : "login");
    } else if (step === "register_documents") {
      setStep(role === "employer" ? "register_employer" : "register_general");
    } else if (step === "verify_otp") {
      if (otpFlow === "password_reset") {
        goToForgotPassword();
      } else {
        setStep(role === "employer" ? "register_employer" : "register_sso");
      }
    } else if (step === "forgot_password") {
      setStep("login");
    } else if (step === "reset_password") {
      setOtpFlow("password_reset");
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
    if (role === "employer" && step === "register_employer") {
      return (
        <RegisterEmployerScreen
          onContinue={(data) => {
            setRegistrationEmail(data.email ?? "");
            setRegistrationName(data.name ?? "");
            setRegistrationProvider("manual");
            goToRegistrationOtp();
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
            onForgotPasswordPress={goToForgotPassword}
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
              goToRegistrationOtp();
            }}
            onLoginPress={() => setStep("login")}
          />
        );
      case "verify_otp":
        return (
          <VerifyOtpScreen
            flow={otpFlow}
            role={role}
            email={
              otpFlow === "password_reset"
                ? passwordResetEmail
                : registrationEmail
            }
            name={registrationName}
            provider={registrationProvider}
            onBackPress={() =>
              otpFlow === "password_reset"
                ? goToForgotPassword()
                : setStep(
                    role === "employer" ? "register_employer" : "register_sso",
                  )
            }
            onComplete={() => {
              const nextStep =
                otpFlow === "password_reset"
                  ? "reset_password"
                  : role === "employer"
                    ? "complete_payroll"
                    : "register_general";

              goToStep(nextStep);
            }}
          />
        );
      case "forgot_password":
        return (
          <ForgotPasswordScreen
            role={role}
            onSubmitEmail={goToPasswordResetOtp}
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
            name={registrationName}
            onContinue={() => {
              goToStep("register_documents");
            }}
            onLoginPress={() => setStep("login")}
          />
        );
      case "register_documents":
        return (
          <RegisterDocumentsScreen
            role={role}
            onContinue={() => {
              if (role === "employer") {
                setStep("review");
              } else {
                setStep("complete_payroll");
              }
            }}
          />
        );
      case "register_password":
        return (
          <RegisterPasswordScreen
            role={role}
            onComplete={(password) => {
              console.log("Password complete registration");
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
            onComplete={goToLoginAfterRegistration}
            paymentUserId={registrationEmail}
          />
        );
      case "review":
        return (
          <ReviewScreen
            onBackToLogin={() => {
              setStep("login");
            }}
          />
        );
      default:
        return (
          <LoginScreen
            role={role}
            onRegisterPress={goToRegisterForCurrentRole}
            onForgotPasswordPress={goToForgotPassword}
            onLoginPress={goToRoleDashboard}
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white" }}
        edges={["bottom"]}
      >
        <View
          className="px-4 pt-16"
          style={{ backgroundColor: Colors.common.BRAND }}
        >
          {!hideBackButton && (
            <BackButton
              onPress={handleBack}
              textStyle={{
                color: Colors.common.WHITE,
              }}
              iconColor={Colors.common.WHITE}
            />
          )}
        </View>

        {/* Render Current Active Screen */}
        <View style={{ flex: 1 }} className="flex-1">
          {renderActiveScreen()}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
