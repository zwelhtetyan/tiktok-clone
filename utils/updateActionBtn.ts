export function updateActionBtn(id: string, isPause = false) {
  const actionBtnContainers = document.querySelectorAll(
    '.action-btn-container',
  );

  actionBtnContainers.forEach((btnContainer) => {
    const playIcon = btnContainer.querySelector('.play-btn');
    const pauseIcon = btnContainer.querySelector('.pause-btn');

    if (isPause) {
      if (btnContainer.id === id) {
        playIcon?.classList.remove('hidden');
        pauseIcon?.classList.add('hidden');
      }
    } else {
      if (btnContainer.id === id) {
        playIcon?.classList.add('hidden');
        pauseIcon?.classList.remove('hidden');
      } else {
        playIcon?.classList.remove('hidden');
        pauseIcon?.classList.add('hidden');
      }
    }
  });
}
