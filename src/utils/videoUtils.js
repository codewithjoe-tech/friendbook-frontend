export const captureVideoFrame = (fileUrl, time) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = fileUrl;
      video.currentTime = time;
  
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
  
      video.onerror = (error) => {
        reject(error);
      };
    });
  };
  