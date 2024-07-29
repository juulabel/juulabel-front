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

  http.get("https://api.example.com/v1/api/share/notes", () => {
    return HttpResponse.json({
      notes: [
        {
          alcoholType: "소주",
          alcoholThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage",
          alcoholImageCount: 1,
          alcoholName: "느린마을 증류주",
          username: "작성자 닉네임",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          published: "2024.7.11",
        },
        {
          alcoholType: "기타주류",
          alcoholThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage",
          alcoholImageCount: 2,
          alcoholName: "느린마을 증류주",
          username: "작성자 닉네임",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          published: "2024.7.11",
        },
        {
          alcoholType: "소주",
          alcoholThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/2853feefc9884c6dimage",
          alcoholImageCount: 1,
          alcoholName: "느린마을 증류주",
          username: "작성자 닉네임",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          published: "2024.7.11",
        },
        {
          alcoholType: "소주",
          alcoholName: "느린마을 증류주",
          username: "작성자 닉네임",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          published: "2024.7.11",
        },
      ],
    });
  }),

  http.get("https://api.example.com/v1/api/share/life", () => {
    return HttpResponse.json({
      life: [
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말 어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentImageCount: 1,
          published: "2024-07-24T11:25:01.512Z",
          likeCount: 2,
          commentCount: 2,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말 어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "테스트테스트",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-24T11:20:01.512Z",
          likeCount: 2,
          commentCount: 2,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 2,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
        {
          title: "용산 아이파크몰 시음회 후기",
          content:
            "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말",
          postHref: "#",
          username: "김뭅잉",
          userImage:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
          contentThumbnail:
            "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage",
          contentImageCount: 6,
          published: "2024-07-22T11:20:01.512Z",
          likeCount: 20,
          commentCount: 23,
        },
      ],
    });
  }),
];
