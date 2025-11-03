export const Platform = {
  isIOS: () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
  },

  isAndroid: () => {
    return /Android/.test(navigator.userAgent)
  },

  isMobile: () => {
    return Platform.isIOS() || Platform.isAndroid()
  },

  isStandalone: () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  },

  getOS: () => {
    if (Platform.isIOS()) return 'ios'
    if (Platform.isAndroid()) return 'android'
    return 'web'
  },
}
