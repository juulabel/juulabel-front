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
        toastClassName="flex w-full bg-cool-grayscale-800 text-white rounded px-4 py-3 mx-4"
        bodyClassName={() => "w-full text-sm"}
        closeButton={false}
        hideProgressBar={true}
        position="bottom-center"
        autoClose={2000}
        className="bottom-20 z-50 flex w-full max-w-[560px] flex-col items-center justify-end px-4"
      />
    </>
  );
}
