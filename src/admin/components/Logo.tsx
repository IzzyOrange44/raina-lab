import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.25rem 0',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <path
          d="M6 26 C 3 13, 11 4, 26 6 C 28 21, 20 30, 6 26 Z"
          fill="#059669"
        />
        <path
          d="M7.5 24.5 L 23 9"
          stroke="#fafafa"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      <span
        style={{
          fontFamily:
            'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
          fontSize: '1.35rem',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--theme-text)',
        }}
      >
        Raina Lab
      </span>
    </div>
  )
}
