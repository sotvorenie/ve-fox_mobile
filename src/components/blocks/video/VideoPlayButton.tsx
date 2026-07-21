import { motion } from "framer-motion";

interface Props {
    className?: string
    title?: string
    isPlaying: boolean
    setIsPlaying: (isPlaying: boolean) => void
}

function PlayerButton({ className, title, isPlaying, setIsPlaying }: Readonly<Props>) {
    const pausePath = "M6,5 L9.5,5 L9.5,19 L6,19 Z M14.5,5 L18,5 L18,19 L14.5,19 Z";
    const playPath = "M8.5,5 L14,8.5 L14,15.5 L8.5,19 Z M14,8.5 L19.5,12 L19.5,12 L14,15.5 Z";

    return (
        <button
            className={`${className} video-player__background recolor-svg i-svg`}
            onClick={() => setIsPlaying(!isPlaying)}
            type="button"
            title={title}
        >
            <svg width="100" height="100" viewBox="0 0 24 24" style={{ filter: "url(#gooey-tight)" }}>
                <defs>
                    <filter id="gooey-tight">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"
                        />
                    </filter>
                </defs>

                <motion.path
                    fill="#000"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: isPlaying ? pausePath : playPath }}
                    transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.18
                    }}
                />
            </svg>
        </button>
    );
}

export default PlayerButton;