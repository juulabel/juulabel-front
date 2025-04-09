import axios from "axios";
import { instance } from "../axios";

export async function getUserRecommendation({
  badgeLastUserId,
  tastingLastUserId,
}: {
  badgeLastUserId: number | null;
  tastingLastUserId: number | null;
}) {
  console.log("badgeLastUserId", badgeLastUserId);
  console.log("tastingLastUserId", tastingLastUserId);
  const response = await instance.get(`/v1/api/members/recommendations`, {
    params: {
      badgeLastUserId,
      tastingLastUserId,
      pageSize: 5,
    },
  });

  if (response.status === 200 && response.data) return response.data.result;
  else
    throw new Error(
      `Unexpected response : ${response.status} ${response.statusText}`,
    );
}
