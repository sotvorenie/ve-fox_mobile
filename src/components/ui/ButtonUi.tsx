import React from "react";

import LoadingIcon from "@icons/LoadingIcon";

interface Props {
    isLoading?: boolean
    isDisabled?: boolean
    isActive?: boolean
    isSubmit?: boolean
    className?: string
    func: () => void
    children: React.ReactNode
}

function ButtonUi({isLoading, isDisabled, isActive, isSubmit, className, children, func}: Readonly<Props>) {
    return (
        <button
            className={`button recolor-svg button-width-svg position-relative ${isActive ? ' is-active' : ''} ${className}`}
            type={isSubmit ? 'submit' : 'button'}
            disabled={isLoading || isDisabled}
            onClick={func}
        >
            <span
                className="button__span"
                style={{opacity: isLoading ? 0 : 1}}
            >
                {children}
            </span>

            {isLoading && (
                <LoadingIcon className="absolute-center"/>
            )}
        </button>
    )
}

export default ButtonUi;