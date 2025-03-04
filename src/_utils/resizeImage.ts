export const resizeImage = ({
  file,
  width,
  height,
}: {
  file: File;
  width: number;
  height: number;
}): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;

        // Crop to square from center and resize
        ctx.drawImage(
          img,
          sx, // Source X (crop start X)
          sy, // Source Y (crop start Y)
          min, // Crop width (square size)
          min, // Crop height (square size)
          0, // Destination X
          0, // Destination Y
          width, // Destination width
          height, // Destination height
        );

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob!], file.name, {
                type: "image/webp",
                lastModified: Date.now(),
              }),
            );
          },
          "image/webp",
          0.8,
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
