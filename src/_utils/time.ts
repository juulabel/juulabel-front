// date.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";

// 시간 처리 함수
export function dateView(date: string) {
  dayjs.extend(utc);
  dayjs.locale("ko");
  dayjs.extend(relativeTime);

  const now = dayjs();

  // 추후 수정!!
  const inputDate = dayjs(date + "Z").local(); // 입력된 날짜를 UTC로 변환
  const diffInHours = now.diff(inputDate, "hour");
  const diffInSeconds = now.diff(inputDate, "seconds");

  if (diffInHours < 24) {
    if (diffInSeconds < 59) return "방금 전";
    else return now.to(inputDate);
  } else {
    return inputDate.format("YYYY.MM.DD");
  }
}

export function dateViewKoreanFull(date: string) {
  dayjs.extend(utc);
  dayjs.locale("ko");
  dayjs.extend(relativeTime);

  const now = dayjs();

  // 추후 수정!!
  const inputDate = dayjs(date + "Z").local(); // 입력된 날짜를 UTC로 변환
  const diffInHours = now.diff(inputDate, "hour");
  const diffInSeconds = now.diff(inputDate, "seconds");

  if (diffInHours < 24) {
    if (diffInSeconds < 59) return "방금 전";
    else return now.to(inputDate);
  } else {
    return inputDate.format("YYYY년 MM월 DD일");
  }
}
