export const searchDummyData = [
  {
    id: 1,
    name: "김이동입니다",
    image: "",
    badge: ["소믈리에1", "소믈리에2"],
  },
  {
    id: 2,
    name: "김이똥",
    image: "",
    badge: ["소믈리에2", "소믈리에3"],
  },
  {
    id: 3,
    name: "김이이이이이이이",
    image: "",
    badge: ["소믈리에3", "소믈리에4"],
  },
  {
    id: 4,
    name: "김이이일",
    image: "",
    badge: ["소믈리에4", "소믈리에5"],
  },
  {
    id: 5,
    name: "김이삼사오",
    image: "",
    badge: ["소믈리에1", "소믈리에2", "소믈리에3", "소믈리에4"],
  },
];

export const recommendedDummyData = [
  {
    id: 1,
    nickname: "김이동입니다",
    image: "",
    badge: ["1", "2"],
    isFollowed: false,
  },
  {
    id: 2,
    nickname: "뤼민구",
    image: "",
    badge: ["1", "2"],
    isFollowed: false,
  },
  {
    id: 3,
    nickname: "강붕멍멍이",
    image: "",
    badge: ["1", "2"],
    isFollowed: false,
  },
  {
    id: 4,
    nickname: "강봉멍멍이",
    image: "",
    badge: ["1", "2"],
    isFollowed: false,
  },
  {
    id: 5,
    nickname: "강봉구름이잉",
    image: "",
    badge: ["1", "2", "3", "4"],
    isFollowed: false,
  },
];

export const profileDummyData = {
  id: 1,
  nickname: "강봉멍멍이잉잉잉",
  badge: ["1", "2", "3", "4"],
  image: "",
  introduction: "",
  isFollowed: true,
  followings: 177,
  followers: 130,
  documents: 177,
  tastingNote: [
    {
      id: 1,
      alcoholType: "소주",
      title: "느린마을 증류주",
      author: "테스트",
      date: "2024.7.11",
      image: "",
    },
  ],
  dailyLife: [
    {
      id: 1,
      title: "술맛 조오타아",
      content:
        "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말...",
      author: "강봉멍멍이잉잉잉",
      date: "1분 전",
      heart: 2,
      comment: 2,
    },
    {
      id: 2,
      title: "술맛 조오타아",
      content:
        "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에는 전통주도 많았어서 정말...",
      author: "강봉멍멍이잉잉잉",
      date: "1분 전",
      heart: 2,
      comment: 2,
    },
  ],
};

export const reportListDummyData = [
  "사기성 행위나 의심스러운 행동",
  "특정 브랜드만 홍보 혹은 비방하는 활동",
  "다른 사용자 혹은 특정 대상에 대한 욕설, 비방, 또는 명예 훼손",
  "성적으로 노골적이거나 불쾌감을 주는 내용",
  "불법적인 활동이나 거래를 조장하는 글",
  "청소년 보호법에 위배되는 행동",
  "타인의 저작물이나 콘텐츠를 무단으로 사용한 경우",
  "특정 종교나 정치적 견해를 강요하거나 선동하는 내용",
  "기타 부적절한 내용",
];
