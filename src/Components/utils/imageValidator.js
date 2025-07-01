// utils/imageValidator.js

export const validateImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file selected");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return reject("Only jpeg, png, jpg, gif, webp images are allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      return reject(`${file.name} is larger than 2MB.`);
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      if (img.width === 1000 && img.height === 1000) {
        resolve(url);
      } else {
        URL.revokeObjectURL(url);
        reject(`${file.name} must be exactly 1000x1000 pixels.`);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(`${file.name} is not a valid image.`);
    };
  });
};
