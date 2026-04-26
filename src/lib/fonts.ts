import { loadFont } from '@remotion/google-fonts/NotoSansSC';

const { fontFamily } = loadFont();

export { fontFamily };

export const fontStack = `${fontFamily}, 'PingFang SC', 'Microsoft YaHei', sans-serif`;
export const codeFontStack = "'Fira Code', 'Source Code Pro', 'Menlo', 'Courier New', monospace";
