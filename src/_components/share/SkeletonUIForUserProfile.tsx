import UserHeader from "../user/UserHeader";
import { useRouter } from "next/navigation";
import Loading from "@/_common/Loading";
import SkeletomUIForList from "./SkeletonUIForList";

export default function SkeletonUIForUserProfile() {
  const router = useRouter();
  return (
    <div className="relative h-full w-full max-w-[560px]">
      <div className="fixed top-0 z-20 w-full max-w-[560px] bg-white">
        <UserHeader
          title="유저 프로필"
          handleBackButton={() => router.back()}
          bottomBorder={true}
        />
        <div className="mx-[4%] flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="inline-flex h-[72px] w-[72px] animate-pulse rounded-full bg-cool-grayscale-200"></div>
            <div className="ml-2 h-7 w-32 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
        </div>
        <div className="mx-[4%] my-4 h-4 w-3/4 animate-pulse rounded-md bg-cool-grayscale-200"></div>
        <div className="mx-[12%] mt-6 flex flex-row items-center justify-between">
          <div className="flex flex-col items-center justify-center">
            <div className="h-4 w-12 animate-pulse rounded-md bg-cool-grayscale-200"></div>
            <div className="mt-1 h-5 w-8 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
          <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200"></div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-4 w-12 animate-pulse rounded-md bg-cool-grayscale-200"></div>
            <div className="mt-1 h-5 w-8 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
          <div className="my-auto h-5 w-[1px] bg-cool-grayscale-200"></div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-4 w-12 animate-pulse rounded-md bg-cool-grayscale-200"></div>
            <div className="mt-1 h-5 w-8 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
        </div>
        <div className="flex flex-row pt-4">
          <div className="flex h-11 w-1/2 flex-row items-center justify-center border-b-2 border-cool-grayscale-300">
            <div className="h-5 w-16 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
          <div className="flex h-11 w-1/2 flex-row items-center justify-center border-b-2 border-cool-grayscale-300">
            <div className="h-5 w-16 animate-pulse rounded-md bg-cool-grayscale-200"></div>
          </div>
        </div>
      </div>
      <div className="h-full pt-[300px]">
        <SkeletomUIForList />
      </div>
    </div>
  );
}
