# 🎉 Benny's Birthday Game

A fun and interactive birthday celebration game built with Next.js! Bounce the ball to reach a score of 12 and unlock a special birthday surprise!

## 🎮 Game Features

- **Physics-Based Gameplay**: Ball falls with gravity and bounces off the paddle
- **Auto-Moving Paddle**: Paddle automatically moves left and right
- **Score System**: Earn points for each successful bounce
- **Birthday Celebration**: Special animation and music when you reach 12 points
- **Sound Effects**: Toggle-able sound effects and background music
- **Smooth Animations**: CSS animations with glowing effects and confetti
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\HP\Desktop\benny"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add Audio Files (Important!):**
   
   Place your audio files in the `public/sounds/` directory:
   - `happy-birthday.mp3` - Birthday celebration music
   - `bounce.mp3` (optional) - Ball bounce sound effect
   
   You can download free audio files from:
   - [Pixabay Music](https://pixabay.com/music/)
   - [FreeSound](https://freesound.org/)
   - [Bensound](https://www.bensound.com/)

### Running the Game

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

3. **Start playing!** The paddle will automatically move, and the ball will start falling. Try to bounce it 12 times!

## 🎯 How to Play

1. The ball will fall from the top of the screen
2. The paddle at the bottom moves automatically left and right
3. When the ball hits the paddle, it bounces back up and you earn 1 point
4. Reach 12 points to trigger the birthday celebration!
5. Click the speaker icon (🔊/🔇) to toggle sound
6. After the celebration, click "Play Again" to restart

## 📁 Project Structure

```
benny/
├── app/
│   ├── components/
│   │   ├── Ball.js           # Ball component
│   │   ├── Paddle.js         # Paddle component
│   │   ├── Score.js          # Score display
│   │   ├── Celebration.js    # Birthday celebration screen
│   │   └── Game.js           # Main game logic
│   ├── styles/
│   │   └── game.css          # Game styles and animations
│   ├── layout.js             # Root layout
│   ├── page.js              # Main page
│   └── globals.css          # Global styles
├── public/
│   └── sounds/
│       ├── happy-birthday.mp3  # Birthday music (add this!)
│       └── bounce.mp3          # Bounce sound (optional)
├── package.json
├── next.config.js
└── README.md
```

## 🎨 Features Breakdown

### Game Mechanics
- **Gravity simulation** using `requestAnimationFrame`
- **Collision detection** between ball and paddle
- **Automatic paddle movement** with direction reversal at boundaries
- **Ball respawn** if it falls below the game area

### Visual Effects
- **Animated gradient background** that shifts colors
- **Glowing ball** with pulsing animation
- **Score pop animation** when points are earned
- **Confetti particles** falling from the top during celebration
- **Smooth transitions** and hover effects

### Audio
- **Background music** during celebration
- **Bounce sound effects** (optional)
- **Sound toggle** to enable/disable all audio

## 🛠️ Built With

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **CSS3 Animations** - Smooth visual effects
- **JavaScript** - Game physics and logic

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎵 Adding Custom Music

To add your own birthday music:

1. Find or create an MP3 file
2. Name it `happy-birthday.mp3`
3. Place it in `public/sounds/`
4. Restart the development server if it's already running

## 🚀 Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

The game will be optimized and ready to deploy!

## 🎁 Customization Ideas

Want to personalize the game? Here are some ideas:

- Change the name in `Celebration.js` (line with "Happy Birthday Benny!")
- Modify colors in `game.css` (search for color codes)
- Adjust difficulty by changing constants in `Game.js`:
  - `GRAVITY` - Ball fall speed
  - `PADDLE_SPEED` - How fast the paddle moves
  - `BOUNCE_STRENGTH` - How high the ball bounces
- Change the winning score (currently 12) in `Game.js`

## 📝 License

This is a personal birthday project. Feel free to use and modify it for your own celebrations!

## 🎉 Happy Birthday Benny!

Enjoy the game and have an amazing birthday! 🎂🎈🎁

---

Made with ❤️ for Benny's special day
