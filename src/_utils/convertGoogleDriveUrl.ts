import { placeholderThumbnailProvider } from "@/_common/NoteThumbnail";

export default function convertGoogleDriveURL(driveUrl: string) {
  try {
    const match = driveUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${driveUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/)![1]}`;
    } else {
      throw new Error("Invalid Google Drive URL");
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/placeholders/alcohols/${placeholderThumbnailProvider("기타주류")}.png`;
  }
}
