import { HttpResponse, http } from "msw";
import {
  notificationDummyData,
  officialDataDummyData,
  profileDummyData,
  recommendedDummyData,
  relatedDummyData,
  reportListDummyData,
  searchDummyData,
  shareLifesDummyData,
  shareNotesDummyData,
  tastingNoteBasicInformationDummyData,
} from "./data";

export const handlers = [
  http.post("/v1/api/members/nicknames/exists", () => {
    return HttpResponse.json({
      data: {
        isAble: true,
      },
    });
  }),
  http.get("/v1/api/user/recommend/sommelier", () => {
    return HttpResponse.json({
      data: recommendedDummyData,
    });
  }),
  http.get("/v1/api/user/search", () => {
    return HttpResponse.json({
      data: searchDummyData,
    });
  }),
  http.get("/v1/api/user/notification", () => {
    return HttpResponse.json({
      data: notificationDummyData,
    });
  }),
  http.get("/v1/api/user/profile/1", () => {
    return HttpResponse.json({
      data: profileDummyData,
    });
  }),
  http.get("/v1/api/user/report/list", () => {
    return HttpResponse.json({
      data: reportListDummyData,
    });
  }),

  http.get("https://api.example.com/v1/api/share/notes", () => {
    return HttpResponse.json({
      notes: shareNotesDummyData,
    });
  }),

  http.get("https://api.example.com/v1/api/share/life", () => {
    return HttpResponse.json({
      life: shareLifesDummyData,
    });
  }),
  http.get(
    "https://api.example.com/v1/api/tasting-note/search/related-data",
    () => {
      return HttpResponse.json({
        relatedData: relatedDummyData,
      });
    },
  ),
  http.get(
    `https://api.example.com/v1/api/tasting-note/basic`,
    ({ request }) => {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      return HttpResponse.json({
        information: tastingNoteBasicInformationDummyData,
      });
    },
  ),
  http.get("https://api.example.com/v1/api/tasting-note/official-data", () => {
    return HttpResponse.json({
      data: officialDataDummyData,
    });
  }),
];
