<script lang="ts" setup>
import { computed } from 'vue'
import { useNumber, useFormat, useText } from './hooks'

interface Props {
    modelValue: string | number
    type?: 'text' | 'number'
    maxlength?: number
    integer?: number
    decimal?: number
    max?: number
    min?: number
    format?: 'phone' | 'bankCard' | 'idCard'
    regExp?: RegExp
    placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'onInput', 'onBlur'])
const inputmode = computed(() => (props.type === 'number' || props.format ? 'numeric' : 'text'))
const useEvent = () => {
    let result
    if (props.format) {
        result = useFormat(props as Props & { modelValue: string }, emit)
    } else if (props.type === 'number') {
        result = useNumber(props as Props & { integer: number }, emit)
    } else {
        result = useText(props as Props & { modelValue: string }, emit)
    }
    return result
}
const { onInput, onBlur, onKeyup, onKeydown, value, maxlength } = useEvent()
</script>

<template>
    <input
        :value="value"
        @input="onInput"
        @blur="onBlur"
        @keyup="onKeyup"
        @keydown="onKeydown"
        type="text"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :placeholder="placeholder"
    />
</template>
