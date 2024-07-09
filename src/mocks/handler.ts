import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("https://api.example.com/api/register/nickname", () => {
    return HttpResponse.json({
      data: {
        isAble: true,
      },
    });
  }),
];
