import { FunnelProps, StepProps } from "@/_utils/hooks/useFunnel";
import Agreement from "./agreement/Agreement";
import NickName from "./nickname/Nickname";
import UserInfo from "./userInfo/UserInfo";

interface ProfileSetupInterface {
  steps: string[];
  onNext: (nextStep: string) => void;
  Funnel: React.ComponentType<FunnelProps>;
  Step: React.ComponentType<StepProps>;
}

export default function RegisterSetup({
  steps,
  onNext,
  Funnel,
  Step,
}: ProfileSetupInterface) {
  return (
    <>
      <Funnel>
        {/* 약관동의 */}
        <Step name={"약관동의"}>
          <Agreement onNext={() => onNext(steps[1])} />
        </Step>
        {/* 닉네임 설정 */}
        <Step name={"닉네임"}>
          <NickName onNext={() => onNext(steps[2])} />
        </Step>
        {/* 가입정보 설정 */}
        <Step name={"가입정보"}>
          <UserInfo />
        </Step>
      </Funnel>
    </>
  );
}
