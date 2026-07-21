interface Props {
    isShowSettings: boolean
}

function VideoPlayerSettings({isShowSettings}: Readonly<Props>) {

    return (
        <div className={`video-player__settings position-absolute inset-0 z-1000 tr-opacity ${isShowSettings ? 'is-active' : ''}`}>
            <div
                className="video-player__settings-content position-absolute"
                onClick={(e) => e.stopPropagation()}
            >
                <ul className="video-player__settings-list">
                    <li className="video-player__settings-item">
                        <label className="video-player__settings-label hover-color-accent flex flex-align-center">
                            Субтитры

                        </label>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default VideoPlayerSettings;