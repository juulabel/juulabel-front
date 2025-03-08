const requests = {
  getAlcoholTypes: `/v1/api/alcohols/types`,
  postSignUp: `/v1/api/members/sign-up`,
  postKakaoLogin: `/v1/api/members/login/kakao`,
  postGoogleLogin: `/v1/api/members/login/google`,
  getTerms: `/v1/api/terms`,
  follow: `/v1/api/follow`,
  typeSerach: `/v1/api/alcoholicDrinks/typeSearch?`,
  noteSearch: `/v1/api/shared-space/tasting-notes/search?`,
  lifeDelete: `/v1/api/daily-lives/`,
  deleteMe: `/v1/api/members/me`,
  deleteFollow: `/v1/api/delete/following`,
};

export default requests;
