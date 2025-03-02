import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";

export default function convertGoogleDriveURL(driveUrl: string) {
  try {
    const match = driveUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}`;
    } else {
      throw new Error("Invalid Google Drive URL");
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/alcohols/${placeholderThumbnailProvider("기타주류")}.png`;
  }
}
