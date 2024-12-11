"use client";

import React from "react";
import Image from "next/image";

const bgImages = [
  "/images/traditional_liquor_bg.jpg",
  "/images/traditional_liquor_bg2.jpg",
];

const TraditionalLiquorBackground = React.memo(() => {
  return (
    <Image
      src={bgImages[Math.floor(Math.random() * bgImages.length)]}
      fill
      className="object-cover"
      alt="Landscape"
      quality={50}
      priority
    />
  );
});

export default TraditionalLiquorBackground;
