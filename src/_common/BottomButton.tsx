import Link from "next/link";

interface IBottomButton {
  url: string;
  enableButton: boolean | undefined;
  children: React.ReactNode;
}

export default function BottomButton({
  url,
  enableButton,
  children,
}: IBottomButton) {
  return (
    <Link
      className={`absolute inset-x-0 bottom-2 m-auto w-[393px] items-center rounded-[10px] py-[14px] text-center text-base font-bold text-white ${enableButton ? "bg-primary-700" : "pointer-events-none bg-primary-300"}`}
      href={url}
    >
      {children}
    </Link>
  );
}
