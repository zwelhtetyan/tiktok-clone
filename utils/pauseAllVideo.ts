export function pauseAllVideo(elements: NodeList) {
  elements.forEach((elem) => {
    const videoTag = elem as HTMLVideoElement;
    videoTag.pause();
    videoTag.currentTime = 0;
  });
}
