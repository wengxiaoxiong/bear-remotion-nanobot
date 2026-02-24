import { Easing } from 'remotion';

export const MOTION_DURATION = {
  enterFast: 14,
  enterNormal: 18,
  enterSlow: 22,
  exitFast: 12,
  exitNormal: 18,
} as const;

export const MOTION_STAGGER = {
  sm: 6,
  md: 10,
  lg: 14,
} as const;

export const MOTION_OFFSET = {
  xSm: 12,
  xMd: 24,
  xLg: 40,
  ySm: 8,
  yMd: 16,
  yLg: 28,
} as const;

export const MOTION_EASING = {
  standard: Easing.bezier(0.22, 1, 0.36, 1),
  emphasis: Easing.bezier(0.2, 0.8, 0.2, 1),
  exit: Easing.inOut(Easing.cubic),
} as const;

export const SPRING_PRESETS = {
  soft: { damping: 20, stiffness: 170, mass: 0.9 },
  emphasis: { damping: 16, stiffness: 190, mass: 0.85 },
} as const;
