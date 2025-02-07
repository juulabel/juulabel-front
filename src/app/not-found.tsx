import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center py-3">
      <Image src={"/app/svg/404.svg"} width={350} height={350} alt="" />

      <div className="flex flex-col items-center gap-1">
        <div className="mb-2 text-[20px] font-bold">잠시 오류 발생했어요!</div>
        <div className="text-[16px] font-[500]">
          뒤로가기 후 재 이용을 부탁드려요.
        </div>
        <div className="text-[16px] font-[500]">
          문제가 계속되면 주라벨 고객센터로 연락해주세요!
        </div>

        <Link
          href={"/share/note"}
          className="mt-6 flex h-[52px] w-[119px] items-center justify-center rounded-[8px] bg-primary-700 text-[16px] font-bold text-white"
        >
          메인으로 이동
        </Link>
      </div>
    </div>
  );
}
