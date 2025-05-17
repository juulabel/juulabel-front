"use client";

import { usePathname } from "next/navigation";
import { Slide, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cn } from "@/_utils/commons";

// Make sure you import default styles

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
        toastClassName={() =>
          topToastPaths.includes(pathName)
            ? "bg-white text-black text-sm rounded px-4 py-3 shadow-md"
            : "flex w-full bg-cool-grayscale-800 text-white rounded px-4 py-3 mx-4"
        }
        bodyClassName={() => "w-full text-sm"}
        closeButton={false}
        hideProgressBar={true}
        position={
          topToastPaths.includes(pathName) ? "top-center" : "bottom-center"
        }
        transition={Slide}
        autoClose={2000}
        className={cn(
          "z-50 flex w-full max-w-[560px] flex-col items-center px-4",
          !topToastPaths.includes(pathName) && "bottom-20 justify-end",
        )}
      />
    </>
  );
}
