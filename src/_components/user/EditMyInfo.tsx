import { AiFillExclamationCircle } from "react-icons/ai";
import ProfileChangeModal from "@/_components/user/ProfileChangeModal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PreferredAlcoholForm from "@/_components/auth/PreferredAlcoholForm";
import BottomButton from "@/_common/BottomButton";
import GenderForm from "@/_components/auth/GenderForm";
import { ChangeEvent, useEffect, useRef, useState, useMemo } from "react";
import { formInstance } from "@/app/api/axios";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { checkNickname } from "@/app/api/auth/checkName";
import { IMyInfo } from "@/_types/user/myInfoData";
import { useCookies } from "react-cookie";
import { resizeImage } from "@/_utils/resizeImage";
import { urlToFile } from "@/app/api/life/urlToFile";

interface ErrorResponse {
  message: string;
  result: string;
  success: boolean;
}

interface IEditMyInfo {
  user: IMyInfo;
  hasEdited: boolean;
  setHasEdited: (edited: boolean) => void;
  setIsEditMode: (editMode: boolean) => void;
}

export default function EditMyInfo({
  user,
  hasEdited,
  setHasEdited,
  setIsEditMode,
}: IEditMyInfo) {
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [errorNameMsg, setErrorNameMsg] = useState("");
  const [introduction, setIntroduction] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alcoholTypeIds, setAlcoholTypes] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [doesNameAlreadyExist, setDoesNameAlreadyExist] =
    useState<boolean>(false);
  const [changeProfileImgModal, setChangeProfileImgModal] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [genderCheck, setGenderCheck] = useState<boolean>(false);

  const { maleClicked, femaleClicked } = useMemo(() => {
    return {
      maleClicked: gender === "MALE",
      femaleClicked: gender === "FEMALE",
    };
  }, [gender]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const resizedFile = await resizeImage({
        file: selectedFile,
        width: 120,
        height: 120,
      });
      setFile(resizedFile);
      setImage(URL.createObjectURL(resizedFile));
      setHasEdited(true);
    }
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    checkIfAnyValuesAreEdited({ newNickname });
  };

  const handleIntroductionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newIntroduction = e.target.value;
    setIntroduction(newIntroduction);
    checkIfAnyValuesAreEdited({ newIntroduction });
  };

  const arraysAreEqual = (arr1: number[] = [], arr2: number[] = []) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const checkIfAnyValuesAreEdited = ({
    newNickname = nickname,
    newIntroduction = introduction,
    newImage = image,
    newGender = gender,
    newAlcoholTypeIds = alcoholTypeIds,
  }: {
    newNickname?: string;
    newIntroduction?: string;
    newImage?: string | null;
    newGender?: string;
    newAlcoholTypeIds?: number[];
  }) => {
    const nicknameEdited = user?.nickname !== newNickname;
    const introductionEdited = user?.introduction !== newIntroduction;
    const imageEdited = user?.profileImage !== newImage;
    const genderEdited = user?.gender !== newGender;
    const alcoholTypesEdited = !arraysAreEqual(
      user?.alcoholTypeIds,
      newAlcoholTypeIds,
    );

    const isEdited =
      nicknameEdited ||
      introductionEdited ||
      imageEdited ||
      genderEdited ||
      alcoholTypesEdited;
    setHasEdited(isEdited);
  };

  useEffect(() => {
    const initializeUserData = async () => {
      if (user !== undefined) {
        setNickname(user.nickname);
        setIntroduction(user.introduction ?? "");
        if (user.profileImage) {
          try {
            const fileFromUrl = await urlToFile({ url: user.profileImage });
            setFile(fileFromUrl);
            setImage(URL.createObjectURL(fileFromUrl));            
          } catch (error) {
            console.error("Error converting profile image URL to file:", error);
          }
        }
        setGenderCheck(user.gender === "NONE");
        setGender(user.gender ?? "");
        setAlcoholTypes(user.alcoholTypeIds ?? []);
      }
    };

    initializeUserData();
  }, [user]);

  const handleGenderCheck = (newGenderDisable: boolean) => {
    setGenderCheck(newGenderDisable);
    if (!genderCheck) {
      setGender("NONE");
      checkIfAnyValuesAreEdited({ newGender: "NONE" });
    }
  };

  const handleGender = (newGender: string) => {
    setGender(newGender);
    setGenderCheck(false);
    checkIfAnyValuesAreEdited({ newGender });
  };

  const handleAlcoholTypeChange = (value: number) => {
    const newAlcoholTypeIds = alcoholTypeIds.includes(value)
      ? alcoholTypeIds.filter((type: number) => type !== value)
      : [...alcoholTypeIds, value];

    setAlcoholTypes(newAlcoholTypeIds);
    checkIfAnyValuesAreEdited({ newAlcoholTypeIds });
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const regex = /[^\w\uAC00-\uD7A3]/;
    if (regex.test(nickname)) {
      setErrorNameMsg("띄어쓰기 및 특수문자를 사용할수 없어요.");
      return;
    }

    if (user?.nickname !== nickname && (await checkNickname(nickname))) {
      setDoesNameAlreadyExist(true);
      return;
    }

    const request = {
      nickname,
      introduction,
      gender,
      alcoholTypeIds,
    };

    const requestBlob = new Blob([JSON.stringify(request)], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("request", requestBlob);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await formInstance.put(
        "/v1/api/members/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast("내 정보 수정이 완료되었어요.");
        router.replace("/user/my-space");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError<ErrorResponse, AxiosRequestConfig>(error)) {
        toast(error.response?.data.result);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileImageClick = () => {
    setChangeProfileImgModal(true);
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
    setChangeProfileImgModal(false);
  };

  const handleDeleteImage = () => {
    setChangeProfileImgModal(false);
    setImage(null);
    setFile(null);
    setHasEdited(true);
  };

  const defaultProfileImage = `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/profile/default_profile.png`;

  return (
    <>
      <label
        className="flex flex-grow flex-col items-center justify-center"
        onClick={handleProfileImageClick}
      >
        <div className="relative mb-6 inline-flex h-[120px] w-[120px]">
          <Image
            width={120}
            height={120}
            src={image ?? defaultProfileImage}
            alt="내 정보 이미지"
            className="absolute left-0 top-0 h-[120px] w-[120px] rounded-full"
          />
          <button className="absolute left-[88px] top-[88px] inline-flex h-8 w-8 rounded-2xl bg-slate-950 p-1">
            <div className="inline-flex p-[3px]">
              <Image
                width={18}
                height={18}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/gallery.svg`}
                alt="갤러리 이미지"
              />
            </div>
          </button>
        </div>
        <input
          type="file"
          id="image-files"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
      <div className="mx-[4%] flex flex-col">
        <label className="mb-2 text-base font-medium leading-normal text-slate-800">
          닉네임(최대 8자)
        </label>
        <input
          className="h-11 w-full rounded-[6px] border-[1px] border-solid border-cool-grayscale-300 p-4"
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          maxLength={8}
        />
        {doesNameAlreadyExist && (
          <div className="mt-1 flex flex-row items-center">
            <AiFillExclamationCircle className="mr-[2px] text-error" />
            <p className="text-[13px] font-medium text-error">
              "이미 사용중인 닉네임이에요."
            </p>
          </div>
        )}

        {errorNameMsg.length > 0 && (
          <div className="mt-1 flex flex-row items-center">
            <AiFillExclamationCircle className="mr-[2px] text-error" />
            <p className="text-[13px] font-medium text-error">{errorNameMsg}</p>
          </div>
        )}
        <label className="mb-2 mt-6 text-base font-medium text-slate-800">
          자기소개(최대 150자)
        </label>
        <textarea
          className="h-[240px] w-full rounded-[6px] border-[1px] border-solid border-cool-grayscale-300 p-4"
          placeholder="자기소개를 입력해주세요."
          maxLength={150}
          value={introduction}
          onChange={handleIntroductionChange}
        />
        <div className="flex justify-end">
          <p
            className={`${introduction.length === 0 ? "text-cool-grayscale-400" : "text-cool-grayscale-800"}, text-xs font-normal`}
          >
            {introduction.length}
          </p>
          <p className="text-xs font-normal text-cool-grayscale-800">/150</p>
        </div>
      </div>
      <GenderForm
        genderCheck={genderCheck}
        maleClicked={maleClicked}
        femaleClicked={femaleClicked}
        onChangeGenderCheck={handleGenderCheck}
        onChangeGender={handleGender}
      />
      <div className="mt-6 h-[1px] w-[91%] bg-[lightly]" />
      <div className="mx-[4%] mt-6 flex flex-row justify-between">
        <p className="text-base font-semibold leading-6 text-cool-grayscale-700">
          선호전통주 주종 선택(필수)
        </p>
        <p className="text-sm font-normal leading-5 text-cool-grayscale-500">
          복수선택 가능
        </p>
      </div>
      <PreferredAlcoholForm
        alcoholTypes={alcoholTypeIds}
        onChangeAlcoholType={handleAlcoholTypeChange}
      />
      <BottomButton enableButton={hasEdited} onClick={onSubmit}>
        완료하기
      </BottomButton>

      {changeProfileImgModal && (
        <ProfileChangeModal
          handleSelectImg={handleSelectImage}
          handleDeleteImg={handleDeleteImage}
          handleCancel={() => setChangeProfileImgModal(false)}
        />
      )}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cool-grayscale-200 border-t-blue-500"></div>
            <p className="mt-4 animate-pulse text-white">
              내 정보 수정 중입니다...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
