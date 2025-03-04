"use client";
import Checkbox from "@/_common/Checkbox";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import { GoChevronRight } from "react-icons/go";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/_utils/commons";
import { MouseEvent, useEffect, useState, useCallback, Suspense } from "react";
import { IoClose } from "react-icons/io5";
import ImageIcon from "@/icons/image_icon.svg";
import Modal from "@/_common/Modal";
import { formInstance } from "@/app/api/axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { urlToFile } from "@/app/api/life/urlToFile";
import Loading from "@/_common/Loading";

export interface Inputs {
  title: string;
  content: string;
  isPrivate: boolean;
  files: File[];
  imageUrls?: string[];
}

interface FileInfo {
  id: string;
  file: File;
  preview: string;
}

interface ErrorResponse {
  message: string;
  result: string;
  success: boolean;
}

function NewPostPage() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("dailyLifeId");
  const [cookie] = useCookies(["accessToken"]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { isValid },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      isPrivate: false,
      files: [],
    },
  });

  const [confirm, setConfirm] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [images, setImages] = useState<FileInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const watchTitle = watch("title");
  const watchContent = watch("content");
  const watchIsPrivate = watch("isPrivate");

  const initEditMode = useCallback(async () => {
    const storedData = sessionStorage.getItem("editLifeData");
    if (editMode && storedData) {
      const inputData: Inputs = JSON.parse(storedData);
      setValue("title", inputData.title);
      setValue("content", inputData.content);
      setValue("isPrivate", inputData.isPrivate);

      if (inputData.imageUrls?.length) {
        const filePromises = inputData.imageUrls.map(async (url) => {
          const file = await urlToFile({ url });
          return {
            file,
            id: crypto.randomUUID(),
            preview: URL.createObjectURL(file),
          };
        });

        const files = await Promise.all(filePromises);
        setImages(files);
      }
    }
  }, [editMode, setValue]);

  useEffect(() => {
    initEditMode();
  }, [initEditMode]);

  useEffect(() => {
    setValue(
      "files",
      images.map((image) => image.file),
    );
  }, [images, setValue]);

  useEffect(() => {
    if (confirm) {
      handleSubmit(onSubmit)();
    }
  }, [confirm, handleSubmit]);

  const onSubmit = useCallback(
    async (data: Inputs) => {
      if (isSubmitting) return;

      if (data.isPrivate && !confirm) {
        setModalOpen(true);
        return;
      }

      setIsSubmitting(true);

      const { title, content, isPrivate, files } = data;
      const request = { title, content, isPrivate };
      const requestBlob = new Blob([JSON.stringify(request)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("request", requestBlob);
      files.forEach((file) => formData.append("files", file));

      try {
        const endpoint = !editMode
          ? "/v1/api/daily-lives"
          : `/v1/api/daily-lives/${editMode}`;
        const method = !editMode ? "post" : "patch";

        const response = await formInstance[method](endpoint, formData, {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast(
            editMode
              ? "일상생활 수정이 완료되었어요."
              : "일상생활 작성이 완료되었어요.",
          );

          editMode
            ? router.back()
            : router.replace(`/share/life/${response.data.result.dailyLifeId}`);
        }
      } catch (error) {
        if (axios.isAxiosError<ErrorResponse>(error)) {
          toast(error.response?.data.result);
        }
      } finally {
        setIsSubmitting(false);
        setConfirm(false);
      }
    },
    [confirm, cookie.accessToken, router, isSubmitting, editMode],
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files
        ? Array.from(event.target.files)
        : null;

      if (!selectedFiles) return;

      const totalImages = images.length + selectedFiles.length;
      if (totalImages > 9) {
        toast.warning("최대 9개의 이미지만 업로드할 수 있습니다.");
        return;
      }

      const newImagesWithId = selectedFiles.map((file) => ({
        file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImagesWithId]);
    },
    [images.length],
  );

  const removeImage = useCallback((event: MouseEvent) => {
    const clickedImageId = event.currentTarget.id;
    setImages((prev) => prev.filter((image) => image.id !== clickedImageId));
  }, []);

  const handleConfirmPrivate = useCallback(() => {
    setConfirm(true);
    setModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const isTitleValid = watchTitle.length > 0 && watchTitle.length <= 30;
  const isContentValid = watchContent.length > 0 && watchContent.length <= 1200;
  const isMaxImages = images.length >= 9;

  return (
    <>
      <HeaderWithButton
        title="일상생활 작성하기"
        buttonType="newpost"
        buttonName="등록"
        isActiveButton={isValid && !isSubmitting}
        onClick={handleSubmit(onSubmit)}
      />

      <form className="flex h-full flex-col">
        <div
          onClick={() => router.push("/share/life/write/notice")}
          className="flex cursor-pointer items-center justify-between bg-cool-grayscale-50 px-4 py-2 text-sm font-medium text-cool-grayscale-700"
        >
          <div>일상생활 작성 시 유의사항 안내</div>
          <GoChevronRight size={18} className="text-cool-grayscale-500" />
        </div>

        {/* Title Section */}
        <div className="flex h-12 items-center justify-between px-4 pb-2 pt-4">
          <div className="font-bold text-cool-grayscale-700">
            제목(최대 30자)
          </div>
          <div className="text-cool-grayscale-700">
            <span
              className={cn(
                "text-cool-grayscale-700",
                !watchTitle.length && "text-cool-grayscale-400",
                watchTitle.length > 30 && "text-error",
              )}
            >
              {watchTitle.length}
            </span>
            /30
          </div>
        </div>
        <textarea
          {...register("title", { required: true, maxLength: 30 })}
          rows={2}
          className="w-full resize-none px-4 text-cool-grayscale-700 placeholder-cool-grayscale-400 !outline-none focus:placeholder-transparent focus:ring-0"
          placeholder="제목을 입력해주세요."
          maxLength={30}
        />

        {/* Content Section */}
        <div className="flex h-12 items-center justify-between px-4 pb-2 pt-4">
          <div className="font-bold text-cool-grayscale-700">
            내용(최대 1,200자)
          </div>
          <div className="text-cool-grayscale-700">
            <span
              className={cn(
                "text-cool-grayscale-700",
                !watchContent.length && "text-cool-grayscale-400",
                watchContent.length > 1200 && "text-error",
              )}
            >
              {watchContent.length}
            </span>
            /1,200
          </div>
        </div>
        <textarea
          {...register("content", { required: true, maxLength: 1200 })}
          className="w-full grow resize-none px-4 text-cool-grayscale-700 placeholder-cool-grayscale-400 !outline-none focus:placeholder-transparent focus:ring-0"
          placeholder="전통주와 관련한 질문, 시음회 후기, 정보 공유 등 자유롭게 적어보세요."
          maxLength={1200}
        />

        {/* Images Preview */}
        {images.length > 0 && (
          <div className="flex w-full items-center space-x-4 overflow-x-scroll px-4 pb-3 pt-2 scrollbar-hide">
            {images.map((image) => (
              <div className="relative shrink-0" key={image.id}>
                <div className="h-14 w-14 md:h-16 md:w-16">
                  <Image
                    alt="일상생활 내용 이미지"
                    src={image.preview}
                    width={1920}
                    height={1080}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div
                  id={image.id}
                  className="absolute -right-[0.45rem] -top-[0.45rem] z-30 flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-cool-grayscale-500 md:h-[20px] md:w-[20px]"
                  onClick={removeImage}
                >
                  <IoClose className="text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Privacy Checkbox */}
        <Controller
          name="isPrivate"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-2 border-t border-cool-grayscale-200 px-4 py-2">
              <Checkbox
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
              <label htmlFor="checkbox-custom" className="cursor-pointer">
                <div className="text-xs text-cool-grayscale-800">
                  게시물을 비공개 처리할게요
                </div>
                <div className="text-xs text-cool-grayscale-500">
                  비공개 처리 시 다른 사람들에게 해당 게시물이 보이지 않아요.
                </div>
              </label>
            </div>
          )}
        />

        {/* Image Upload Button */}
        <label
          className={cn(
            "flex h-12 cursor-pointer items-center gap-2 border-t border-cool-grayscale-200 px-4 py-3 text-cool-grayscale-800",
            isMaxImages && "text-cool-grayscale-400",
          )}
          htmlFor="image-files"
        >
          <ImageIcon
            width={24}
            height={24}
            className={cn(
              "fill-cool-grayscale-800",
              isMaxImages && "fill-cool-grayscale-400",
            )}
          />
          <span>이미지 추가하기(최대 9장)</span>
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
                disabled={isMaxImages}
              />
            )}
          />
        </label>
      </form>

      {/* Confirmation Modal */}
      {modalOpen && watchIsPrivate && (
        <Modal
          modalTitle="비공개로 게시물을 등록하시겠어요?"
          primaryBtnText="등록하기"
          handlePrimaryBtn={handleConfirmPrivate}
          cancelText="닫기"
          handleCancel={closeModal}
        />
      )}

      {/* Loading Overlay */}
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
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <NewPostPage />
    </Suspense>
  );
}
