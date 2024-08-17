import RegisterAgreementForm from "@/_components/auth/RegisterAgreementForm";
import TopHeader from "@/_common/TopHeader";

export default function Page() {
  return (
    <div className="h-full w-full max-w-[560px]">
      <TopHeader title="회원가입" step={1} rest={2} />
      <div className="mx-[4%] mb-[50vh] mt-[6vh]">
        <h2 className="text-xl font-bold">
          주라벨을 사용하려면 <br /> 아래에 대한 약관 동의가 필요해요
        </h2>
      </div>
      <RegisterAgreementForm />
    </div>
  );
}
