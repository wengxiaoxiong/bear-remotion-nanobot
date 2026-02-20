/**
 * 伪代码显示组件
 * 等宽字体、行号、可逐行显示动画
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../lib/utils';

interface CodeBlockProps {
  code: string;
  startFrame?: number;
  revealDuration?: number;
  highlightLines?: number[];
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  startFrame = 0,
  revealDuration = 60,
  highlightLines = [],
  style,
}) => {
  const frame = useCurrentFrame();
  const lines = code.split('\n');

  const revealProgress = interpolate(
    frame,
    [startFrame, startFrame + revealDuration],
    [0, lines.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const containerOpacity = interpolate(
    frame,
    [startFrame, startFrame + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        backgroundColor: '#1a1b2e',
        borderRadius: 12,
        padding: '24px 28px',
        border: `1px solid ${colors.border}`,
        fontFamily: "'Fira Code', 'Source Code Pro', 'Menlo', monospace",
        fontSize: 22,
        lineHeight: 1.8,
        opacity: containerOpacity,
        overflow: 'hidden',
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const lineOpacity = interpolate(
          revealProgress,
          [i, i + 0.5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        const isHighlighted = highlightLines.includes(i + 1);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              opacity: lineOpacity,
              borderLeft: isHighlighted
                ? `3px solid ${colors.accent}`
                : '3px solid transparent',
              paddingLeft: 12,
              backgroundColor: isHighlighted
                ? 'rgba(34, 211, 238, 0.08)'
                : 'transparent',
              marginLeft: -16,
              paddingRight: 8,
            }}
          >
            <span
              style={{
                color: colors.textDark,
                width: 36,
                textAlign: 'right',
                marginRight: 16,
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                color: colorizeCode(line) ? undefined : colors.text,
                whiteSpace: 'pre',
              }}
            >
              {renderCodeLine(line)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 简单的代码着色
function colorizeCode(_line: string): boolean {
  return false; // 使用 renderCodeLine 代替
}

function renderCodeLine(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // 注释
  const commentMatch = remaining.match(/^(\s*)(\/\/.*)$/);
  if (commentMatch) {
    parts.push(
      <span key={key++} style={{ color: '#6b7280' }}>
        {commentMatch[1]}
      </span>,
    );
    parts.push(
      <span key={key++} style={{ color: '#6b7280', fontStyle: 'italic' }}>
        {commentMatch[2]}
      </span>,
    );
    return parts;
  }

  // 关键词高亮
  const keywords = ['async', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'await', 'in', 'of'];
  const stringRegex = /"[^"]*"|'[^']*'/g;
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

  // 先处理字符串
  let lastIndex = 0;
  const stringMatches = [...remaining.matchAll(stringRegex)];

  if (stringMatches.length === 0) {
    // 没有字符串，只处理关键词
    let kwLastIndex = 0;
    const kwMatches = [...remaining.matchAll(keywordRegex)];
    for (const m of kwMatches) {
      if (m.index! > kwLastIndex) {
        parts.push(
          <span key={key++} style={{ color: colors.text }}>
            {remaining.slice(kwLastIndex, m.index)}
          </span>,
        );
      }
      parts.push(
        <span key={key++} style={{ color: '#c084fc' }}>
          {m[0]}
        </span>,
      );
      kwLastIndex = m.index! + m[0].length;
    }
    if (kwLastIndex < remaining.length) {
      parts.push(
        <span key={key++} style={{ color: colors.text }}>
          {remaining.slice(kwLastIndex)}
        </span>,
      );
    }
    return parts.length > 0 ? parts : <span style={{ color: colors.text }}>{line}</span>;
  }

  for (const m of stringMatches) {
    const before = remaining.slice(lastIndex, m.index);
    if (before) {
      // 在非字符串部分处理关键词
      const kwParts = highlightKeywords(before, keywords, key);
      parts.push(...kwParts.nodes);
      key = kwParts.nextKey;
    }
    parts.push(
      <span key={key++} style={{ color: '#a5d6a7' }}>
        {m[0]}
      </span>,
    );
    lastIndex = m.index! + m[0].length;
  }
  if (lastIndex < remaining.length) {
    const kwParts = highlightKeywords(remaining.slice(lastIndex), keywords, key);
    parts.push(...kwParts.nodes);
  }

  return parts;
}

function highlightKeywords(
  text: string,
  keywords: string[],
  startKey: number,
): { nodes: React.ReactNode[]; nextKey: number } {
  const nodes: React.ReactNode[] = [];
  let key = startKey;
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  let lastIndex = 0;
  const matches = [...text.matchAll(keywordRegex)];

  for (const m of matches) {
    if (m.index! > lastIndex) {
      nodes.push(
        <span key={key++} style={{ color: colors.text }}>
          {text.slice(lastIndex, m.index)}
        </span>,
      );
    }
    nodes.push(
      <span key={key++} style={{ color: '#c084fc' }}>
        {m[0]}
      </span>,
    );
    lastIndex = m.index! + m[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(
      <span key={key++} style={{ color: colors.text }}>
        {text.slice(lastIndex)}
      </span>,
    );
  }
  return { nodes, nextKey: key };
}
