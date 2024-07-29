export interface IPostList {
  title: string;
  content: string;
  postHref: string;
  username: string;
  userImage: string;
  contentThumbnail?: string;
  contentImageCount?: number;
  published: string;
  likeCount: number;
  commentCount: number;
}

export interface INoteThumbnail {
  alcoholType: string;
  alcoholThumbnail?: string;
  alcoholImageCount?: number;
  alcoholName: string;
  username: string;
  userImage: string;
  published: string;
}
