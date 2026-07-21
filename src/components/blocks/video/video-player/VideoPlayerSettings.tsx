interface Props {
    isVisible: boolean
}


function VideoPlayerSettings({isVisible}: Readonly<Props>) {

    return (
        <div
            className={`video-settings position-absolute tr-opacity z-10000 ${isVisible ? 'is-active' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="video-settings__list">
                <li className="video-settings__item">
                    <label className="video-settings__label hover-color-accent flex flex-align-center">
                        Субтитры

                    </label>
                </li>
            </ul>
        </div>
    )
}

export default VideoPlayerSettings;