"use client";

import { ToastContainer } from "react-toastify";

interface IToastProvider {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: IToastProvider) {
  return (
    <>
      {children}
      <ToastContainer
        toastClassName="flex items-center justify-center bg-black text-white"
        closeButton={false}
        hideProgressBar={true}
        position="bottom-center"
        autoClose={2000}
        className="flex w-[91%] max-w-[560px] flex-col items-center justify-center"
      />
    </>
  );
}
