import { instance } from "../axios";

type ContentType = "notes" | "lives";
type PageParam = {
  lastTastingNoteId?: string | null;
  lastDailyLifeId?: string | null;
};

export const fetchUserContent = async ({
  pageParam,
  contentType,
  userId,
}: {
  pageParam: PageParam;
  contentType: ContentType;
  userId: string;
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_JUULABEL_API_URL;

  const isNote = contentType === "notes";
  const lastIdParam = isNote ? "lastTastingNoteId" : "lastDailyLifeId";
  const lastId = pageParam?.[lastIdParam];

  const endpoint = isNote
    ? `/tasting_notes?pageSize=15${lastId ? `&${lastIdParam}=${lastId}` : ""}`
    : `/daily-lives?pageSize=15${lastId ? `&${lastIdParam}=${lastId}` : ""}`;

  const res = await instance.get(
    `${apiUrl}/v1/api/members/${userId}${endpoint}`,
  );

  return res.data.result[
    isNote ? "tastingNoteSummaries" : "dailyLifeSummaries"
  ];
};
