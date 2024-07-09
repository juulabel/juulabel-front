"use client";

import { useForm, FormProvider } from "react-hook-form";
import { ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUserSchema } from "@/_types/yup/yupRegister";

export default function Layout({ children }: { children: ReactNode }) {
  const methods = useForm({ mode: "onSubmit", resolver: yupResolver(registerUserSchema) });
  return <FormProvider {...methods}>{children}</FormProvider>;
}
