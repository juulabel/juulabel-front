import axios from "axios";

export const deleteNotification = async (id: number) => {
  const response = await axios.delete(`/api/notifications/${id}`);
  if (response.status != 200) {
    throw new Error("Network response was not ok");
  }
  return id;
};
