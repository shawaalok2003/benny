'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/celebration.css'

export default function Celebration({ onContinue, showContinue }) {
  const audioRef = useRef(null)
  const [balloons, setBalloons] = useState([])
  const [confetti, setConfetti] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // All available images in public folder
  const images = [
    '/birthday-celebration.jpg',
    '/WhatsApp Image 2026-02-09 at 17.33.52.jpeg',
    '/WhatsApp Image 2026-02-09 at 17.33.52 (1).jpeg',
    '/WhatsApp Image 2026-02-09 at 17.35.37.jpeg'
  ]

  useEffect(() => {
    // Generate floating balloons
    const balloonColors = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF595E']
    const balloonArray = []
    for (let i = 0; i < 8; i++) {
      balloonArray.push({
        id: i,
        left: 10 + (i * 12),
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: balloonColors[i % balloonColors.length]
      })
    }
    setBalloons(balloonArray)

    // Generate confetti particles
    const particles = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
      })
    }
    setConfetti(particles)

    // Play birthday music with volume - only when celebration is mounted
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.6
        audioRef.current.currentTime = 0 // Start from beginning
        // Small delay to ensure component is fully mounted
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch((error) => {
              console.log('Audio autoplay prevented, will play on interaction:', error)
              // Try again on any user interaction
              const playOnInteraction = () => {
                if (audioRef.current) {
                  audioRef.current.play().catch(() => {})
                }
                document.removeEventListener('click', playOnInteraction)
                document.removeEventListener('touchstart', playOnInteraction)
              }
              document.addEventListener('click', playOnInteraction)
              document.addEventListener('touchstart', playOnInteraction)
            })
          }
        }, 100)
      }
    }
    
    playMusic()

    // Auto-cycle through images every 2.5 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 2500)

    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      clearInterval(imageInterval)
    }
  }, [images.length])

  return (
    <div className="celebration-overlay">
      <audio ref={audioRef} loop preload="auto">
        <source src="/sounds/happy-birthday.mp3" type="audio/mpeg" />
      </audio>

      {/* Confetti animation */}
      {confetti.map(particle => (
        <div
          key={`confetti-${particle.id}`}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            backgroundColor: particle.color,
          }}
        />
      ))}

      {/* Floating balloons */}
      {balloons.map(balloon => (
        <div
          key={`balloon-${balloon.id}`}
          className="balloon"
          style={{
            left: `${balloon.left}%`,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`,
            backgroundColor: balloon.color,
          }}
        >
          <div className="balloon-string"></div>
        </div>
      ))}

      <div className="celebration-content">
        {/* Birthday image slideshow */}
        <div className="birthday-image-container">
          <img 
            key={currentImageIndex}
            src={images[currentImageIndex]} 
            alt="Birthday Celebration" 
            className="birthday-image"
            onError={(e) => {
              // Fallback to emoji if image not found
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div className="birthday-emoji-fallback">🎂🎉🎈</div>
          
          {/* Image indicators */}
          <div className="image-indicators">
            {images.map((_, index) => (
              <span 
                key={index}
                className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Birthday message */}
        <h1 className="celebration-title">
          <span className="title-line">Happy Birthday</span>
          <span className="title-name">Benny!</span>
        </h1>

        <div className="celebration-stars">
          <span className="star">⭐</span>
          <span className="star">✨</span>
          <span className="star">🌟</span>
          <span className="star">✨</span>
          <span className="star">⭐</span>
        </div>

        {/* Continue button */}
        {showContinue && (
          <button className="birthday-button" onClick={onContinue}>
            🎮 Continue Playing! 🎮
          </button>
        )}
      </div>
    </div>
  )
}
