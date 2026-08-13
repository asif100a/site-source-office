import { ChevronDownIcon } from "lucide-react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Text } from "react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { InputField } from "@/components/ui/input";

type SelectOption = {
  label: string;
  value: string;
};

type StandardSelectFieldProps<T extends FieldValues> = {
  label?: string;
  id: FieldPath<T>;
  control: Control<T>;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  asterisk?: boolean;
};

export default function StandardSelectField<T extends FieldValues>({
  label = "",
  id,
  control,
  options,
  placeholder = "Select an option",
  required = true,
  readOnly = false,
  asterisk = false,
}: StandardSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={id}
      rules={{ required: required ? `${label} is required.` : undefined }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl isInvalid={Boolean(error)} className="mb-5">
          <FormControlLabel className="mb-2">
            <FormControlLabelText
              className="text-sm font-semibold text-[#333]"
              accessibilityLabel={label}
            >
              {label} {asterisk && <Text style={{ color: "#ef4444" }}>*</Text>}
            </FormControlLabelText>
          </FormControlLabel>

          <Select
            selectedValue={value == null ? undefined : String(value)}
            onValueChange={onChange}
            isDisabled={readOnly}
          >
            <SelectTrigger
              variant="outline"
              size="xl"
              className={`rounded-xl border bg-transparent px-1 justify-between ${
                error ? "border-[#d92d20]" : "border-[#e8e8e8]"
              }`}
              style={{ height: 50 }}
            >
              <SelectInput
                placeholder={placeholder}
                className="px-3 text-sm text-[#222]"
              />
              <SelectIcon as={ChevronDownIcon} className="mr-3 text-[#999]" />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />
              <SelectContent className="max-h-[70%] rounded-t-[24px] bg-white px-2 pb-safe">
                <SelectDragIndicatorWrapper className="pt-2">
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    className="min-h-[52px] rounded-xl px-4 active:bg-[#f7f7f8] data-[checked=true]:bg-[#fdf0f5]"
                    textStyle={{
                      className:
                        "text-sm text-[#222] data-[checked=true]:font-semibold data-[checked=true]:text-[#EF477F]",
                    }}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

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
