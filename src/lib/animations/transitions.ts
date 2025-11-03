export const transitions = {
  // iOS-like transitions
  ios: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  iosSlow: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },

  // Android-like transitions
  android: {
    type: 'tween' as const,
    duration: 0.3,
    ease: [0.4, 0.0, 0.6, 1] as [number, number, number, number],
  },
  androidSlow: {
    type: 'tween' as const,
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
  },

  // Smooth spring
  spring: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
  },

  // Bouncy spring
  springBounce: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },

  // Quick snap
  snap: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 40,
  },
} as const

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const
