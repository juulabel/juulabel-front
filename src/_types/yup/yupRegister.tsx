import * as yup from "yup";

export type RegisterUserFormValues = yup.InferType<typeof registerUserSchema>;

export const registerUserSchema = yup.object().shape({
  allAgree: yup.boolean(),
  serviceAgree: yup.boolean().test("serviceAgree", "서비스 이용약관(필수)에 동의해주세요.", (value) => value === true),
  privateInformationAgree: yup
    .boolean()
    .test("privateInformationAgree", "개인정보 수집 및 이용동의(필수)에 동의해주세요.", (value) => value === true),
  marketingAgree: yup.boolean(),
  nickname: yup
    .string()
    .required("닉네임을 입력해주세요.")
    .matches(/^[가-힣]{2,8}$/, "닉네임 형식에 맞지 않습니다.(한글 2~10자)")
    .max(8, "최대 8자까지만 입력할 수 있어요."),
});

export const registerDefaultValues: RegisterUserFormValues = {
  allAgree: false,
  serviceAgree: false,
  privateInformationAgree: false,
  marketingAgree: false,
  nickname: "",
};
