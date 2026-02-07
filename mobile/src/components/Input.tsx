import { View, TextInput, TextInputProps } from "react-native";
import { AppText } from "./AppText";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  containerClassName = "",
  inputClassName = "",
  ...props
}: InputProps) {
  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label && (
        <AppText variant="caption" weight="medium" className="mb-1.5 ml-1">
          {label}
        </AppText>
      )}
      <TextInput
        className={`w-full bg-white border ${error ? "border-red-500" : "border-slate-200"} px-4 py-3 rounded-xl text-foreground text-base ${inputClassName}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error ? (
        <AppText color="danger" variant="small" className="mt-1 ml-1">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="small" color="muted" className="mt-1 ml-1">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}
