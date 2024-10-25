// date.js
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.locale("ko");
dayjs.extend(relativeTime);

// 시간 처리 함수
export function dateView(date: string) {
  const now = dayjs();

  // Parse the date without appending "Z" if it's already in UTC
  const inputDate = dayjs(date); // Ensure the input is a valid date string

  if (!inputDate.isValid()) {
    return "유효하지 않은 날짜"; // Return a fallback message for invalid dates
  }

  const diffInHours = now.diff(inputDate, "hour");
  const diffInSeconds = now.diff(inputDate, "seconds");

  if (diffInHours < 24) {
    if (diffInSeconds < 59) return "방금 전";
    else return inputDate.fromNow();
  } else {
    return inputDate.format("YYYY.MM.DD");
  }
}

export function dateViewKoreanFull(date: string) {
  const now = dayjs();

  const inputDate = dayjs(date); // Ensure the input is a valid date string

  if (!inputDate.isValid()) {
    return "유효하지 않은 날짜"; // Return a fallback message for invalid dates
  }

  const diffInHours = now.diff(inputDate, "hour");
  const diffInSeconds = now.diff(inputDate, "seconds");

  if (diffInHours < 24) {
    if (diffInSeconds < 59) return "방금 전";
    else return inputDate.fromNow();
  } else {
    return inputDate.format("YYYY년 MM월 DD일");
  }
}
