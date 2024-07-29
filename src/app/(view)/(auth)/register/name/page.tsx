import NicknameForm from "@/_components/auth/NicknameForm";
import TopHeader from "@/_common/TopHeader";

export default function Page() {
  return (
    <div className="w-full max-w-[560px]">
      <TopHeader title="회원가입" step={2} rest={1} />
      <div className="mx-[4%] mb-4 mt-10 flex flex-col">
        <h2 className="my-1 text-xl font-bold">닉네임을 설정해주세요.</h2>
        <div className="my-1 flex flex-col text-sm font-medium text-cool-grayscale-600">
          <span>닉네임은 최소 2자, 최대 8자를 입력할 수 있어요.</span>
          <span>띄어쓰기 및 특수문자는 사용할 수 없어요.</span>
        </div>
        <span className="text-col-grayscale-600 my-1 text-sm font-medium">
          닉네임은 추후 변경이 가능해요!
        </span>
      </div>
      <NicknameForm />
    </div>
  );
}
