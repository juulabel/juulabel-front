import { instance } from "@/app/api/axios";
import requests from "../requests";
import { headers } from "next/headers";

export async function deleteUser({
  accessToken,
  reason,
}: {
  accessToken: string;
  reason: string;
}) {
  try {
    const response = await instance.post(
      requests.deleteMe,
      { withdrawalReason: reason },
      {
        headers: {
          accessToken: accessToken,
        },
      },
    );

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(
        `Unexpected response: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}
