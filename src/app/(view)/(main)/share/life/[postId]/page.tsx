import PostList from "@/_common/PostList";
import CommentFooter from "@/_components/reaction/CommentFooter";
import HeaderWithMenu from "@/_components/share/life/HeaderWithMenu";
import LifeViewer from "@/_components/share/life/LifeDetail";
import { IPostList } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function LifeDetail() {
  const data = {
    title: "용산 아이파크몰 시음회 후기",
    content:
      "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에 전통주 비중도 많이 늘어난 것 같아서 너무 좋았어요 ㅎㅎㅎ<br>저는 탁주랑 과실주 위주로 마셔봤는데 A양조장의 전통주들이 특히나 마시기 좋았던 것 같아요.<br>어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에 전통주 비중도 많이 늘어난 것 같아서 너무 좋았어요 ㅎㅎㅎ<br>저는 탁주랑 과실주 위주로 마셔봤는데 A양조장의 전통주들이 특히나 마시기 좋았던 것 같아요.",
    postId: "1",
    username: "김뭅잉",
    userImage:
      "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/d483114c48ed44adimage",
    contentImageCount: 1,
    published: "2024-07-24T11:25:01.512Z",
    likeCount: 2,
    commentCount: 2,
  };
  const { likeCount, commentCount } = data;
  return (
    <>
      <HeaderWithMenu title="전통주 일상생활" />
      <div className="h-full overflow-y-auto scrollbar-hide">
        <LifeViewer {...data} />
      </div>
      <CommentFooter likeCount={likeCount} commentCount={commentCount} />
    </>
  );
}
export default LifeDetail;
