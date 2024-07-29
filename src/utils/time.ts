// date.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";

// 시간 처리 함수
export function dateView(date: string) {
  dayjs.extend(utc);
  dayjs.locale("ko");
  dayjs.extend(relativeTime);

  const now = dayjs();
  const inputDate = dayjs(date).utc(); // 입력된 날짜를 UTC로 변환
  const diffInHours = now.diff(inputDate, "hour");

  if (diffInHours < 24) {
    return now.to(inputDate);
  } else {
    return inputDate.format("YYYY.MM.DD");
  }
}
