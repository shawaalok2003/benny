'use client'

export default function Ball({ size }) {
  return (
    <div
      className="ball"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  )
}
