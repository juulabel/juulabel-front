//브라우저 환경 설정
import { setupWorker } from "msw/browser";
import { handlers } from "./handler";

const worker = setupWorker(...handlers);
export default worker;
