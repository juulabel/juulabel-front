export const urlToFile = async ({ url }: { url: string }) => {
  // Fetch the image as a Blob
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const file = new File([blob], url.split("/").pop() || "image", {
      type: blob.type,
    });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
};
