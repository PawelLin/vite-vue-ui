import { ref, computed, ComputedRef } from 'vue'
import { isMobile, isTruthy } from './utils'

interface Props {
    modelValue: string
    maxlength?: number
    regExp?: RegExp
}

interface Emit {
    (e: 'update:modelValue', value: string): void
    (e: 'onInput', value: string): void
}

interface Return {
    onInput: (e: Event) => void
    onKeyup: (e: Event) => void
    onKeydown: (e: Event) => void
    onBlur?: (e: Event) => void
    maxlength?: number
    value: ComputedRef
}

export function useText(props: Props, emit: Emit): Return {
    const targetValue = ref('')
    const value = computed(() => targetValue.value || (isTruthy(props.modelValue) ? `${props.modelValue}` : ''))
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
        if (value && !(!props.regExp || props.regExp.test(value))) {
            target.value = isTruthy(modelValue) ? `${modelValue}` : ''
        } else {
            targetSelection = selectionEnd || 0
        }
        !mobile && setSelection(e)
        emit('update:modelValue', (targetValue.value = target.value))
        emit('onInput', targetValue.value)
    }
    return { onInput, onKeyup, onKeydown, value, maxlength: props.maxlength }
}
