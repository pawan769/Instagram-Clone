import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const getImageDataUri = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event listener when the file is successfully read
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };

    // Error handling
    reader.onerror = function (error) {
      reject("Error occurred while reading the image file: " + error);
    };

    // Read the file as a Data URL (base64)
    reader.readAsDataURL(imageFile);
  });
};
