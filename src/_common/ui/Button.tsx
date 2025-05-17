import clsx from "clsx";
import { ElementType } from "react";
import { PolymorphicPropsWithoutRef } from "@/_types";

type ButtonVariant = "primary" | "secondary" | "black" | "none";

export default function Button<C extends ElementType = "button">({
  as,
  children,
  variant = "none",
  className,
  disabled,
  ...props
}: PolymorphicPropsWithoutRef<C, ButtonVariant>) {
  const Component = as || "button";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-700 text-white font-semibold",
    secondary: "bg-cool-grayscale-100 text-black font-semibold",
    black: "bg-black text-white font-semibold",
    none: "",
  };

  const disabledStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-300 text-white",
    secondary: "",
    black: "",
    none: "",
  };

  return (
    <Component
      className={clsx(
        "transition-colors duration-300",
        className,
        !disabled && variantStyles[variant],
        disabled && disabledStyles[variant],
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
