interface ICommentAndRatingForm {
  handleStep: () => void;
}

export default function CommentAndRatingForm({
  handleStep,
}: ICommentAndRatingForm) {
  return <div>This is Comment and rating form.</div>;
}
