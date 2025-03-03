import HeaderWithButton from "@/_components/share/life/HeaderWithButton";

export default function LifeWriteNotice() {
  return (
    <>
      <HeaderWithButton
        title="일상생활 유의사항"
        buttonType="meatballs"
        isActiveButton={false}
      />
      <div className="px-4 pb-10">
        {/* 소개 섹션 */}
        <div className="pt-[24px] text-lg font-bold leading-[27px] text-slate-800">
          일상생활 작성이란?
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          전통주에 대한 경험, 시음 노트, 질문, 관련된 에피소드 등을 기록하고
          공유할 수 있는 공간입니다.
        </div>

        <div className="my-[24px] h-[1px] w-full bg-slate-200" />

        {/* 참고사항 섹션 */}
        <div className="text-lg font-bold leading-[27px] text-slate-800">
          작성 시 참고사항
        </div>

        <div className="mt-3 text-base font-bold leading-normal text-slate-700">
          주제는 전통주 중심! 다양성도 환영!
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          전통주 시음 후기, 추천 조합, 양조장 방문기와 같은 내용은 물론 더
          좋습니다.
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          전통주 외에도 대한민국의 다채롭고 즐거운 주류문화에 대한 이야기를
          자유롭게 작성해보세요!
        </div>

        <div className="mt-3 text-base font-bold leading-normal text-slate-700">
          다른 사용자에 대한 배려!
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          모든 글은 서로 존중하고 배려하는 마음으로 작성해주세요.
        </div>
        <div>
          <span className="text-base font-bold leading-normal text-[#ed0d00]">
            부적절한 표현, 광고성 내용, 비방하는 글
          </span>
          <span className="text-base leading-normal text-slate-700">은</span>
        </div>
        <div className="text-base font-normal leading-normal text-slate-700">
          사전 경고 없이 삭제될 수 있으니 유의 바랍니다.
        </div>

        <div className="mt-[16px] text-base font-bold leading-normal text-slate-700">
          자유롭게, 그리고 즐겁게!
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          필수적으로 전통주 주제에 국한되지 않아도 괜찮아요~ 다방면으로
          대한민국의 즐겁고 풍성한 주류문화를 만들어가요!
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          대한민국의 주류문화와 관련된 다양한 주제로 여러분만의 독특하고 재밌는
          이야기를 공유해주세요.
        </div>

        <div className="my-[24px] h-[1px] w-full bg-slate-200" />

        {/* 유의사항 섹션 */}
        <div className="text-lg font-bold leading-[27px] text-slate-800">
          유의사항
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          작성된 글은 모든 사용자와 공유되며, 커뮤니티 규정을 준수해야 합니다.
        </div>
        <div className="mt-[4px] text-base font-normal leading-normal text-slate-700">
          유익한 글은 주라벨 추천 글로 선정될 수 있습니다.
        </div>
        <div className="mt-[16px] text-base font-medium leading-normal text-slate-700">
          소중한 경험을 공유하며 대한민국의 주류문화를
          <br />더 아름답게 만들어주세요.
        </div>
        <div className="mt-[4px] text-base font-bold leading-normal text-slate-700">
          주라벨과 함께라면 모두가 전통주 문화의 주인공입니다!😊
        </div>
        <div className="mt-[4px] text-base font-medium leading-normal text-slate-700">
          우리술, 우리에게 자부심이 되도록!
        </div>
      </div>
    </>
  );
}
