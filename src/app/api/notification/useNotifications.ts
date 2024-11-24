import { INotificationSummary } from "@/_types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventSourcePolyfill } from "event-source-polyfill";
import nookies from "nookies";
import { instance } from "../axios";

/**
 * 알림 구독 - SSE
 */
export const subscribeToNotifications = (
  onNewNotification: (notification: string) => void,
) => {
  const cookies = nookies.get();
  const accessToken = cookies.accessToken;

  const eventSource = new EventSourcePolyfill(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/notifications/subscribe`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    },
  );

  eventSource.onmessage = function (event) {
    try {
      const newNotification = JSON.parse(event.data);
      console.log("새로운 알림 수신:", newNotification);
      onNewNotification(newNotification);
    } catch (err) {
      console.error("Error parsing event data:", err);
    }
  };

  eventSource.onerror = function (err) {
    console.error("EventSource failed:", err);
    eventSource.close();

    // 3초 후 재연결 시도
    setTimeout(() => {
      subscribeToNotifications(onNewNotification);
    }, 3000);
  };

  return () => {
    console.log("Closing EventSource");
    eventSource.close();
  };
};

/**
 * 알림 목록 조회
 */
const fetchNotifications = async (): Promise<INotificationSummary[]> => {
  const { data } = await instance.get("/v1/api/notifications?pageSize=10");
  return data.result.notificationSummaries.content;
};

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });
};

/**
 * 모든 알림 읽음 처리
 */
const markAllNotificationsAsRead = async () => {
  await instance.post("/v1/api/notifications/read-all");
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<
        INotificationSummary[]
      >(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          previousNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );
      }
      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
  });
};

/**
 * 알림 읽음 처리
 * @param notificationId 알림 id
 */
const markNotificationAsRead = async (notificationId: number) => {
  await instance.post(`/v1/api/notifications/${notificationId}/read`);
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<
        INotificationSummary[]
      >(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          previousNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
      }
      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
  });
};

/**
 * 알림 삭제
 * @param notificationId 알림 id
 */
const deleteNotification = async (notificationId: number) => {
  await instance.delete(`/v1/api/notifications/${notificationId}/delete`);
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => deleteNotification(notificationId),
    onMutate: async (notificationId: number) => {
      const previousNotifications = queryClient.getQueryData<
        INotificationSummary[]
      >(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (notifications: INotificationSummary[] | undefined) =>
          notifications?.filter(
            (notification) => notification.id !== notificationId,
          ) || [],
      );

      return { previousNotifications };
    },
    onError: (error, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
  });
};

/**
 * 모든 알림 삭제
 */
const deleteAllNotifications = async () => {
  await instance.delete("/v1/api/notifications/delete-all");
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onMutate: () => {
      queryClient.setQueryData(["notifications"], []);
    },
  });
};

/**
 * 알림 개수 반환
 */
const fetchNotificationCount = async (): Promise<number> => {
  const notifications = await fetchNotifications();
  return notifications.length;
};

export const useFetchNotificationCount = () => {
  return useQuery({
    queryKey: ["notificationCount"],
    queryFn: fetchNotificationCount,
  });
};
