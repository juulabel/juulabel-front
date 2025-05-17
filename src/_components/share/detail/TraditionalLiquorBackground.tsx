"use client";

import Image from "next/image";
import React from "react";
import bgImage2 from "@/icons/images/traditional_liquor_bg2.jpg";
import bgImage1 from "@/icons/images/traditional_liquor_bg.jpg";

const bgImages = [bgImage1, bgImage2];

const TraditionalLiquorBackground = React.memo(() => {
  const selectedImage = bgImages[Math.floor(Math.random() * bgImages.length)];
  return (
    <>
      <Image
        src={selectedImage}
        fill
        className="object-cover"
        alt="Landscape"
        quality={70}
        priority
        placeholder="blur"
      />
      <div className={"absolute inset-0 bg-black opacity-40"}></div>
    </>
  );
});
TraditionalLiquorBackground.displayName = "TraditionalLiquorBackground";
export default TraditionalLiquorBackground;
