export const useTheme = () => {
  const appConfig = useAppConfig()
  const isDark = useState('theme-dark', () => !!appConfig.theme?.dark)

  const applyTheme = (dark: boolean, persist = true) => {
    if (!process.client) {
      return
    }

    const theme = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)

    if (persist) {
      localStorage.setItem('theme', theme)
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const initTheme = () => {
    if (!process.client) {
      return
    }

    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'dark' || savedTheme === 'light') {
      isDark.value = savedTheme === 'dark'
      applyTheme(isDark.value)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    applyTheme(isDark.value, false)
  }

  watch(isDark, (dark) => {
    applyTheme(dark)
  })

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
}
