import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

const uploadImageToCloudinary = async (
  file: any,             
  folder: string,
  height?: number,
  quality?: number
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  const options: {
    folder: string;
    height?: number;
    quality?: number;
    resource_type: "auto";
  } = {
    folder,
    resource_type: "auto",
  };

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

export default uploadImageToCloudinary;