import { ref, computed, defineComponent, openBlock, createElementBlock, unref } from "vue";
const isMobile = () => /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
const isTruthy = (value) => !!(value || value === 0);
function useNumber(props, emit) {
  const targetValue = ref("");
  const value = computed(() => targetValue.value || (isTruthy(props.modelValue) ? `${props.modelValue}` : ""));
  const DefaultInteger = 8;
  const getMaxNumber = () => `${Array.from(Array(props.integer || DefaultInteger)).fill(9).join("")}${props.decimal ? `.${Array.from(Array(props.decimal)).fill(9).join("")}` : ""}`;
  const maxValidate = (value2) => {
    if (value2 === "-")
      return true;
    const maxValue = Number(props.max || getMaxNumber());
    return Number(value2) === maxValue ? value2 === `${maxValue}` : Number(value2) <= maxValue;
  };
  const minValidate = (value2) => {
    if (value2 === "-")
      return true;
    const minValue = Number(props.min || `-${getMaxNumber()}`);
    return Number(value2) === minValue ? value2 === `${minValue}` : Number(value2) >= minValue;
  };
  const regExp = computed(() => {
    const { integer = DefaultInteger, decimal } = props;
    const intMaxLength = `${Math.abs(props.max || 0)}`.split(".")[0].length;
    const intMinLength = `${Math.abs(props.min || 0)}`.split(".")[0].length;
    const intLength = Math.max(intMaxLength, intMinLength, integer) - 1;
    const string = decimal ? `^-?(0|[1-9]\\d{0,${intLength}})?(\\.\\d{0,${decimal}})?$` : `^-?(0|[1-9]\\d{0,${intLength}})?$`;
    return new RegExp(string);
  });
  const mobile = isMobile();
  let targetSelection = 0;
  const setSelection = (e) => {
    e.target.setSelectionRange(targetSelection, targetSelection);
  };
  const onKeyup = (e) => {
    mobile && setSelection(e);
  };
  const onKeydown = (e) => {
    targetSelection = e.target.selectionEnd || 0;
  };
  const onInput = (e) => {
    const target = e.target;
    const modelValue = props.modelValue;
    const { value: value2, selectionEnd } = target;
    if (value2 && !(regExp.value.test(value2) && maxValidate(value2) && minValidate(value2))) {
      target.value = targetValue.value || (isTruthy(modelValue) ? `${modelValue}` : "");
    } else {
      targetSelection = selectionEnd || 0;
    }
    !mobile && setSelection(e);
    emit("update:modelValue", targetValue.value = target.value);
    emit("onInput", targetValue.value);
  };
  const onBlur = (e) => {
    const value2 = e.target.value;
    if (value2) {
      const value2number = Number(value2);
      emit("update:modelValue", targetValue.value = isTruthy(value2number) ? `${value2number}` : "");
    }
    emit("onBlur", targetValue.value);
  };
  return { onInput, onBlur, onKeyup, onKeydown, value };
}
const formats = {
  phone: {
    maxlength: 13,
    onFormat: (val) => val.replace(/^(\d{3})(?=\d)/g, "$1 ").replace(/(\d{4})(?=\d)/g, "$1 ")
  },
  bankCard: {
    maxlength: 23,
    onFormat: (val) => val.replace(/(\d{4})(?=\d)/g, "$1 ")
  },
  idCard: {
    maxlength: 21,
    onFormat: (val) => val.replace(/^(\d{6})(\d{4})?(\d{4})?(\w{4})?/g, "$1 $2 $3 $4").replace(/\s+/g, " ").replace(/\s$/, "")
  }
};
function useFormat(props, emit) {
  const maxlength = computed(() => formats[props.format].maxlength);
  const onFormat = computed(() => formats[props.format].onFormat);
  const value = computed(() => onFormat.value(props.modelValue));
  const mobile = isMobile();
  let targetSelection = 0;
  const setSelection = (e) => {
    e.target.setSelectionRange(targetSelection, targetSelection);
  };
  const onKeyup = (e) => {
    mobile && setSelection(e);
  };
  const onKeydown = (e) => {
    targetSelection = e.target.selectionEnd || 0;
  };
  const onInput = (e) => {
    const target = e.target;
    const { modelValue, format } = props;
    const modelValueFormat = onFormat.value(modelValue);
    let { value: valueFormat, selectionEnd } = target;
    selectionEnd = selectionEnd || 0;
    let value2 = valueFormat.replace(/[^\d]/g, "");
    const valueTrim = valueFormat.replace(/\s/g, "");
    const lastChar = valueFormat && valueFormat[valueFormat.length - 1].toUpperCase();
    const isInput = valueFormat.length > modelValueFormat.length;
    if (format === "idCard" && selectionEnd === maxlength.value && lastChar === "X") {
      value2 += lastChar;
      valueFormat = onFormat.value(value2);
      targetSelection = selectionEnd;
    } else if (isInput && value2 !== valueTrim) {
      value2 = isTruthy(modelValue) ? `${modelValue}` : "";
      valueFormat = modelValueFormat;
    } else {
      if (!isInput && modelValue === valueTrim) {
        value2 = (modelValueFormat.substr(0, selectionEnd - 1) + modelValueFormat.substr(selectionEnd, modelValueFormat.length)).replace(/[^\d]/g, "");
        valueFormat = onFormat.value(value2);
        selectionEnd -= 1;
      } else {
        valueFormat = onFormat.value(value2);
        const selectionChar = valueFormat.substring(selectionEnd - 1, selectionEnd);
        if (valueFormat.length > modelValueFormat.length) {
          selectionEnd += selectionChar === " " ? 1 : 0;
        } else {
          selectionEnd -= selectionChar === " " ? 1 : 0;
        }
      }
      targetSelection = selectionEnd;
    }
    target.value = valueFormat;
    !mobile && setSelection(e);
    emit("update:modelValue", value2);
    emit("onInput", value2, valueFormat);
  };
  return { onInput, onKeyup, onKeydown, value, maxlength };
}
function useText(props, emit) {
  const targetValue = ref("");
  const value = computed(() => targetValue.value || (isTruthy(props.modelValue) ? `${props.modelValue}` : ""));
  const mobile = isMobile();
  let targetSelection = 0;
  const setSelection = (e) => {
    e.target.setSelectionRange(targetSelection, targetSelection);
  };
  const onKeyup = (e) => {
    mobile && setSelection(e);
  };
  const onKeydown = (e) => {
    targetSelection = e.target.selectionEnd || 0;
  };
  const onInput = (e) => {
    const target = e.target;
    const modelValue = props.modelValue;
    const { value: value2, selectionEnd } = target;
    if (value2 && !(!props.regExp || props.regExp.test(value2))) {
      target.value = isTruthy(modelValue) ? `${modelValue}` : "";
    } else {
      targetSelection = selectionEnd || 0;
    }
    !mobile && setSelection(e);
    emit("update:modelValue", targetValue.value = target.value);
    emit("onInput", targetValue.value);
  };
  return { onInput, onKeyup, onKeydown, value, maxlength: props.maxlength };
}
const _hoisted_1 = ["value", "inputmode", "maxlength", "placeholder"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "component",
  props: {
    modelValue: null,
    type: null,
    maxlength: null,
    integer: null,
    decimal: null,
    max: null,
    min: null,
    format: null,
    regExp: null,
    placeholder: null
  },
  emits: ["update:modelValue", "onInput", "onBlur"],
  setup(__props, { emit }) {
    const props = __props;
    const inputmode = computed(() => props.type === "number" || props.format ? "numeric" : "text");
    const useEvent = () => {
      let result;
      if (props.format) {
        result = useFormat(props, emit);
      } else if (props.type === "number") {
        result = useNumber(props, emit);
      } else {
        result = useText(props, emit);
      }
      return result;
    };
    const { onInput, onBlur, onKeyup, onKeydown, value, maxlength } = useEvent();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("input", {
        value: unref(value),
        onInput: _cache[0] || (_cache[0] = (...args) => unref(onInput) && unref(onInput)(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => unref(onBlur) && unref(onBlur)(...args)),
        onKeyup: _cache[2] || (_cache[2] = (...args) => unref(onKeyup) && unref(onKeyup)(...args)),
        onKeydown: _cache[3] || (_cache[3] = (...args) => unref(onKeydown) && unref(onKeydown)(...args)),
        type: "text",
        inputmode: unref(inputmode),
        maxlength: unref(maxlength),
        placeholder: __props.placeholder
      }, null, 40, _hoisted_1);
    };
  }
});
_sfc_main.install = function(app) {
  app.component("PwInput", _sfc_main);
  return app;
};
var components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PwInput: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
var main = {
  install(app) {
    Object.keys(components).forEach((key) => {
      const component = components[key];
      if (component.install) {
        component.install(app);
      }
    });
    return app;
  }
};
export { _sfc_main as PwInput, main as default };
