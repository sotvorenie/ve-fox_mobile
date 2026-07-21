import React, {forwardRef} from "react";

import CrossIcon from "@icons/CrossIcon.tsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
    id: string
    title: string
    visibleCounter?: boolean
    maxLength?: number
    minLength?: number
    value: string
    setValue: (value:string) => void
    className?: string
    hasCross?: boolean
    isTransparent?: boolean
    placeholder?: string
}

const InputUi = forwardRef<HTMLInputElement, Props>(({
    name,
    id,
    title,
    visibleCounter = true,
    maxLength = 20,
    minLength = 0,
    value,
    setValue,
    className,
    hasCross = false,
    isTransparent = false,
    placeholder,
    ...rest
}, ref) => {
    const handleClear = () => {
        setValue('')
    }

    return (
        <label className={`
                    input position-relative 
                    ${hasCross ? 'has-cross' : ''} 
                    ${isTransparent ? 'is-transparent' : ''}
                    ${className}
                `} htmlFor={id}
        >
            <span className="input__name input__text position-absolute">{title}</span>

            <input type="text"
                   className="input__inp w-100"
                   name={name}
                   id={id}
                   placeholder={placeholder}
                   value={value}
                   onChange={(e) => setValue(e.target.value)}
                   maxLength={maxLength}
                   minLength={minLength}
                   ref={ref}
                   {...rest}
            />

            {hasCross && !!(value?.length) && (
                <button type="button"
                        className="input__clear button-width-svg radius-50 hover-color-accent recolor-svg flex-center"
                        onClick={handleClear}
                >
                    <CrossIcon/>
                </button>
            )}

            {visibleCounter && (
                <span className="input__counter input__text position-absolute">
                    {value?.length || 0} / {maxLength}
                </span>
            )}

            <span className="input__error input__text fields_error position-absolute"
                  id={`${id}-error`}
                  data-js-form-field-errors=""
            ></span>
        </label>
    )
})

export default InputUi;