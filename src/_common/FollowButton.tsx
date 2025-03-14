interface IFollowButton {
  width?: string;
  textSize: string;
  isFollowed: boolean;
  onChangeFollow: (e: React.MouseEvent) => void;
  isCurrentUser?: boolean;
}

export default function FollowButton({
  width,
  textSize,
  isFollowed,
  onChangeFollow,
  isCurrentUser,
}: IFollowButton) {
  return isFollowed ? (
    <button
      type="button"
      className={`mr-[4%] flex h-9 ${width ? "w-full" : "w-[91%]"} items-center justify-center rounded-[4px] border-[1px] border-cool-grayscale-300 bg-white p-2 text-black text-${textSize} font-bold`}
      onClick={onChangeFollow}
    >
      팔로우 취소
    </button>
  ) : (
    <button
      type="button"
      className={`mr-[4%] flex h-9 ${width ? "w-full" : "w-[91%]"} items-center justify-center rounded-[4px] bg-black p-2 text-white text-${textSize} font-bold`}
      onClick={onChangeFollow}
    >
      {isCurrentUser ? "맞팔로우 하기" : "팔로우 하기"}
    </button>
  );
}
