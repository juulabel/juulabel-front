import Link from "next/link";

interface IBottomButton {
  url?: string;
  enableButton: boolean | undefined;
  children: React.ReactNode;
  onClick: () => void;
}

export default function BottomButton({
  url,
  enableButton,
  children,
  onClick,
}: IBottomButton) {
  return (
    <>
      {url ? (
        <Link
          className={`absolute inset-x-0 bottom-2 m-auto w-[393px] items-center rounded-[10px] py-[14px] text-center text-base font-bold text-white ${
            enableButton
              ? "bg-primary-700"
              : "pointer-events-none bg-primary-300"
          }`}
          href={url}
          onClick={onClick}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`absolute inset-x-0 bottom-2 m-auto w-[393px] items-center rounded-[10px] py-[14px] text-center text-base font-bold text-white ${
            enableButton
              ? "bg-primary-700"
              : "pointer-events-none bg-primary-300"
          }`}
        >
          {children}
        </button>
      )}
    </>
  );
}
