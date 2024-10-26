import Checkbox from "@/_common/Checkbox";

interface IGender {
  genderCheck: boolean;
  maleClicked: boolean;
  femaleClicked: boolean;
  genderDisable: boolean;
  onChangeGenderCheck: (value: boolean) => void;
  onChangeGender: (value: string) => void;
}

export default function GenderForm({
  genderCheck,
  maleClicked,
  femaleClicked,
  genderDisable,
  onChangeGenderCheck,
  onChangeGender,
}: IGender) {  
  const handleGender = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onChangeGender(
      event.currentTarget.textContent === "남성" ? "MALE" : "FEMALE",
    );
  };
  return (
    <div>
      <div className="mx-[4%] mt-6 flex flex-row justify-between text-center">
        <label className="text-base font-medium leading-6">
          성별선택(필수)
        </label>
        <div className="flex flex-row">
          <Checkbox
            checked={genderCheck}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeGenderCheck(event.target.checked);
            }}
          />
          <p>성별 체크 안함</p>
        </div>
      </div>
      <div className="mt-3 flex flex-row justify-center">
        <button
          type="button"
          className={`mx-[2%] h-12 w-[43%] rounded-[8px] border-[1px] border-cool-grayscale-300 text-base font-bold leading-6 ${maleClicked ? "border-2 border-primary-700 bg-[#FF823C] bg-opacity-10" : ""}`}
          onClick={(e) => handleGender(e)}
          disabled={genderDisable}
        >
          남성
        </button>
        <button
          type="button"
          className={`mx-[2%] h-12 w-[43%] rounded-[8px] border-[1px] border-cool-grayscale-300 text-base font-bold leading-6 ${femaleClicked ? "border-2 border-primary-700 bg-[#FF823C] bg-opacity-10" : ""}`}
          onClick={(e) => handleGender(e)}
          disabled={genderDisable}
        >
          여성
        </button>
      </div>
    </div>
  );
}
