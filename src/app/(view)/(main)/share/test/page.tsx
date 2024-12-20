"use client";

import React, { useEffect, useState } from "react";

const SseComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]); // SSE로 받은 메시지 저장
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 확인

  useEffect(() => {
    // 서버 엔드포인트 URL
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/notifications/subscribe`,
    );

    // 연결 성공 이벤트
    eventSource.onopen = () => {
      console.log("SSE connection established.");
      setIsConnected(true);
    };

    // 서버에서 전송된 메시지 처리
    eventSource.onmessage = (event) => {
      console.log("Received message:", event.data);
      setMessages((prev) => [...prev, event.data]); // 메시지 추가
    };

    // 오류 처리
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setIsConnected(false); // 연결 상태를 false로 설정
      eventSource.close(); // 연결 종료
    };

    // 컴포넌트가 언마운트될 때 연결 종료
    return () => {
      console.log("Closing SSE connection.");
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>SSE Example</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <h2>Messages:</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default SseComponent;
