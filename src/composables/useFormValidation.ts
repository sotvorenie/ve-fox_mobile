type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface ErrorMessages {
    valueMissing: () => string;
    patternMismatch: (field: FormField) => string;
    tooShort: (field: FormField) => string;
    tooLong: (field: FormField) => string;
    [key: string]: (field: FormField) => string;
}

const selectors = {
    form: '[data-js-form]',
    fieldErrors: '[data-js-form-field-errors]'
} as const

const errorsList: ErrorMessages = {
    valueMissing: (): string => 'пожалуйста, заполните это поле',
    patternMismatch: (field: FormField) => field.title || 'неверный формат',
    tooShort: (field: FormField): string => {
        const minLength = 'minLength' in field ? field.minLength : -1
        return `минимум символов — ${minLength}`
    },
    tooLong: (field: FormField) => {
        const maxLength = 'maxLength' in field ? field.maxLength : -1
        return `максимум символов — ${maxLength}`
    },
}

function manageErrors(fieldControlElement: FormField, errorMessages: string[]): void {
    const fieldErrorsElement = fieldControlElement.parentElement?.querySelector(selectors.fieldErrors)

    if (!fieldErrorsElement) return

    fieldErrorsElement.innerHTML = errorMessages
        .map((message) => `<span class="field__error">${message}</span>`)
        .join('')
}

function validateField(fieldControlElement: FormField): boolean {
    const errors = fieldControlElement.validity
    const errorMessages: string[] = []

    if (errors.valueMissing) {
        errorMessages.push(errorsList.valueMissing())
    }
    if (errors.patternMismatch) {
        errorMessages.push(errorsList.patternMismatch(fieldControlElement))
    }
    if (errors.tooShort) {
        errorMessages.push(errorsList.tooShort(fieldControlElement))
    }
    if (errors.tooLong) {
        errorMessages.push(errorsList.tooLong(fieldControlElement))
    }

    manageErrors(fieldControlElement, errorMessages)

    const isValid = errorMessages.length === 0
    fieldControlElement.ariaInvalid = (!isValid).toString()

    return isValid
}

function onBlur(event: Event): void {
    const target = event.target as FormField | null

    if (!target) return

    const isFormField = target.closest(selectors.form)
    const isRequired = target.required

    if (isFormField && isRequired) {
        validateField(target)
    }
}

function onInput(event: Event): void {
    const target = event.target as FormField | null

    if (!target) return

    const errorSpan = target.closest('label')?.querySelector('.fields_error')

    if (errorSpan) {
        errorSpan.textContent = ''
    }
}

function onChange(event: Event): void {
    const target = event.target as FormField | null

    if (!target) return

    const isRequired: boolean = target.required
    const isToggleType: boolean = ['radio', 'checkbox'].includes(target.type)

    if (isToggleType && isRequired) {
        validateField(target)
    }
}

function onSubmit(event: Event): boolean {
    const target = event.target as HTMLFormElement | null

    if (!target) return false

    const isFormElement = target.matches(selectors.form)
    if (!isFormElement) {
        return false
    }

    const formElements = Array.from(target.elements) as FormField[]
    const requiredControlElements = formElements.filter(element => element.required)

    let isFormValid = true
    let firstInvalidFieldControl: FormField | null = null

    requiredControlElements.forEach((element) => {
        const isFieldValid = validateField(element)

        if (!isFieldValid) {
            isFormValid = false
            firstInvalidFieldControl ??= element
        }
    })

    if (!isFormValid && firstInvalidFieldControl) {
        event.preventDefault()

        if ('focus' in firstInvalidFieldControl) {
            (firstInvalidFieldControl as HTMLElement).focus()
        }
    }

    return isFormValid
}

export { onBlur, onInput, onSubmit, onChange }