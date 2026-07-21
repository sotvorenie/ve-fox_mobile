
function VideoFileIcon() {
    return (
        <svg
            width="128"
            height="128"
            viewBox="0 0 32 32"
            fill="none"
        >
            <polygon
                points="29,23 25,20.4 25,16.6 29,14"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M23,23h-5c-1.1,0-2-0.9-2-2v-5c0-1.1,0.9-2,2-2h5c1.1,0,2,0.9,2,2v5C25,22.1,24.1,23,23,23z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
            />

            <line
                x1="23"
                y1="14"
                x2="23"
                y2="9"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
            />

            <polyline
                points="17,3 17,9 23,9 17,3 5,3 5,29 23,29 23,23"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default VideoFileIcon;