export function openSidebar(sideBar?: HTMLElement, overlay?: HTMLElement) {
  if (!sideBar) {
    sideBar = document.querySelector('.side-bar') as HTMLElement;
  }

  if (!overlay) {
    overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
  }

  sideBar?.classList.remove('hide-sidebar');
  sideBar?.classList.add('show-sidebar');
  overlay?.classList.remove('hide-sidebar-overlay');
  overlay?.classList.add('show-sidebar-overlay');
}

export function closeSidebar(sideBar?: HTMLElement, overlay?: HTMLElement) {
  if (!sideBar) {
    sideBar = document.querySelector('.side-bar') as HTMLElement;
  }

  if (!overlay) {
    overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
  }

  sideBar?.classList.remove('show-sidebar');
  sideBar?.classList.add('hide-sidebar');
  overlay?.classList.remove('show-sidebar-overlay');
  overlay?.classList.add('hide-sidebar-overlay');
}

export function toggleSidebarDrawer() {
  const sideBar = document.querySelector('.side-bar') as HTMLElement;
  const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
  if (!sideBar || !overlay) return;

  if (sideBar.classList.contains('show-sidebar')) {
    closeSidebar(sideBar, overlay);
  } else {
    openSidebar(sideBar, overlay);
  }
}
