try {
  let activeTheme = localStorage.getItem('theme');

  if (activeTheme !== 'dark' && activeTheme !== 'light') {
    activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  document.documentElement.setAttribute('data-theme', activeTheme);
} catch (e) {
  console.error(e);
}
