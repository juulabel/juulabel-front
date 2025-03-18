"use client";

export default function Offline() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">오프라인 상태입니다</h1>
      <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
    </div>
  );
}
