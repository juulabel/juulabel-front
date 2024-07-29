import React from "react";

interface IUserHeaderModal {
  reportUser: () => void;
  doNotSeeUser: () => void;
  onCloseOption: () => void;
}

export default function UserHeaderModal({
  onCloseOption,
  reportUser,
  doNotSeeUser,
}: IUserHeaderModal) {
  return (
    <div
      className="custom-right fixed top-4 w-52 text-sm"
      onClick={onCloseOption}
    >
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onCloseOption}
      />
      <div
        className="relative rounded bg-white p-4 font-semibold"
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          event.stopPropagation()
        }
      >
        <ul>
          <li className="mb-2">
            <button
              className="flex w-full justify-start text-black"
              onClick={reportUser}
            >
              유저 신고하기
            </button>
          </li>
          <li className="mb-2">
            <button
              className="flex w-full justify-start text-black"
              onClick={doNotSeeUser}
            >
              이 유저 게시물 보지 않기
            </button>
          </li>
          <li>
            <button
              className="flex w-full justify-start text-black"
              onClick={onCloseOption}
            >
              취소
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
