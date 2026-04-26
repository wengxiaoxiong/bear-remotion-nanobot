import React from 'react';
import { colors } from '../lib/utils';
import { fontStack } from '../lib/fonts';

export const Subtitle: React.FC<{
  text: string;
  style?: React.CSSProperties;
}> = ({ text, style }) => {
  return (
    <p
      style={{
        fontSize: 24,
        lineHeight: 1.5,
        color: colors.text,
        fontFamily: fontStack,
        textAlign: 'center',
        margin: 0,
        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        ...style,
      }}
    >
      {text}
    </p>
  );
};

export const SubtitleContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        background: `linear-gradient(to top, ${colors.background} 45%, ${colors.background}DD 70%, transparent)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 24,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};
