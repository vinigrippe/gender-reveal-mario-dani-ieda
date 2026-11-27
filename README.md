# MENINA Gift Box Game

React + TypeScript + Vite. Everything is rendered with React components (DOM + SVG + CSS), no canvas.

    npm install
    npm run dev      # play locally
    npm run build    # production build in dist/

Controls: Arrow keys / A D to move, Space / Up to jump. Hit the gift boxes from below.

## Structure

    src/
      App.tsx, main.tsx
      components/   Game, GiftBox, Mario, FloatingLetter, Particles, Overlays
      scenery/      Mountains, Clouds, Floor, Bushes
      hooks/        useGameLoop, useKeyboardInput, useViewport
      game/         constants, types, engine (pure game logic)
      utils/        viewport maths
      styles/       game.css
