'use client'

import { useEffect, useState } from 'react'

export default function Score({ score, level }) {
  const [animate, setAnimate] = useState(false)
  const [levelUp, setLevelUp] = useState(false)

  useEffect(() => {
    if (score > 0) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 300)
      return () => clearTimeout(timer)
    }
  }, [score])
  
  useEffect(() => {
    if (level > 1) {
      setLevelUp(true)
      const timer = setTimeout(() => setLevelUp(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [level])

  return (
    <div className="score-container">
      <div className={`score ${animate ? 'score-animate' : ''}`}>
        Score: {score}
      </div>
      {levelUp && (
        <div className="level-up-notification">
          🎉 Level {level}! 🎉
        </div>
      )}
    </div>
  )
}
