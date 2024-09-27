import axios from "axios";

export const deleteNotification = async (id: number) => {
  const response = await axios.delete(`/api/notification/${id}`);
  if (response.status != 200) {
    throw new Error("Network response was not ok");
  }
  return id;
};

export const deleteAllNotification = async () => {
  const response = await axios.delete(`/api/allNotifications`);
  if (response.status != 200) {
    throw new Error("Network response was not ok");
  }
};
