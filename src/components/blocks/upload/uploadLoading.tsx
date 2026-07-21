import React from "react";

import FoxIcon from "@icons/FoxIcon.tsx";

interface Props {
    progress: number
}

function UploadLoading({ progress = 10 }: Readonly<Props>) {

    return (
        <div className="upload-loading w-100 absolute-center recolor-svg"
             style={{ '--progress': `${progress}%` } as React.CSSProperties}
        >
            <p className="upload-loading__text h2 text-w600 absolute-center">90%</p>
            <FoxIcon className="upload-loading__fox position-absolute z-1 bottom-0"/>
            <img className="upload-loading__forest w-100" src="/forest.png" alt=""/>
            <img className="upload-loading__forest-sent w-100 position-absolute bottom-0" src="/forest.png" alt=""/>
        </div>
    )
}

export default UploadLoading;