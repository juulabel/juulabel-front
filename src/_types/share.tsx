export interface IPostList {
  title: string;
  content: string;
  postId: string;
  username: string;
  userImage: string;
  contentThumbnail?: string;
  contentImageCount?: number;
  published: string;
  likeCount: number;
  commentCount: number;
}

export interface ILifeDetail {
  title: string;
  content: string;
  postId: string;
  username: string;
  userImage: string;
  contentImages?: string[];
  contentImageCount?: number;
  published: string;
  likeCount: number;
  commentCount: number;
}

export interface INoteThumbnail {
  noteId: string;
  alcoholType: string;
  alcoholThumbnail?: string;
  alcoholImageCount?: number;
  alcoholName: string;
  username: string;
  userImage: string;
  published: string;
}
