import * as yup from "yup";

export type AgreementUserFormValues = yup.InferType<typeof agreementUserSchema>;
export type NicknameUserFormValues = yup.InferType<typeof nicknameUserSchema>;
export type GenderUserFormValues = yup.InferType<typeof genderUserSchema>;
export type PreferredAlcoholTypeUserFormValues = yup.InferType<
  typeof preferredAlcoholUserSchema
>;

export const agreementUserSchema = yup.object().shape({
  allAgree: yup.boolean().required(),
  serviceAgree: yup
    .boolean()
    .required()
    .test(
      "serviceAgree",
      "서비스 이용약관(필수)에 동의해주세요.",
      (value) => value === true,
    ),
  privateInformationAgree: yup
    .boolean()
    .required()
    .test(
      "privateInformationAgree",
      "개인정보 수집 및 이용동의(필수)에 동의해주세요.",
      (value) => value === true,
    ),
  marketingAgree: yup.boolean().required(),
});

export const nicknameUserSchema = yup.object().shape({
  nickname: yup
    .string()
    .required("닉네임을 입력해주세요.")
    .matches(/^[가-힣]{2,8}$/, "닉네임 형식에 맞지 않습니다.(한글 2~8자)")
    .max(8, "최대 8자까지만 입력할 수 있어요."),
});

export const genderUserSchema = yup.object().shape({
  gender: yup.string().required(),
  genderCheck: yup.boolean(),
});

export const preferredAlcoholUserSchema = yup.object().shape({
  preferredAlcoholType: yup.string().required(),
});

export const agreementDefaultValues = {
  allAgree: false,
  serviceAgree: false,
  privateInformationAgree: false,
  marketingAgree: false,
};

export const termsMapping: Record<
  "SERVICE" | "PRIVACY" | "MARKETING",
  "serviceAgree" | "privateInformationAgree" | "marketingAgree"
> = {
  SERVICE: "serviceAgree",
  PRIVACY: "privateInformationAgree",
  MARKETING: "marketingAgree",
};

export const nicknameDefaultValues = {
  nickname: "",
};

export const genderDefaultValues = {
  gender: "",
  genderCheck: false,
};

export const preferredAlcoholTypeDefaultValues = {
  preferredAlcoholType: "",
};
