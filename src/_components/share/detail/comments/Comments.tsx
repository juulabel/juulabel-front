import Image from "next/image";

export default function Comments() {
  return (
    <div className="flex flex-col gap-3 border-b border-cool-grayscale-200 px-4 py-5">
      <div className="flex flex-row items-center gap-2">
        <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
          <Image
            src="https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage"
            fill
            alt="User Icon"
            layout="fixed"
            className="object-cover"
          />
        </div>

        <div className="flex flex-row items-center gap-1 text-[14px] text-cool-grayscale-600">
          <div>김뭅잉</div>

          <svg
            width="2"
            height="2"
            viewBox="0 0 2 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1" cy="1" r="1" fill="#94A3B8" />
          </svg>
          <span>1분 전</span>
        </div>
      </div>

      <div className="text-[14px] text-cool-grayscale-700">
        정말 맛있어서 숨을 쉴 수 없습니다. 맙소사, 이와 같은 탁주는어디서 오는
        것입니까? 혹여 가보로 내려옵니까? 나의 공중제비를 멈추게 하십시오! 혹여
        가보로 내려옵니까? 나의 공중제비를 멈추게
      </div>

      <div className="flex flex-row justify-end gap-3">
        <div className="flex flex-row items-center gap-1">
          <Image
            src={"/svg/like_full.svg"}
            width={20}
            height={20}
            alt="좋아요"
          />

          <span>3</span>
        </div>

        <div className="flex flex-row items-center gap-1">
          <Image
            src={"/svg/speech_bubble.svg"}
            width={20}
            height={20}
            alt="좋아요"
          />

          <span>3</span>
        </div>
      </div>
    </div>
  );
}
