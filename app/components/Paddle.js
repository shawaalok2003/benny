'use client'

export default function Paddle({ width, height }) {
  return (
    <div
      className="paddle"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  )
}
