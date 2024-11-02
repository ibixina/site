// components/GameOfLife.tsx
import { useRef, useState, useEffect, useCallback } from 'react'

const colors = [
  'rgba(59, 130, 246, 0.5)',  // blue
  'rgba(16, 185, 129, 0.5)',  // green
  'rgba(139, 92, 246, 0.5)',  // purple
  'rgba(239, 68, 68, 0.5)',   // red
  'rgba(245, 158, 11, 0.5)',  // yellow
] as const;

const FIXED_WIDTH = 2000;
const FIXED_HEIGHT = 2000;
const CELL_SIZE = 35;

export default function GameOfLife() {
  //
  // ... rest of your GameOfLife component code ...
  //
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid, setGrid] = useState<number[][]>([])
  const [isRunning] = useState(true)

  // Fixed _SIZE = 35      // Fixed cell size

  const rows = Math.floor(FIXED_HEIGHT / CELL_SIZE)
  const cols = Math.floor(FIXED_WIDTH / CELL_SIZE)



  const initialize = useCallback(() => {
    const newGrid = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * colors.length) + 1 : 0)
    )
    setGrid(newGrid)
  }, [rows, cols])

  const runSimulation = useCallback(() => {
    if (!isRunning) return
    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
          ].reduce((acc, [x, y]) => {
            const newI = (i + x + rows) % rows
            const newJ = (j + y + cols) % cols
            return acc + (g[newI][newJ] !== 0 ? 1 : 0)
          }, 0)

          if (neighbors < 2 || neighbors > 3) return 0
          if (neighbors === 3) return cell || Math.floor(Math.random() * colors.length) + 1
          return cell
        })
      )
      return newGrid
    })
  }, [isRunning, rows, cols])

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const intervalId = setInterval(runSimulation, 500)
    return () => clearInterval(intervalId)
  }, [runSimulation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set fixed dimensions for the canvas
    canvas.width = FIXED_WIDTH
    canvas.height = FIXED_HEIGHT

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        ctx.beginPath()
        ctx.rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        ctx.fillStyle = cell ? colors[cell - 1] : 'rgba(229, 231, 235, 0.5)'
        ctx.fill()
      })
    })
  }, [grid])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${FIXED_WIDTH}px`,
          height: `${FIXED_HEIGHT}px`,
        }}
      />
    </div>
  )
}

