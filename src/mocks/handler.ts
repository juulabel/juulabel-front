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
