'use client'

import { useState, useEffect, useRef } from 'react'
import Ball from './Ball'
import Paddle from './Paddle'
import Score from './Score'
import Celebration from './Celebration'
import '../styles/game.css'

export default function Game() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameFinished, setGameFinished] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  
  const ballsRef = useRef([{ id: 1, x: 300, y: 200, vx: 4, vy: 4 }])
  const paddleRef = useRef({ x: 250 })
  const gameAreaRef = useRef()
  const animationRef = useRef()
  const lastScoreUpdate = useRef(0)
  const particlesRef = useRef([])
  const lowPowerRef = useRef(false)
  const lastFrameTimeRef = useRef(0)

  // Game constants
  const BALL_SIZE = 25
  const PADDLE_WIDTH = 120
  const PADDLE_HEIGHT = 15
  const BASE_BALL_SPEED = 12
  
  // Load high score from localStorage
  useEffect(() => {
    // Clear localStorage data
    localStorage.removeItem('bennyGameHighScore')
    setHighScore(0)
  }, [])

  // Detect low-power/mobile devices to reduce load
  useEffect(() => {
    const userAgent = navigator.userAgent || ''
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent)
    const hasLowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4
    lowPowerRef.current = isMobile || hasLowMemory
  }, [])
  
  // Calculate current speed based on level
  const getCurrentSpeed = () => {
    return BASE_BALL_SPEED + (level - 1) * 0.8
  }
  
  // Add new ball at certain levels
  const checkAndAddBalls = () => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return

    const maxBalls = lowPowerRef.current ? 1 : 5
    const shouldHaveBalls = lowPowerRef.current ? 1 : Math.floor(level / 3) + 1
    if (ballsRef.current.length < shouldHaveBalls && ballsRef.current.length < maxBalls) {
      const rect = gameArea.getBoundingClientRect()
      const currentSpeed = getCurrentSpeed()
      const newBall = {
        id: Date.now(),
        x: Math.random() * (rect.width - BALL_SIZE),
        y: 100,
        vx: (Math.random() > 0.5 ? 1 : -1) * currentSpeed,
        vy: currentSpeed
      }
      ballsRef.current.push(newBall)
    }
  }

  // Mouse and Touch control for paddle
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gameAreaRef.current || gameFinished) return
      
      const rect = gameAreaRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      paddleRef.current.x = Math.max(0, Math.min(rect.width - PADDLE_WIDTH, mouseX - PADDLE_WIDTH / 2))
    }

    const handleTouchMove = (e) => {
      if (!gameAreaRef.current || gameFinished) return
      e.preventDefault()
      
      const rect = gameAreaRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const touchX = touch.clientX - rect.left
      paddleRef.current.x = Math.max(0, Math.min(rect.width - PADDLE_WIDTH, touchX - PADDLE_WIDTH / 2))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [gameFinished])

  // Start game on click or touch
  useEffect(() => {
    const handleStart = () => {
      if (!gameStarted && !gameFinished) {
        setGameStarted(true)
      }
    }

    window.addEventListener('click', handleStart)
    window.addEventListener('touchstart', handleStart)
    
    return () => {
      window.removeEventListener('click', handleStart)
      window.removeEventListener('touchstart', handleStart)
    }
  }, [gameStarted, gameFinished])

  // Main game loop
  useEffect(() => {
    if (gameFinished || !gameStarted || showCelebration || gameOver) return

    const gameLoop = () => {
      const now = performance.now()
      if (lowPowerRef.current && now - lastFrameTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(gameLoop)
        return
      }
      lastFrameTimeRef.current = now

      const gameArea = gameAreaRef.current
      if (!gameArea) {
        animationRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const rect = gameArea.getBoundingClientRect()
      const WIDTH = rect.width
      const HEIGHT = rect.height

      // Update all balls
      let allBallsFell = true
      ballsRef.current.forEach((ball, index) => {
        // Update ball position
        ball.x += ball.vx
        ball.y += ball.vy

        // Ball collision with left/right walls
        if (ball.x <= 0 || ball.x >= WIDTH - BALL_SIZE) {
          ball.vx = -ball.vx
          ball.x = Math.max(0, Math.min(WIDTH - BALL_SIZE, ball.x))
        }

        // Ball collision with top wall
        if (ball.y <= 0) {
          ball.vy = -ball.vy
          ball.y = 0
        }

        // Ball collision with paddle
        const paddleY = HEIGHT - 60
        const ballCenterX = ball.x + BALL_SIZE / 2
        const ballBottom = ball.y + BALL_SIZE

        if (
          ballBottom >= paddleY &&
          ballBottom <= paddleY + PADDLE_HEIGHT + 5 &&
          ballCenterX >= paddleRef.current.x &&
          ballCenterX <= paddleRef.current.x + PADDLE_WIDTH &&
          ball.vy > 0
        ) {
          // Bounce off paddle
          ball.vy = -Math.abs(ball.vy)
          
          // Add angle based on where ball hits paddle
          const hitPos = (ballCenterX - paddleRef.current.x) / PADDLE_WIDTH
          ball.vx = (hitPos - 0.5) * 8
          
          // Create particle effect (reduced on low-power devices)
          const particleCount = lowPowerRef.current ? 1 : 5
          for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push({
              id: Date.now() + i,
              x: ballCenterX,
              y: paddleY,
              vx: (Math.random() - 0.5) * 5,
              vy: -Math.random() * 5,
              life: 20
            })
          }
          
          // Increase score by +1 per hit
          const now = Date.now()
          if (now - lastScoreUpdate.current > 100) {
            setCombo(c => {
              const newCombo = c + 1
              setMaxCombo(mc => Math.max(mc, newCombo))
              return newCombo
            })
            
            setScore(s => {
              const newScore = s + 1
              // Update high score
              if (newScore > highScore) {
                setHighScore(newScore)
                localStorage.setItem('bennyGameHighScore', newScore.toString())
              }
              // Level up every 5 points
              const newLevel = Math.floor(newScore / 5) + 1
              if (newLevel > level) {
                setLevel(newLevel)
                checkAndAddBalls()
              }
              return newScore
            })
            lastScoreUpdate.current = now
            
            // No sound during gameplay - sound only plays at celebration
          }
        }

        // Check if ball is still in play
        if (ball.y < HEIGHT + 100) {
          allBallsFell = false
        }
      })
      
      // Remove balls that fell
      ballsRef.current = ballsRef.current.filter(ball => ball.y < HEIGHT + 100)
      
      // Game over if all balls fell
      if (allBallsFell && ballsRef.current.length === 0) {
        setGameOver(true)
        setCombo(0)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        return
      }
      
      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2
        p.life -= 1
        return p.life > 0
      })

      // Update paddle position (keep within bounds)
      paddleRef.current.x = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, paddleRef.current.x))

      // Force re-render
      if (ballsRef.current.length > 0) {
        gameAreaRef.current.style.setProperty('--ball-x', `${ballsRef.current[0].x}px`)
        gameAreaRef.current.style.setProperty('--ball-y', `${ballsRef.current[0].y}px`)
      }
      gameAreaRef.current.style.setProperty('--paddle-x', `${paddleRef.current.x}px`)
      
      // Render additional balls and particles (skip on low-power devices)
      if (!lowPowerRef.current) {
        const existingBalls = gameAreaRef.current.querySelectorAll('.ball-multi')
        existingBalls.forEach(ball => ball.remove())

        const existingParticles = gameAreaRef.current.querySelectorAll('.particle')
        existingParticles.forEach(p => p.remove())

        ballsRef.current.slice(1).forEach(ball => {
          const ballEl = document.createElement('div')
          ballEl.className = 'ball ball-multi'
          ballEl.style.left = `${ball.x}px`
          ballEl.style.top = `${ball.y}px`
          ballEl.style.width = `${BALL_SIZE}px`
          ballEl.style.height = `${BALL_SIZE}px`
          gameAreaRef.current.appendChild(ballEl)
        })

        particlesRef.current.forEach(particle => {
          const pEl = document.createElement('div')
          pEl.className = 'particle'
          pEl.style.left = `${particle.x}px`
          pEl.style.top = `${particle.y}px`
          pEl.style.opacity = particle.life / 20
          gameAreaRef.current.appendChild(pEl)
        })
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameStarted, gameFinished, soundEnabled, showCelebration, gameOver, level, combo, highScore])

  // Auto-show celebration at score 11
  useEffect(() => {
    if (score === 11 && !hasSeenCelebration && !showCelebration) {
      setShowCelebration(true)
      setHasSeenCelebration(true)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [score, hasSeenCelebration, showCelebration])
  
  const handleContinue = () => {
    setShowCelebration(false)
    setGameStarted(true)
  }

  const handleRestart = () => {
    setScore(0)
    setLevel(1)
    setCombo(0)
    setMaxCombo(0)
    setGameFinished(false)
    setGameOver(false)
    setShowCelebration(false)
    setHasSeenCelebration(false)
    setGameStarted(false)
    ballsRef.current = [{ id: 1, x: 300, y: 200, vx: 4, vy: 4 }]
    paddleRef.current = { x: 250 }
    particlesRef.current = []
    lastScoreUpdate.current = 0
  }

  return (
    <div 
      className="game-container" 
      ref={gameAreaRef}
      style={{
        '--ball-x': '300px',
        '--ball-y': '200px',
        '--paddle-x': '250px'
      }}
    >
      <div className="game-header">
        <div className="game-stats">
          <Score score={score} level={level} />
          <div className="high-score">Best: {highScore}</div>
          {combo > 2 && <div className="combo-display">Combo x{combo}!</div>}
        </div>
        <div className="game-info">
          <div className="balls-count">⚽ x{ballsRef.current.length}</div>
          <button 
            className="sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
      
      {gameStarted && !gameFinished && !showCelebration && !gameOver && (
        <>
          <div className="level-indicator">Level {level}</div>
          <div className="speed-indicator">Speed: {getCurrentSpeed().toFixed(1)}x</div>
        </>
      )}

      {!gameStarted && !gameFinished && !showCelebration && !gameOver && (
        <div className="start-message">
          Click anywhere to start!
        </div>
      )}

      {!gameFinished && !showCelebration && !gameOver && (
        <>
          <Ball size={BALL_SIZE} />
          <Paddle width={PADDLE_WIDTH} height={PADDLE_HEIGHT} />
        </>
      )}
      
      {showCelebration && (
        <Celebration 
          onContinue={handleContinue}
          showContinue={true}
        />
      )}
      
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h1 className="game-over-title">Game Over!</h1>
            <p className="game-over-score">Final Score: {score}</p>
            <p className="game-over-level">Level Reached: {level}</p>
            {maxCombo > 5 && <p className="game-over-combo">Best Combo: x{maxCombo}</p>}
            <p className="game-over-high">High Score: {highScore}</p>
            {score === highScore && score > 0 && (
              <p className="game-over-new-record">🎉 New Record! 🎉</p>
            )}
            <div className="game-stats-detailed">
              <div className="stat-item">
                <span className="stat-label">Total Bounces</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Max Balls</span>
                <span className="stat-value">{Math.floor(level / 3) + 1}</span>
              </div>
            </div>
            <button className="restart-button" onClick={handleRestart}>
              Play Again 🎮
            </button>
          </div>
        </div>
      )}

      {gameFinished && (
        <Celebration 
          onRestart={handleRestart}
          soundEnabled={soundEnabled} 
          score={score}
          highScore={highScore}
          level={level}
          maxCombo={maxCombo}
          ballCount={ballsRef.current.length}
          showContinue={false}
        />
      )}
    </div>
  )
}
