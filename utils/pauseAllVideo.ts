export function pauseAllVideo(elements: NodeList, resetCurrentTime = true) {
  elements.forEach((elem) => {
    const videoTag = elem as HTMLVideoElement;
    videoTag.pause();

    if (resetCurrentTime) {
      videoTag.currentTime = 0;
    }
  });
}
