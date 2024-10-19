import { useEffect, useState } from "react";

interface IRating {
  value: number; // 달점
  onChange: (value: number) => void; // 달점 변경 시 호출되는 함수
}

export default function Rating({ value, onChange }: IRating) {
  const [rating, setRating] = useState(value);
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부

  const maxStars = 5;

  useEffect(() => {
    onChange(rating);
  }, [rating]);

  const handleMouseDown = (value: number) => {
    setRating(value); // 클릭 시 바로 선택
    setIsDragging(true); // 드래그 시작
  };

  const handleMouseMove = (value: number) => {
    if (isDragging) {
      setRating(value); // 드래그 중일 때 실시간으로 선택
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
  };

  const renderStars = () => {
    const stars = [];

    const handleClick = (value: number) => {
      setRating(value);
    };

    const getStarImage = (index: number) => {
      if (index <= rating) {
        return "/svg/moonpoint_full.svg"; // 가득 찬 달
      } else if (index - 0.5 === rating) {
        return "/svg/moonpoint_half.svg"; // 반 개 달
      } else {
        return "/svg/moonpoint_default.svg"; // 비어있는 달
      }
    };

    for (let i = 1; i <= maxStars; i++) {
      const fullValue = i;
      const halfValue = i - 0.5;

      stars.push(
        <div
          key={i}
          className="relative inline-block h-12 w-12"
          onMouseUp={handleMouseUp} // 마우스 버튼 떼면 드래그 종료
        >
          {/* 반쪽 클릭 영역 (왼쪽) */}
          <div
            className="absolute inset-0 left-0 h-full w-1/2 cursor-pointer"
            onMouseDown={() => handleMouseDown(halfValue)}
            onMouseMove={() => handleMouseMove(halfValue)}
            onClick={() => handleClick(halfValue)}
          ></div>
          {/* 전체 클릭 영역 (오른쪽) */}
          <div
            className="absolute inset-0 left-6 h-full w-1/2 cursor-pointer"
            onMouseDown={() => handleMouseDown(fullValue)}
            onMouseMove={() => handleMouseMove(fullValue)}
            onClick={() => handleClick(fullValue)}
          ></div>
          {/* 이미지 (전체 크기 유지) */}
          <img
            src={getStarImage(fullValue)}
            alt="moon"
            className="h-full w-full"
          />
        </div>,
      );
    }

    return stars;
  };

  return (
    <div className="flex gap-x-3" onMouseLeave={handleMouseUp}>
      {renderStars()}
    </div>
  );
}
