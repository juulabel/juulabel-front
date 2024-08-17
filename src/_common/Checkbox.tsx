import { ChangeEvent } from "react";

interface ICheckbox {
  checked: boolean | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ checked, onChange }: ICheckbox) {
  return (
    <input
      id="checkbox-custom"
      type="checkbox"
      className="checkbox-custom"
      checked={checked}
      onChange={onChange}
    />
  );
}
