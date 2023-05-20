import axios, { AxiosProgressEvent } from "axios";
import { getHttpOptions } from "../../../utils/utils";

export async function uploadImageToCloud(
  file: File,
  progressCallback: (event: AxiosProgressEvent) => void
) {
  const token = getHttpOptions();

  const formData = new FormData();

  formData.append("file", file);

  try {
    const request = axios.create({
      baseURL: "http://localhost:5251/api/",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const post = await request.post("users/add-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: progressCallback,
    });

    return post;
  } catch (e) {
    console.log(`Error uploading: ${e}`);
  }
}
