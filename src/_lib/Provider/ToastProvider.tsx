"use client";

import { cn } from "@/_utils/commons";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import default styles

interface IToastProvider {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: IToastProvider) {
  const pathName = usePathname();
  const topToastPaths = ["/notification"];

  return (
    <>
      {children}
      <ToastContainer
        toastClassName="flex w-full bg-cool-grayscale-800 text-white rounded px-4 py-3 mx-4"
        bodyClassName={() => "w-full text-sm"}
        closeButton={false}
        hideProgressBar={true}
        position={
          topToastPaths.includes(pathName) ? "top-center" : "bottom-center"
        }
        autoClose={2000}
        className={cn(
          "z-50 flex w-full max-w-[560px] flex-col items-center px-4",
          !topToastPaths.includes(pathName) && "bottom-20 justify-end",
        )}
      />
    </>
  );
}
