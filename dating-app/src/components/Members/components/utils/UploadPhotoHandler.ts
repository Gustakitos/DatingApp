import { getHttpOptions } from "../../../utils/utils";

export async function uploadImageToCloud() {
  const token = getHttpOptions();

  try {
    const response = await fetch('http://localhost:5251/api/users/add-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    console.log("response: ", response);

    return response;
  } catch(e) {
    console.log(`Error uploading: ${e}`);
  }
}
