
interface Props {
    readonly active: boolean;
    readonly setActive: (active: any) => void;
}

function ToggleButton({active, setActive}: Props) {

    return (
        <div className={`toggle-button flex flex-align-center ${active ? 'is-active' : ''}`}
             onClick={() => setActive((prev: boolean) => !prev)}
        >
            <button className={`toggle-button__btn ${active ? 'is-active' : ''}`} type="button"></button>
        </div>
    )
}

export default ToggleButton;