"use client";
import clsx from "clsx";
import { PropsWithChildren, useEffect, useRef } from "react";

interface Props {
  className?: string;
  onClose: () => void;
}

export default function ModalLayout({
  children,
  className,
  onClose,
}: PropsWithChildren<Props>) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <section
        className={clsx(
          "animate-modalOpen flex w-[91%] max-w-[560px] flex-col items-center rounded-2xl bg-white p-6",
          className,
        )}
        ref={modalRef}
      >
        {children}
      </section>
    </div>
  );
}
