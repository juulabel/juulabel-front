export const urlToFile = async ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  // Fetch the image as a Blob
  const response = await fetch(url);
  const blob = await response.blob();

  // Create a File object from the Blob
  return new File([blob], filename, { type: blob.type });
};
