import { HttpResponse, http } from "msw";
import {
  profileDummyData,
  recommendedDummyData,
  reportListDummyData,
  searchDummyData,
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
];
