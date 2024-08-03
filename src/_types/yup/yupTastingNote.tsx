import * as yup from "yup";

export type BasicInformationFormValues = yup.InferType<
  typeof basicInformationSchema
>;

export const basicInformationSchema = yup.object().shape({
  productName: yup.string().required(),
  alcoholContent: yup.string().required(),
  alcoholType: yup.string().required(),
  brewery: yup.string(),
});

export const basicInformationDefaultValues = {
  productName: "",
  alcoholContent: "",
  alcoholType: "",
  brewery: "",
};
