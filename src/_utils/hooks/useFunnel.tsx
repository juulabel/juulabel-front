import { useState, ReactNode, isValidElement, ReactElement } from "react";

export interface StepProps {
  name: string;
  children: ReactNode;
}

export interface FunnelProps {
  children: Array<ReactElement<StepProps>>;
}

function Step({ children }: StepProps) {
  return <>{children}</>;
}

export default function useFunnel(steps: string) {
  const [step, setStep] = useState(steps);

  function Funnel({ children }: FunnelProps) {
    const targetStep = children.find(
      (childStep) => isValidElement(childStep) && childStep.props.name === step,
    );

    return <>{targetStep}</>;
  }

  Funnel.Step = Step;

  return { Funnel, setStep, currentStep: step } as const;
}
