import {useRef, useState} from "react";

import PlusIcon from "@icons/PlusIcon";
import CrossIcon from "@icons/CrossIcon";

interface Props {
    className: string
    tags: string[]
    setTags: (tags: any) => void
}

function Upload3({className, tags, setTags}: Readonly<Props>) {
    const [videoTag, setVideoTag] = useState<string>("")
    const inputRef = useRef<HTMLInputElement | null>(null)

    const addTag = () => {
        const newTag: string = videoTag.trim()

        if (!newTag) return

        setTags((prev: string[]) => [newTag, ...prev])
        setVideoTag('')
        inputRef.current?.focus()
    }

    const removeTag = (index: number) => {
        setTags((prev: string[]) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className={`upload-video__tags ${className}`}>
            <div className="upload-video__tags-head flex mb-30">
                <div className="upload-video__tags-input-wrapper position-relative w-100">
                    <input
                        className="upload-video__tags-input input__inp w-100"
                        type="text"
                        placeholder="Введите тег.."
                        value={videoTag}
                        onChange={(e) => setVideoTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTag()
                        }}
                        ref={inputRef}
                    />

                    {videoTag?.length > 0 && (
                        <button className="upload-video__tags-clear recolor-svg hover-color-accent"
                                type="button"
                                onClick={() => setVideoTag('')}
                        >
                            <CrossIcon/>
                        </button>
                    )}
                </div>

                <button className="upload-video__tags-btn recolor-svg hover-color-accent flex-center"
                        type="button"
                        onClick={addTag}
                >
                    <span>Добавить</span>
                    <PlusIcon/>
                </button>
            </div>

            {tags?.length > 0 && (
                <ul className="upload-video__tags-list flex flex-wrap">
                    {tags.map((tag: string, index: number) => (
                        <li key={`${tag}-${index}`}
                            className="upload-video__tags-item flex flex-align-center"
                        >
                            <span>{tag}</span>

                            <button className="recolor-svg hover-color-accent"
                                    type="button"
                                    onClick={() => removeTag(index)}
                            >
                                <CrossIcon/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Upload3;