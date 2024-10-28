// src/utils/cropUtils.js

import Cropper from "cropperjs"; // Install cropperjs if you haven't already

// Example function to crop an image
export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = (err) => reject(err);
  });
};

// Placeholder function for cropping a video
export const getCroppedVideo = async (videoSrc, startTime, endTime) => {
  // Implement video cropping logic based on your requirements
  return videoSrc;
};
