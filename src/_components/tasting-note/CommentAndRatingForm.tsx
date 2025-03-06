"use client";

import Checkbox from "@/_common/Checkbox";
import Modal from "@/_common/Modal";
import { useTastingNoteInformationStore } from "@/_store/tastingNote";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { ITastingNoteWriteRequest } from "@/_types";
import { cn } from "@/_utils/commons";
import { resizeImage } from "@/_utils/resizeImage";
import { formInstance } from "@/app/api/axios";
import ImageIcon from "@/icons/image_icon.svg";
import axios, { AxiosRequestConfig } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import Rating from "./Rating";

async function createFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], url.split("/").pop() || "image", {
    type: blob.type,
  });
}

interface Inputs {
  files: File[];
}

interface FileInfo {
  file: File;
  id: string;
  url?: string;
}

interface ErrorResponse {
  message: string;
  result: string;
  success: boolean;
}

interface ICommentAndRatingForm {
  handleStepBack: () => void;
}

const CommentAndRatingForm = forwardRef(function CommentAndRatingForm(
  { handleStepBack }: ICommentAndRatingForm,
  ref,
) {
  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");
  const { tastingNoteRequest, imageUrlList } = useTastingNoteStore();
  const tastingNoteInformationStore = useTastingNoteInformationStore();
  const {
    alcoholicDrinksDetails,
    alcoholicDrinksDetails: { alcoholicDrinksName },
    alcoholicDrinksId,
    alcoholTypeId,
    scentIds,
    colorId,
    sensoryLevelIds,
    flavorLevelIds,
  } = tastingNoteInformationStore;

  const router = useRouter();
  const [cookie] = useCookies(["accessToken"]);
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [images, setImages] = useState<FileInfo[]>([]);
  const [isActiveButton, setIsActiveButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  console.log(rating);

  const { handleSubmit, control, setValue } = useForm<Inputs>({
    defaultValues: {
      files: [],
    },
  });

  // URL에서 id 값을 추출
  const tastingNoteId = useMemo(() => {
    const match = pathname.match(/\/share\/note\/(\d+)\/edit/);
    return match ? match[1] : null;
  }, [pathname]);

  // 이미지 URL을 메모이제이션하여 불필요한 리렌더링 방지
  const imageUrls = useMemo(() => {
    return images.map((image) => ({
      id: image.id,
      url: URL.createObjectURL(image.file),
    }));
  }, [images]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmit)();
    },
  }));

  useEffect(() => {
    if (imageUrlList.length > 0) {
      Promise.all(
        imageUrlList.map(async (url) => ({
          id: crypto.randomUUID(),
          file: await createFileFromUrl(url),
          url,
        })),
      ).then(setImages);
    }
  }, [imageUrlList]);

  useEffect(() => {
    // 편집 모드일 경우 기존 comment와 rating을 초기값으로 설정
    if (isEditMode && tastingNoteRequest) {
      const existingComment = tastingNoteRequest.request.content || "";
      const existingRating = tastingNoteRequest.request.rating || 0;

      setContent(existingComment);
      setRating(existingRating);
    }
  }, [isEditMode, tastingNoteRequest]);

  useEffect(() => {
    setValue(
      "files",
      images.map((image) => image.file),
    );
  }, [images, setValue]);

  useEffect(() => {
    if (rating > 0) {
      setIsActiveButton(true);
    }
  }, [rating]);

  // 부연설명 입력폼 크기 조절
  const handleResizeHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  // 부연설명 입력 시 실행되는 함수
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      handleResizeHeight();
    },
    [handleResizeHeight],
  );

  const handleCheckboxChange = useCallback(() => {
    setIsPrivate((prev) => !prev);
  }, []);

  // Image selection event handler
  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files
        ? Array.from(event.target.files)
        : null;
      if (!selectedFiles) {
        setImages([]);
        return;
      }

      const totalImages = images.length + selectedFiles.length;
      if (totalImages > 9) {
        alert("최대 9개의 이미지만 업로드할 수 있습니다.");
        return;
      }

      const processedImages = await Promise.all(
        selectedFiles.map(async (file) => ({
          file: await resizeImage({ file, width: 1280, height: 1280 }),
          id: crypto.randomUUID(),
        })),
      );

      setImages((prev) => [...prev, ...processedImages]);
    },
    [images],
  );

  // Image removal event handler
  const removeHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const clickedImageId = event.currentTarget.id;
      setImages((prev) => prev.filter((image) => image.id !== clickedImageId));
    },
    [],
  );

  // 등록 버튼 클릭 시 실행되는 함수
  const handleSubmitButton = useCallback(() => {
    // 부연설명, 달점, 비공개 여부 localStorage에 저장
    tastingNoteInformationStore.setContent(content);
    tastingNoteInformationStore.setRating(rating);
    tastingNoteInformationStore.setIsPrivate(isPrivate);

    // 모달 띄움
    setModalOpen(true);
  }, [content, isPrivate, rating, tastingNoteInformationStore]);

  const onSubmit = useCallback(
    async (data: Inputs) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      const { files } = data;

      const request: ITastingNoteWriteRequest = {
        alcoholicDrinksDetails,
        alcoholTypeId,
        alcoholicDrinksId,
        scentIds,
        colorId,
        sensoryLevelIds,
        flavorLevelIds,
        isPrivate,
        rating,
        content,
      };

      const reqeustBlob = new Blob([JSON.stringify(request)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("request", reqeustBlob);
      files.forEach((image) => {
        formData.append("files", image);
      });

      try {
        const response = await formInstance({
          method: isEditMode ? "put" : "post",
          url: `/v1/api/shared-space/tasting-notes${isEditMode ? `/${tastingNoteId}` : ""}`,
          data: formData,
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // 성공 시에 상세페이지로 redirect
        if (response.data.success) {
          localStorage.removeItem("tasting-note-storage");
          localStorage.removeItem("TastingNoteInformationStorage");

          const successMessage = isEditMode
            ? "시음노트 수정이 완료되었어요."
            : "시음노트 작성이 완료되었어요.";
          toast(successMessage);
          router.replace(`/share/note/${response.data.result.id}`);
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError<ErrorResponse, AxiosRequestConfig>(error)) {
          toast(error.response?.data.result);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      alcoholTypeId,
      alcoholicDrinksDetails,
      alcoholicDrinksId,
      colorId,
      content,
      cookie.accessToken,
      flavorLevelIds,
      isEditMode,
      isPrivate,
      isSubmitting,
      rating,
      router,
      scentIds,
      sensoryLevelIds,
      tastingNoteId,
    ],
  );

  return (
    <>
      {/* <TopHeaderWithButton
        title={isEditMode ? "시음노트 수정하기" : "시음노트 작성하기"}
        buttonType="text"
        buttonName="등록"
        isActiveButton={isActiveButton}
        onClickBackButton={handleStepBack}
        onClickButton={handleSubmitButton}
        haveSteps={true}
        currentStep={5}
        remainStep={0}
      /> */}
      <div className="mx-[18px] mt-6 flex flex-col gap-y-10">
        {/* 타이틀 */}
        <div>
          <p className="text-xl font-bold text-cool-grayscale-800">
            마지막 단계에요!
          </p>
          <p className="text-xl font-bold text-cool-grayscale-800">
            <span className="text-primary-700">{alcoholicDrinksName}</span>에
            대해 어떻게 생각하시나요?
          </p>
        </div>
        <div className="flex flex-col">
          {/* 부연설명 파트 */}
          <div>
            <div className="flex items-center justify-between">
              {/* 부연설명 왼쪽 타이틀 */}
              <div className="flex items-center gap-x-3">
                <span className="text-base font-bold text-cool-grayscale-700">
                  부연설명(최대 1,200자)
                </span>
                <span className="text-sm font-normal text-cool-grayscale-500">
                  선택사항
                </span>
              </div>
              {/* 부연설명 입력된 글자 수 */}
              <div className="flex items-center">
                <span className="text-sm font-normal text-cool-grayscale-400">
                  {content.length.toLocaleString()}
                </span>
                <span className="text-sm font-normal text-cool-grayscale-700">
                  /1,200
                </span>
              </div>
            </div>
            {/* 부연설명 입력폼 */}
            <textarea
              value={content}
              onChange={handleContentChange}
              className="mt-4 min-h-72 w-full resize-none pb-4 text-cool-grayscale-700 placeholder-cool-grayscale-400 !outline-none focus:placeholder-transparent focus:ring-0"
              placeholder="술에 대한 부연설명을 자유롭게 적어보세요."
              maxLength={1200}
              ref={textareaRef}
            />
          </div>
          {/* divide 라인 */}
          <div className="relative">
            <hr className="absolute left-1/2 h-1 w-screen -translate-x-1/2 transform border-0 bg-cool-grayscale-50" />
          </div>

          {/* 달점 파트 */}
          <div className="mt-4 text-center text-base font-bold text-cool-grayscale-800">
            술에 대한 달점을 매겨주세요!
          </div>
          <div className="mt-[2px] flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">
              {rating}
            </span>
            <span className="ml-[5px] text-base text-cool-grayscale-500">
              /5
            </span>
            <span className="ml-[4px] text-base text-cool-grayscale-500">
              점
            </span>
          </div>

          {/* 달점 입력폼 */}
          <div className="mb-6 mt-2 flex justify-center gap-x-3">
            <Rating value={rating} onChange={(value) => setRating(value)} />
          </div>

          {/* 아래부터는 스크롤 고정 부분 */}
          <div className="sticky bottom-0 bg-white">
            {/* 이미지 미리보기  UI*/}
            {images.length > 0 && (
              <div className="flex w-full items-center space-x-4 overflow-x-scroll px-4 pb-3 pt-2 scrollbar-hide">
                {imageUrls.map((image) => (
                  <div className="relative shrink-0" key={image.id}>
                    <div className="h-14 w-14 md:h-16 md:w-16">
                      <Image
                        alt="일상생활 내용 이미지"
                        src={image.url}
                        width={1920}
                        height={1080}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                    <div
                      id={image.id}
                      className="absolute -right-[0.45rem] -top-[0.45rem] z-30 flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-cool-grayscale-500 md:h-[20px] md:w-[20px]"
                      onClick={removeHandler}
                    >
                      <IoClose className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* divide 라인 */}
            <div className="relative">
              <hr className="absolute left-1/2 h-[1px] w-screen -translate-x-1/2 transform border-0 bg-cool-grayscale-200" />
            </div>
            <div className="my-2 flex">
              <div className="flex flex-col justify-start">
                <Checkbox checked={isPrivate} onChange={handleCheckboxChange} />
              </div>
              <div>
                <div className="text-xs text-cool-grayscale-800">
                  게시물을 비공개 처리할게요
                </div>
                <div className="text-xs text-cool-grayscale-500">
                  비공개 처리 시 다른 사람들에게 해당 게시물이 보이지 않아요.
                </div>
              </div>
            </div>
            {/* divide 라인 */}
            <div className="relative">
              <hr className="absolute left-1/2 h-[1px] w-screen -translate-x-1/2 transform border-0 bg-cool-grayscale-200" />
            </div>
            <label
              className={cn(
                "flex cursor-pointer items-center border-t text-cool-grayscale-800",
                images.length >= 9 && "text-cool-grayscale-400",
              )}
              htmlFor="image-files"
            >
              <div className="max-h-fit max-w-fit p-[3px]">
                <ImageIcon
                  width={24}
                  height={24}
                  className={cn(
                    "fill-cool-grayscale-800",
                    images.length >= 9 && "fill-cool-grayscale-400",
                  )}
                />
              </div>
              <div className="my-3 ml-1">이미지 추가하기(최대 9장)</div>
              <Controller
                name="files"
                control={control}
                defaultValue={[]}
                render={() => (
                  <input
                    type="file"
                    id="image-files"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={images.length >= 9}
                  />
                )}
              />
            </label>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal
          modalTitle={
            isPrivate
              ? "비공개로 게시물을 등록하시겠어요?"
              : "게시물을 등록하시겠어요?"
          }
          primaryBtnText={"등록하기"}
          handlePrimaryBtn={() => {
            setModalOpen(false);
            handleSubmit(onSubmit)();
          }}
          cancelText="닫기"
          handleCancel={() => {
            setModalOpen(false);
          }}
        />
      )}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cool-grayscale-200 border-t-blue-500"></div>
            <p className="mt-4 animate-pulse text-white">
              게시물을 등록 중입니다...
            </p>
          </div>
        </div>
      )}
    </>
  );
});

export default CommentAndRatingForm;
