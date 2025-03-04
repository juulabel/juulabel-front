export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-360px)] items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cool-grayscale-200 border-t-blue-500"></div>
        <p className="mt-4 animate-pulse text-cool-grayscale-600">
          데이터를 불러오고 있어요...
        </p>
      </div>
    </div>
  );
}
