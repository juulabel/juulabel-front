import AgreementForm from "./AgreementForm";

export default function Agreement({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="mx-[4%] mb-[50vh] mt-[6vh]">
        <h2 className="text-xl font-bold">
          주라벨을 사용하려면 <br /> 아래에 대한 약관 동의가 필요해요
        </h2>
      </div>
      <AgreementForm onNext={() => onNext()} />
    </>
  );
}
