export default function themeToggler(setTheme: (theme: string) => void) {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setTheme('light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    setTheme('dark');
  }
}
