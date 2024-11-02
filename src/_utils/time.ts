// date.js
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.locale("ko");

// 시간 처리 함수
export function dateView(date: string) {
  const now = dayjs();
  const inputDate = dayjs(date);

  if (!inputDate.isValid()) {
    return "유효하지 않은 날짜"; 
  }

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
  const now = dayjs();
  const inputDate = dayjs(date);

  if (!inputDate.isValid()) {
    return "유효하지 않은 날짜"; 
  }

  const diffInHours = now.diff(inputDate, "hour");
  const diffInSeconds = now.diff(inputDate, "seconds");

  if (diffInHours < 24) {
    if (diffInSeconds < 59) return "방금 전";
    else return now.to(inputDate); 
  } else {
    return inputDate.format("YYYY년 MM월 DD일");
  }
}
