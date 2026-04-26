export const colors = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  accent: '#22d3ee',
  accentLight: '#67e8f9',
  background: '#0f0f1a',
  backgroundLight: '#1a1a2e',
  backgroundCard: '#16162a',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDark: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  border: '#27273a',
  divider: '#1e1e32',
  // EP3 涓撳睘鍒嗗眰棰滆壊
  layerIdentity: '#3b82f6',
  layerBootstrap: '#eab308',
  layerMemory: '#ec4899',
  layerSkills: '#22c55e',
};

export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { damping: 12, stiffness: 200 },
};

export const fps = 30;
export const seconds = (s: number) => s * fps;
export const frames = (f: number) => f;

export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
