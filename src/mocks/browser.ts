//브라우저 환경 설정
import { setupWorker } from "msw/browser";
import { handlers } from "./handler";

export const worker = setupWorker(...handlers);
