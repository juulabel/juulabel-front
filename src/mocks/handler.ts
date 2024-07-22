import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/v1/api/members/nicknames/exists", () => {
    return HttpResponse.json({
      data: {
        isAble: true,
      },
    });
  }),

  http.get("/v1/api/terms", () => {
    return HttpResponse.json({
      data: {
        document: [
          "제 1조",
          "공무원인 근로자는 법류이 정하는 자에 한하여 단결권-단체 교섭권 및 단체행동권을 가진다.",
        ],
      },
    });
  }),
];
