import CrossIcon from "@icons/CrossIcon";

interface Props {
    closeFunc: () => void
}

function CloseBtn({closeFunc}: Readonly<Props>) {

    return (
        <button className="close-btn recolor-svg hover-color-accent position-absolute radius-50 flex-center flex-center"
                type="button"
                onClick={closeFunc}
                title="Закрыть"
                aria-label="Закрыть"
        >
            <CrossIcon/>
        </button>
    )
}

export default CloseBtn;