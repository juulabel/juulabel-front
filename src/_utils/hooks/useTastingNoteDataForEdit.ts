import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useTastingNoteStore } from "@/_store/useTastingNoteStore";
import { IAlcoholType } from "@/_types/tasting-note/officialData";
import { ITastingNoteWriteRequest } from "@/_types";

export default function useTastingNoteDataForEdit(id: number) {
  const { setTastingNoteRequest, setImageUrlList } = useTastingNoteStore();
  const [cookies] = useCookies(["accessToken"]);

  const { data: noteDetail } = useQuery({
    queryKey: ["noteDetail", id],
    queryFn: () =>
      getNoteDetail({
        token: cookies.accessToken,
        id,
      }),
    select: (data) => data.result,
  });
  const { data: alcoholTypeData } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
    select: (data) => data.alcoholTypeInfos,
  });

  const requestData = useMemo(() => {
    if (!noteDetail || !alcoholTypeData) return null;

    const matchedType = alcoholTypeData.find(
      (data: IAlcoholType) =>
        data.name === noteDetail.tastingNoteDetailInfo.alcoholTypeName,
    );

    return {
      alcoholicDrinksDetails: {
        alcoholicDrinksName:
          noteDetail.tastingNoteDetailInfo.alcoholicDrinksName,
        alcoholContent: noteDetail.tastingNoteDetailInfo.alcoholContent,
        alcoholTypeName: noteDetail.tastingNoteDetailInfo.alcoholTypeName,
        breweryName: noteDetail.tastingNoteDetailInfo.breweryName,
        breweryRegion: "",
      },
      alcoholTypeId: matchedType?.id ?? 0,
      alcoholicDrinksId: noteDetail.tastingNoteDetailInfo.tastingNoteId,
      colorId: noteDetail.tastingNoteDetailInfo.rgbColor,
      scentIds: noteDetail.scentIds,
      sensoryLevelIds: noteDetail.sensoryLevelIds,
      flavorLevelIds: noteDetail.flavorLevelIds,
      content: noteDetail.tastingNoteDetailInfo.content,
      isPrivate: false,
      rating: noteDetail.tastingNoteDetailInfo.rating,
    };
  }, [noteDetail, alcoholTypeData]);

  const imageUrlList = useMemo(
    () => noteDetail?.imageInfo.imageUrlList ?? [],
    [noteDetail],
  );

  useEffect(() => {
    if (requestData) {
      setTastingNoteRequest({ request: requestData, files: [] });
      setImageUrlList(imageUrlList);
    }
  }, [requestData, imageUrlList, setTastingNoteRequest, setImageUrlList]);

  return {
    noteDetail,
    alcoholTypeData,
  };
}
