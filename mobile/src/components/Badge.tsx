import { View } from "react-native";
import { AppText } from "./AppText";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  label,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    success: "bg-green-100",
    warning: "bg-amber-100",
    danger: "bg-red-100",
    neutral: "bg-slate-100",
  };

  const textVariantStyles = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-green-700",
    warning: "text-amber-700",
    danger: "text-red-700",
    neutral: "text-slate-600",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 rounded-full",
    md: "px-3 py-1 rounded-full",
  };

  return (
    <View className={`self-start ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      <AppText
        variant={size === "sm" ? "small" : "caption"}
        weight="semibold"
        className={textVariantStyles[variant]}
      >
        {label}
      </AppText>
    </View>
  );
}
