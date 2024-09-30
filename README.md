### 주라벨 프론트

#### 라우트구조

```
[view]
(auth)
카카오, 구글 로그인: /
회원가입: register/agreement -> name -> detail

시음노트: share/note
시음노트 검색: share/note/search
시음노트 작성: share/note/write
시음노트 상세페이지 share/note/[id]

일상생활: /share/life
일상생활 작성: /share/life/write
일상생활 상세 페이지: /share/life/[dailylifeId]

전통주 검색: /search
내 공간: /user/profile/[id]
다른 유저 검색: /user/search
장터: /shop
알림: /notification
```

#### publuc 경로

```
public(png -> images, svg -> svg)
Images, svg

```
