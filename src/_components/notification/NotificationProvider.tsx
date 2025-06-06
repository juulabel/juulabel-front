"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { subscribeToNotifications } from "@/app/api/notification/useNotifications";

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleNewNotification = () => {
      const message = "새로운 알림이 도착했습니다.";

      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        onClick: () => {
          window.focus();
          window.location.href = "/notifications";
        },
      });
    };

    // const unsubscribe = subscribeToNotifications(handleNewNotification);

    return () => {
      // unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
