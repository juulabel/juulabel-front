"use client";

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">오프라인 상태입니다</h1>
      <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
    </div>
  );
} 