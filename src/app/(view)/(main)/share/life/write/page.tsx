"use client";
import Checkbox from "@/_common/Checkbox";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import { GoChevronRight } from "react-icons/go";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/_utils/commons";
import { MouseEvent, useEffect, useState, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import ImageIcon from "@/icons/image_icon.svg";
import Modal from "@/_common/Modal";
import { formInstance } from "@/app/api/axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { urlToFile } from "@/app/api/life/urlToFile";

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
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      isPrivate: false,
      files: [],
    },
  });

  // Declare confirm before using it in onSubmit
  const [confirm, setConfirm] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [images, setImages] = useState<FileInfo[]>([]);

  useEffect(() => {
    initEditMode();
  }, []);

  const initEditMode = async () => {
    const storedData = sessionStorage.getItem("editLifeData");
    if (editMode && storedData) {
      const inputData: Inputs = JSON.parse(storedData);
      setValue("title", inputData.title);
      setValue("content", inputData.content);
      setValue("isPrivate", inputData.isPrivate);

      const files = await Promise.all(
        inputData.imageUrls!.map((url) =>
          urlToFile({ url: url, filename: crypto.randomUUID() }),
        ), // Set the filename and mimeType as needed
      );

      const newImagesWithId: FileInfo[] = files.map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));

      setImages(newImagesWithId);
    }
  };

  // Wrap onSubmit in useCallback and include dependencies
  const onSubmit = useCallback(
    async (data: Inputs) => {
      if (data.isPrivate && !confirm) {
        setModalOpen(true);
        return;
      }

      const headers = {
        Authorization: `Bearer ${cookie.accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const { title, content, isPrivate, files } = data;
      const request = {
        title,
        content,
        isPrivate,
      };

      const requestBlob = new Blob([JSON.stringify(request)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("request", requestBlob);
      files.forEach((image) => {
        formData.append("files", image);
      });

      try {
        const response = !editMode
          ? await formInstance.post("/v1/api/daily-lives", formData, {
              headers: headers,
            })
          : await formInstance.patch(
              `/v1/api/daily-lives/${editMode}`,
              formData,
              {
                headers: headers,
              },
            );
        if (response.data.success) {
          router.replace(
            `/share/life/${response.data.result.dailyLifeId}?posted=true&editMode=${editMode != null}`,
          );
        }
      } catch (error) {
        if (axios.isAxiosError<ErrorResponse, AxiosRequestConfig>(error)) {
          toast(error.response?.data.result);
        }
      }

      setConfirm(false);
    },
    [confirm, cookie.accessToken, router],
  ); // Add confirm and router to the dependencies

  const watchTitle = watch("title");
  const watchContent = watch("content");
  const watchIsPrivate = watch("isPrivate");

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
  }, [confirm, onSubmit, handleSubmit]);

  // Image selection event handler
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : null;
    if (selectedFiles) {
      const totalImages = images.length + selectedFiles.length;
      if (totalImages > 9) {
        alert("최대 9개의 이미지만 업로드할 수 있습니다.");
        return;
      }
      const newImagesWithId = selectedFiles.map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));

      setImages((prev) => [...(prev || []), ...newImagesWithId]);
    } else {
      setImages([]);
    }
  };

  // Image removal event handler
  const removeHandler = (event: MouseEvent) => {
    const clickedImageId = event.currentTarget.id;
    setImages((prev) => prev.filter((image) => image.id !== clickedImageId));
  };

  return (
    <>
      <HeaderWithButton
        title="일상생활 작성하기"
        buttonType="newpost"
        buttonName="등록"
        isActiveButton={isValid}
        onClick={handleSubmit(onSubmit)}
      />

      <form className="flex h-full flex-col">
        <div className="flex cursor-pointer items-center justify-between bg-cool-grayscale-50 px-4 py-2 text-sm font-medium text-cool-grayscale-700">
          <div>일상생활 작성 시 안내사항 안내</div>
          <GoChevronRight size={18} className="text-cool-grayscale-500" />
        </div>
        <div className="flex h-12 items-center justify-between px-4 pb-2 pt-4">
          <div className="font-bold text-cool-grayscale-700">
            제목(최대 30자)
          </div>

          <div className="text-cool-grayscale-700">
            <span
              className={cn(
                "text-cool-grayscale-700",
                watchTitle.length === 0 && "text-cool-grayscale-400",
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
        <div className="flex h-12 items-center justify-between px-4 pb-2 pt-4">
          <div className="font-bold text-cool-grayscale-700">
            내용(최대 1,200자)
          </div>
          <div className="text-cool-grayscale-700">
            <span
              className={cn(
                "text-cool-grayscale-700",
                watchContent.length === 0 && "text-cool-grayscale-400",
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

        <div className="flex w-full items-center space-x-4 overflow-x-scroll px-4 pb-3 pt-2 scrollbar-hide">
          {images.map((image) => (
            <div className="relative shrink-0" key={image.id}>
              <div className="h-14 w-14 md:h-16 md:w-16">
                <Image
                  alt="일상생활 내용 이미지"
                  src={URL.createObjectURL(image.file)}
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

        <Controller
          name="isPrivate"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-2 border-t border-cool-grayscale-200 px-4 py-2">
              <Checkbox
                checked={value}
                onChange={(e) => {
                  onChange(e.target.checked);
                }}
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
        <label
          className={cn(
            "flex h-12 cursor-pointer items-center gap-2 border-t border-cool-grayscale-200 px-4 py-3 text-cool-grayscale-800",
            (!images || images.length >= 9) && "text-cool-grayscale-400",
          )}
          htmlFor="image-files"
        >
          <ImageIcon
            width={24}
            height={24}
            className={cn(
              "fill-cool-grayscale-800",
              (!images || images.length >= 9) && "fill-cool-grayscale-400",
            )}
          />
          <span>이미지 추가하기(최대 9장)</span>
          <Controller
            name="files"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <input
                type="file"
                id="image-files"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!images || images.length >= 9}
              />
            )}
          />
        </label>
      </form>
      {modalOpen && watchIsPrivate && (
        <Modal
          modalTitle={"비공개로 게시물을 등록하시겠어요?"}
          primaryBtnText={"등록하기"}
          handlePrimaryBtn={() => {
            setConfirm(true);
            setModalOpen(false);
          }}
          cancelText={"닫기"}
          handleCancel={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}
export default NewPostPage;
