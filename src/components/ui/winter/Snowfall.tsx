import {useEffect, useRef} from "react";

function Snowfall() {
    interface Snowflake {
        x: number
        y: number
        size: number
        speed: number
        wind: number
        opacity: number
    }

    const SNOW_CONFIG = {
        COUNT: 100,
        SPEED: 0.4,
        COLOR: '#ffffff',
        SIZE: 2,
        OPACITY: 0.7,
        WIND: 0.2
    } as const

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctx = useRef<CanvasRenderingContext2D | null>(null)
    const animationId = useRef<number | null>(null)
    const snowflakes = useRef<Snowflake[] | null>(null)

    const createSnowflake = (): Snowflake | null => {
        const canvas = canvasRef.current
        if (!canvas) return null

        return {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: SNOW_CONFIG.SIZE,
            speed: Math.random() * SNOW_CONFIG.SPEED + 0.3,
            wind: (Math.random() - 0.5) * SNOW_CONFIG.WIND,
            opacity: Math.random() * 0.3 + SNOW_CONFIG.OPACITY
        }
    }

    const initializeSnowflakes = () => {
        snowflakes.current = []

        for (let i = 0; i < SNOW_CONFIG.COUNT; i++) {
            const flake = createSnowflake()
            if (flake) snowflakes.current.push(flake)
        }
    }

    const setupCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        ctx.current = canvas.getContext('2d')
        initializeSnowflakes()
    }

    const drawSnowflake = (flake: Snowflake) => {
        const context = ctx.current
        if (!context) return

        context.beginPath()
        context.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        context.fill()
    }

    const updateSnowflakes = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        snowflakes.current?.forEach(flake => {
            flake.y += flake.speed
            flake.x += flake.wind

            if (flake.y > canvas.height) {
                flake.y = -10
                flake.x = Math.random() * canvas.width
            }

            if (flake.x > canvas.width + 10) flake.x = -10
            if (flake.x < -10) flake.x = canvas.width + 10
        })
    }

    const drawFrame = () => {
        const canvas = canvasRef.current
        const context = ctx.current
        if (!canvas || !context) return

        context.clearRect(0, 0, canvas.width, canvas.height)
        snowflakes.current?.forEach(drawSnowflake)
        updateSnowflakes()
    }

    const animate = () => {
        drawFrame()
        animationId.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
        setupCanvas()
    }

    useEffect(() => {
        setupCanvas()
        animate()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationId.current !== null) cancelAnimationFrame(animationId.current)
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="position-fixed w-100 h-100 pointer-none z--1" />
    )
}

export default Snowfall;