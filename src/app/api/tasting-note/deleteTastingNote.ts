// import { instance } from "../axios";

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { instance } from "../axios";

export function useDeleteTastingNote() {
  const [cookie] = useCookies(["accessToken"]);
  const router = useRouter();

  const deleteTastingNote = async (tastingNoteId: number) => {
    try {
      const response = await instance.delete(
        `/v1/api/shared-space/tasting-notes/${tastingNoteId}`,
        {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        },
      );

      if (response.status === 200 && response.data) {
        toast("시음노트가 삭제되었습니다.");
        router.push("/share/note");
        router.refresh();
        return response.data.result.tastingNoteId;
      } else {
        throw new Error(
          `Unexpected response: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      toast("에러가 발생했습니다. 다시 시도해주세요.");
      console.error("Delete Tasting Note Error:", error);
      return null;
    }
  };

  return { deleteTastingNote };
}
