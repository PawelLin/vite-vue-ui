import { computed, ComputedRef } from 'vue'
import { isMobile, isTruthy } from './utils'

interface Props {
    modelValue: string
    format?: 'phone' | 'bankCard' | 'idCard'
}
interface Emit {
    (e: 'update:modelValue', value: string): void
    (e: 'onInput', value: string, valueFormat: string): void
}
interface Return {
    onInput: (e: Event) => void
    onKeyup: (e: Event) => void
    onKeydown: (e: Event) => void
    onBlur?: (e: Event) => void
    value: ComputedRef<string>
    maxlength?: ComputedRef<number>
}
const formats = {
    phone: {
        maxlength: 13,
        onFormat: (val: string) => val.replace(/^(\d{3})(?=\d)/g, '$1 ').replace(/(\d{4})(?=\d)/g, '$1 '),
    },
    bankCard: {
        maxlength: 23,
        onFormat: (val: string) => val.replace(/(\d{4})(?=\d)/g, '$1 '),
    },
    idCard: {
        maxlength: 21,
        onFormat: (val: string) =>
            val
                .replace(/^(\d{6})(\d{4})?(\d{4})?(\w{4})?/g, '$1 $2 $3 $4')
                .replace(/\s+/g, ' ')
                .replace(/\s$/, ''),
    },
}

export function useFormat(props: Props, emit: Emit): Return {
    const maxlength = computed(() => formats[props.format as keyof typeof formats].maxlength)
    const onFormat = computed(() => formats[props.format as keyof typeof formats].onFormat)
    const value = computed(() => onFormat.value(props.modelValue))
    const mobile = isMobile()
    let targetSelection = 0
    const setSelection = (e: Event) => {
        ;(e.target as HTMLInputElement).setSelectionRange(targetSelection, targetSelection)
    }
    const onKeyup = (e: Event) => {
        // console.log('down', e.target.selectionEnd)
        mobile && setSelection(e)
    }
    const onKeydown = (e: Event) => {
        // console.log('down', e.target.selectionEnd)
        targetSelection = (e.target as HTMLInputElement).selectionEnd || 0
    }
    const onInput = (e: Event) => {
        // console.log('input', e.target.selectionEnd)
        const target = e.target as HTMLInputElement
        const { modelValue, format } = props
        const modelValueFormat = onFormat.value(modelValue)
        let { value: valueFormat, selectionEnd } = target
        selectionEnd = selectionEnd || 0
        let value = valueFormat.replace(/[^\d]/g, '')
        const valueTrim = valueFormat.replace(/\s/g, '')
        const lastChar = valueFormat && valueFormat[valueFormat.length - 1].toUpperCase()
        const isInput = valueFormat.length > modelValueFormat.length
        if (format === 'idCard' && selectionEnd === maxlength.value && lastChar === 'X') {
            value += lastChar
            valueFormat = onFormat.value(value)
            targetSelection = selectionEnd
            // 输入非法字符
        } else if (isInput && value !== valueTrim) {
            value = isTruthy(modelValue) ? `${modelValue}` : ''
            valueFormat = modelValueFormat
        } else {
            /**
             * 删除后，前后的value相同，说明删除的是空格，需要处理成把空格前面的数字也删除掉
             * 光标: |
             * 初始: 123 |4
             * 点击删除: 123|4
             * 删除3 & 光标前移: 12|4
             */
            if (!isInput && modelValue === valueTrim) {
                value = (
                    modelValueFormat.substr(0, selectionEnd - 1) +
                    modelValueFormat.substr(selectionEnd, modelValueFormat.length)
                ).replace(/[^\d]/g, '')
                valueFormat = onFormat.value(value)
                selectionEnd -= 1
            } else {
                /**
                 * 光标: |
                 * 初始: 123|
                 * 输入: 4
                 * 结果:        123 |4 // 光标前面为空格
                 * 光标后移一位: 123 4|
                 * 删除: 4
                 * 结果:        123 | // 光标前面为空格
                 * 光标前移一位: 123|
                 */
                valueFormat = onFormat.value(value)
                const selectionChar = valueFormat.substring(selectionEnd - 1, selectionEnd)
                if (valueFormat.length > modelValueFormat.length) {
                    selectionEnd += selectionChar === ' ' ? 1 : 0
                } else {
                    selectionEnd -= selectionChar === ' ' ? 1 : 0
                }
            }
            targetSelection = selectionEnd
        }
        target.value = valueFormat
        !mobile && setSelection(e)
        emit('update:modelValue', value)
        emit('onInput', value, valueFormat)
    }
    return { onInput, onKeyup, onKeydown, value, maxlength }
}
