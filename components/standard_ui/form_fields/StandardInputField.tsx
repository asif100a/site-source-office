import React, { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Text } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

type StandardInputFieldProps<T extends FieldValues> = {
  label?: string;
  id: FieldPath<T>;
  type?: "text" | "email" | "password" | "phone";
  control: Control<T>;
  readOnly?: boolean;
  placeholder?: string;
  required?: boolean;
  asterisk?: boolean;
  textInputProps?: React.ComponentProps<typeof InputField>;
  rules?: any;
};

export default function StandardInputField<T extends FieldValues>({
  label = "",
  id,
  type = "text",
  control,
  readOnly = false,
  placeholder,
  required = true,
  asterisk = false,
  textInputProps = {},
  rules,
}: StandardInputFieldProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resolvedPlaceholder =
    placeholder ??
    (type === "email"
      ? "Enter your email"
      : type === "phone"
        ? "Enter your phone number"
        : `Enter your ${label.toLowerCase()}`);

  const checkInvalidEmail = {
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  }

  return (
    <Controller
      control={control}
      name={id}
      rules={{
        required: required ? `${label} is required.` : undefined,
        ...(type === "email" && checkInvalidEmail),
        ...rules,
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <FormControl isInvalid={Boolean(error)} className="mb-5">
          <FormControlLabel className="mb-2">
            <FormControlLabelText
              className="text-[#333] text-sm font-semibold"
              accessibilityLabel={label}
            >
              {label} {asterisk && <Text style={{ color: '#ef4444' }}>*</Text>}
            </FormControlLabelText>
          </FormControlLabel>

          <Input
            className={`h-[52px] rounded-xl`}
            style={{
              borderWidth: 1,
              borderColor: error
                ? "#d92d20"
                : isFocused
                  ? "#afa9aa"
                  : "#e8e8e8",
              backgroundColor: 'transparent',
            }}
          >
            <InputField
              value={value == null ? "" : String(value)}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
              placeholder={resolvedPlaceholder}
              placeholderTextColor="#bbb"
              keyboardType={
                type === "email"
                  ? "email-address"
                  : type === "phone"
                    ? "phone-pad"
                    : "default"
              }
              textContentType={
                type === "email"
                  ? "emailAddress"
                  : type === "password"
                    ? "password"
                    : type === "phone"
                      ? "telephoneNumber"
                      : "none"
              }
              autoCapitalize={type === "text" ? "sentences" : "none"}
              secureTextEntry={type === "password" && !showPassword}
              readOnly={readOnly}
              editable={!readOnly}
              selectTextOnFocus={!readOnly}
              className="text-sm text-[#222]"
              {...textInputProps}
            />

            {type === "password" && (
              <InputSlot
                className="pr-3"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <InputIcon
                  as={showPassword ? EyeOffIcon : EyeIcon}
                  className="text-[#999]"
                />
              </InputSlot>
            )}
          </Input>

          {error?.message ? (
            <FormControlError>
              <FormControlErrorText className="text-xs text-[#d92d20]">
                {error.message}
              </FormControlErrorText>
            </FormControlError>
          ) : null}
        </FormControl>
      )}
    />
  );
}
