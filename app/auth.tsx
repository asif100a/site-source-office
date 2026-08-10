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
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import BackButton from "@/components/standard_ui/buttons/BackButton";
import {
  getDashboardRouteForRole,
  normalizeUserRole,
  UserRole,
} from "@/constants/Routes";

const WEB_ROLE_STORAGE_KEY = "site-source.active-role";

type AuthStep =
  | "login"
  | "register_sso"
  | "register_general"
  | "register_employer"
  | "verify_otp"
  | "forgot_password"
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
    setStep(
      currentRole === "employer" ? "register_employer" : "register_sso",
    );
  };

  // Go back to the previous screen in the flow
  const handleBack = () => {
    if (step === "register_sso" || step === "register_employer") {
      setStep("login");
    } else if (step === "register_general") {
      setStep(role === "worker" ? "register_sso" : "login");
    } else if (step === "register_documents") {
      setStep("register_general");
    } else if (step === "verify_otp") {
      setStep("register_sso");
    } else if (step === "forgot_password") {
      setStep("login");
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
            onForgotPasswordPress={() => setStep("forgot_password")}
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
            onLoginPress={() => setStep("login")}
          />
        );
      case "verify_otp":
        return (
          <VerifyOtpScreen
            role={role}
            email={registrationEmail}
            name={registrationName}
            provider={registrationProvider}
            onBackPress={() => setStep("register_sso")}
            onComplete={() => setStep("register_general")}
          />
        );
      case "forgot_password":
        return (
          <ForgotPasswordScreen
            role={role}
            onBackToLogin={() => setStep("login")}
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
            onLoginPress={goToRoleDashboard}
          />
        );
    }
  };

  const showHeader =
    step !== "complete_payroll" &&
    step !== "review" &&
    step !== "login" &&
    step !== "register_general" &&
    step !== "register_sso" &&
    step !== "forgot_password";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white" }}
        edges={["bottom"]}
      >
        {/* Top Mini-Navigation Bar */}
        {showHeader && (
          <View
            className="flex-row items-center justify-between px-4 pt-16"
            style={{ backgroundColor: Colors.common.BRAND }}
          >
            <BackButton
              onPress={handleBack}
              textStyle={{
                color: Colors.common.WHITE,
              }}
              iconColor={Colors.common.WHITE}
            />
          </View>
        )}

        {/* Render Current Active Screen */}
        <View style={{ flex: 1 }} className="flex-1">
          {renderActiveScreen()}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
