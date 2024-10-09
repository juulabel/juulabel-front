import { PolymorphicPropsWithoutRef } from "@/_types";
import clsx from "clsx";
import { ElementType } from "react";

type ButtonVariant = "primary" | "secondary" | "black" | "none";

export default function Button<C extends ElementType = "button">({
  as,
  children,
  variant = "none",
  className,
  ...props
}: PolymorphicPropsWithoutRef<C, ButtonVariant>) {
  const Component = as || "button";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-700 text-white font-semibold",
    secondary: "bg-cool-grayscale-100 text-black font-semibold",
    black: "bg-black text-white font-semibold",
    none: "",
  };

  return (
    <Component className={clsx(className, variantStyles[variant])} {...props}>
      {children}
    </Component>
  );
}
