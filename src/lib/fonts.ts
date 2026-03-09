/**
 * 字体配置
 */

import { loadFont } from '@remotion/google-fonts/NotoSansSC';

// 加载 Noto Sans SC 字体
const { fontFamily } = loadFont();

export { fontFamily };

// 备用字体栈
export const fontStack = `${fontFamily}, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
