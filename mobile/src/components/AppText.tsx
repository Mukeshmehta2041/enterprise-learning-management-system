import { Text, TextProps } from "react-native";

interface AppTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "small";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "secondary" | "danger";
  className?: string;
}

export function AppText({
  variant = "body",
  weight = "normal",
  color = "default",
  className = "",
  ...props
}: AppTextProps) {
  const variantStyles = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    body: "text-base",
    caption: "text-sm",
    small: "text-xs",
  };

  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorStyles = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    danger: "text-red-500",
  };

  const combinedClassName = `${variantStyles[variant]} ${weightStyles[weight]} ${colorStyles[color]} ${className}`.trim();

  return (
    <Text
      className={combinedClassName}
      {...props}
    />
  );
}
