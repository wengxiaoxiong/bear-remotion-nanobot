/**
 * 工具函数和常量
 */

// 主题颜色配置
export const colors = {
  // 主色调
  primary: '#6366f1',      // 靛紫色
  primaryLight: '#818cf8', // 浅靛紫
  primaryDark: '#4f46e5',  // 深靛紫
  
  // 强调色
  accent: '#22d3ee',       // 青色
  accentLight: '#67e8f9',  // 浅青
  
  // 背景色
  background: '#0f0f1a',   // 深色背景
  backgroundLight: '#1a1a2e', // 稍浅背景
  backgroundCard: '#16162a',  // 卡片背景
  
  // 文字色
  text: '#f8fafc',         // 主文字
  textMuted: '#94a3b8',    // 次要文字
  textDark: '#64748b',     // 暗文字
  
  // 功能色
  success: '#22c55e',      // 成功绿
  warning: '#f59e0b',      // 警告黄
  error: '#ef4444',        // 错误红
  info: '#3b82f6',         // 信息蓝
  
  // 边框/分割线
  border: '#27273a',       // 边框色
  divider: '#1e1e32',      // 分割线
};

// 动画缓动函数
export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { damping: 12, stiffness: 200 },
};

// 时间转换工具
export const fps = 30;
export const seconds = (s: number) => s * fps;
export const frames = (f: number) => f;

// 字符串截断
export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// 格式化时间显示 (秒 -> MM:SS)
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
