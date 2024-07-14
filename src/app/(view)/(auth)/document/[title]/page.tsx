import TopHeader from "@/_common/TopHeader";
import AgreementDocument from "@/_components/auth/AgreementDocument";

export default function Page({ params }: { params: { title: string } }) {
  return (
    <div className="w-[393px]">
      <TopHeader
        backUrl="/register/agreement"
        title={decodeURIComponent(params.title)}
        rest={0}
        step={0}
      />
      <AgreementDocument />
    </div>
  );
}
