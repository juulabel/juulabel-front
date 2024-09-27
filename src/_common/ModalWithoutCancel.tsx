interface IModal {
  modalTitle: string;
  modalDescription?: string;
  primaryBtnText: string;
  handlePrimaryBtn: () => void;
  secondaryBtnText?: string;
  handleSecondaryBtn?: () => void;
}

export default function ModalWithoutCancel({
  modalTitle,
  modalDescription,
  primaryBtnText,
  handlePrimaryBtn,
  secondaryBtnText,
  handleSecondaryBtn,
}: IModal) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60">
      <div className="flex w-[91%] max-w-[560px] flex-col items-center rounded-2xl bg-white p-6">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-balance break-keep text-center text-lg font-bold leading-[27px] text-cool-grayscale-800">
            {modalTitle}
          </div>
          <div className="text-balance break-keep text-center text-base font-normal leading-normal text-cool-grayscale-600">
            {modalDescription}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div
            className="flex cursor-pointer items-center justify-center gap-2.5 rounded bg-primary-700 px-3 py-2"
            onClick={handlePrimaryBtn}
          >
            <div className="text-center text-sm font-bold leading-[21px] text-white">
              {primaryBtnText}
            </div>
          </div>
          {secondaryBtnText && handleSecondaryBtn && (
            <div
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded border border-cool-grayscale-300 px-3 py-2"
              onClick={handleSecondaryBtn}
            >
              <div className="w-full text-center text-sm font-medium leading-[21px] text-cool-grayscale-800">
                {secondaryBtnText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
