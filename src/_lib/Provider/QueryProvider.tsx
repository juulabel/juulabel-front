"use client";

import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface IQueryProvider {
  children: ReactNode;
}

export default function QueryProvider({ children }: IQueryProvider) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true, //다른 페이지에 갔다가 현재 페이지로 돌아왔을 때 데이터를 새로 받아올 것인가?
        retryOnMount: true, //컴포넌트가 unMount 됐다가 다시 mount 됐을 경우 데이터를 새로 받아올 것인가?
        refetchOnReconnect: false, //인터넷 연결이 꺼졌다가 다시 연결 됐을 경우 데이터를 새로 받아올 것인가?
        retry: false, // 데이터를 불러오는 것을 실패했을 때 다시 받아오기를 시도할 것인가? -> false로 하고 못 받아오면 에러 메세지 출력하는 방향으로 진행
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
