interface ILoginButton {
  children?: React.ReactNode;
  buttonType: string;
  handleButton: () => void;
}

type buttonType = Record<string, string>;

export default function LoginButton({
  children,
  buttonType,
  handleButton,
}: ILoginButton) {
  const buttonColor: buttonType = {
    kakao:
      "flex justify-center items-center rounded-[6px] w-[361px] py-[13px] bg-[#EDD923] relative",
    google:
      "flex justify-center items-center rounded-[6px] w-[361px] py-[13px] bg-white border-[1px] border-cool-grayscale-300 relative",
  };
  return (
    <button className={buttonColor[buttonType]} onClick={handleButton}>
      {children}
    </button>
  );
}
