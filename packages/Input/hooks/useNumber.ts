import { ref, computed, ComputedRef } from 'vue'
import { isMobile, isTruthy } from './utils'

interface Props {
    modelValue: string | number
    integer: number
    decimal?: number
    max?: number
    min?: number
}

interface Emit {
    (e: 'update:modelValue', value: string): void
    (e: 'onInput', value: string): void
    (e: 'onBlur', value: string): void
}

interface Return {
    onInput: (e: Event) => void
    onKeyup: (e: Event) => void
    onKeydown: (e: Event) => void
    onBlur?: (e: Event) => void
    value: ComputedRef
    maxlength?: number
}

export function useNumber(props: Props, emit: Emit): Return {
    const targetValue = ref('')
    const value = computed(() => targetValue.value || (isTruthy(props.modelValue) ? `${props.modelValue}` : ''))
    const DefaultInteger = 8
    const getMaxNumber = () =>
        `${Array.from(Array(props.integer || DefaultInteger))
            .fill(9)
            .join('')}${props.decimal ? `.${Array.from(Array(props.decimal)).fill(9).join('')}` : ''}`
    const maxValidate = (value: string) => {
        if (value === '-') return true
        const maxValue = Number(props.max || getMaxNumber())
        return Number(value) === maxValue ? value === `${maxValue}` : Number(value) <= maxValue
    }
    const minValidate = (value: string) => {
        if (value === '-') return true
        const minValue = Number(props.min || `-${getMaxNumber()}`)
        return Number(value) === minValue ? value === `${minValue}` : Number(value) >= minValue
    }
    const regExp = computed(() => {
        const { integer = DefaultInteger, decimal } = props
        const intMaxLength = `${Math.abs(props.max || 0)}`.split('.')[0].length
        const intMinLength = `${Math.abs(props.min || 0)}`.split('.')[0].length
        const intLength = Math.max(intMaxLength, intMinLength, integer) - 1
        const string = decimal
            ? `^-?(0|[1-9]\\d{0,${intLength}})?(\\.\\d{0,${decimal}})?$`
            : `^-?(0|[1-9]\\d{0,${intLength}})?$`
        return new RegExp(string)
    })
    const mobile = isMobile()
    let targetSelection = 0
    const setSelection = (e: Event) => {
        ;(e.target as HTMLInputElement).setSelectionRange(targetSelection, targetSelection)
    }
    const onKeyup = (e: Event) => {
        mobile && setSelection(e)
    }
    const onKeydown = (e: Event) => {
        targetSelection = (e.target as HTMLInputElement).selectionEnd || 0
    }
    const onInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        const modelValue = props.modelValue
        const { value, selectionEnd } = target
        if (value && !(regExp.value.test(value) && maxValidate(value) && minValidate(value))) {
            target.value = targetValue.value || (isTruthy(modelValue) ? `${modelValue}` : '')
        } else {
            targetSelection = selectionEnd || 0
        }
        !mobile && setSelection(e)
        emit('update:modelValue', (targetValue.value = target.value))
        emit('onInput', targetValue.value)
    }
    const onBlur = (e: Event) => {
        const value = (e.target as HTMLInputElement).value
        if (value) {
            const value2number = Number(value)
            emit('update:modelValue', (targetValue.value = isTruthy(value2number) ? `${value2number}` : ''))
        }
        emit('onBlur', targetValue.value)
    }
    return { onInput, onBlur, onKeyup, onKeydown, value }
}
